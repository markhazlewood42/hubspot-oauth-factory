/**
 * Database utility functions for connecting to Supabase and managing app data.
 * Provides methods for storing and retrieving HubSpot apps and installations.
 */
//import { create } from "domain";
import { supabaseAdmin } from "./supabase";

// Initialize the database by creating necessary tables if they don't exist
export async function initDatabase() {
  try {
    // Check if the apps table exists
    const { data: appTableExists } = await supabaseAdmin
      .from("hubspot_apps")
      .select("*")
      .limit(1);

    // If the table doesn't exist, we need to create it
    // Note: Supabase doesn't have a direct "CREATE TABLE IF NOT EXISTS" equivalent in the JS client
    // You would typically create tables through the Supabase dashboard or migrations

    if (appTableExists === null) {
      console.warn(
        "The hubspot_apps table might not exist. Please create it in the Supabase dashboard."
      );
      return { success: false, error: "Apps table might not exist" };
    }

    // Check if the installs table exists
    const { data: installTableExists } = await supabaseAdmin
      .from("hubspot_installs")
      .select("*")
      .limit(1);

    // If the table doesn't exist, we need to create it
    // Note: Supabase doesn't have a direct "CREATE TABLE IF NOT EXISTS" equivalent in the JS client
    // You would typically create tables through the Supabase dashboard or migrations

    if (installTableExists === null) {
      console.warn(
        "The hubspot_installs table might not exist. Please create it in the Supabase dashboard."
      );
      return { success: false, error: "Table might not exist" };
    }

    console.log("Database initialized successfully");
    return { success: true };
  } catch (error) {
    console.error("Failed to initialize database:", error);
    return { success: false, error };
  }
}

// Store a new HubSpot app or update an existing one
export async function storeHubSpotApp(
  appId: number,
  clientId: string,
  clientSecret: string,
  scopes: string,
  installUrl: string | null,
  redirectUrl: string | null
) {
  try {
    // Check if an installation already exists for this portal
    const { data: existingApp } = await supabaseAdmin
      .from("hubspot_apps")
      .select("*")
      .eq("app_id", appId)
      .single();

    let result = null;
    if (existingApp) {
      // Update existing installation
      result = await supabaseAdmin
        .from("hubspot_apps")
        .update({
          client_id: clientId,
          client_secret: clientSecret,
          configured_scopes: scopes,
          install_url: installUrl,
          redirect_url: redirectUrl
        })
        .eq("app_id", appId)
        .select()
        .single();
    }
    else {
      // Insert new installation
      result = await supabaseAdmin
        .from("hubspot_apps")
        .insert({
          app_id: appId,
          client_id: clientId,
          client_secret: clientSecret,
          configured_scopes: scopes,
          install_url: installUrl,
          redirect_url: redirectUrl
        })
        .select()
        .single();
    }

    if (result.error) {
      throw result.error;
    }

    return { success: true, appRecord: result.data };
  }
  catch (error) {
    console.error("Failed to store HubSpot app:", error);
    return { success: false, error };
  }

}

// Store a new HubSpot app installation or update an existing one
export async function storeHubSpotInstall(
  appId: number,
  portalId: number,
  accessToken: string,
  refreshToken: string,
  expiresAt: Date
) {
  try {
    // Check if an installation already exists for this portal
    const { data: existingInstall } = await supabaseAdmin
      .from("hubspot_installs")
      .select("*")
      .eq("app_id", appId)
      .eq("portal_id", portalId)
      .single();

    let result = null;
    if (existingInstall) {
      // Update existing installation
      result = await supabaseAdmin
        .from("hubspot_installs")
        .update({
          access_token: accessToken,
          refresh_token: refreshToken,
          expires_at: expiresAt.toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq("app_id", appId)
        .eq("portal_id", portalId)
        .select()
        .single();
    } else {
      // Insert new installation
      result = await supabaseAdmin
        .from("hubspot_installs")
        .insert({
          appid: appId,
          portal_id: portalId,
          access_token: accessToken,
          refresh_token: refreshToken,
          expires_at: expiresAt.toISOString(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();
    }

    if (result.error) {
      throw result.error;
    }

    return { success: true, install: result.data };
  }
  catch (error) {
    console.error("Failed to store HubSpot installation:", error);
    return { success: false, error };
  }
}

// Get a registered app by its ID
export async function getRegisteredApp(appId: number):
  Promise< {success: boolean, appRecord: AppDatabaseRecord | null, error: string} > {
    try {
      const { data, error } = await supabaseAdmin
        .from("hubspot_apps")
        .select("*")
        .eq("app_id", appId)
        .single();

        if (error) {
          return { success: false, appRecord: null, error: error.message };
        }

        if (!data) {
          return { success: false, appRecord: null, error: "Installation not found" };
        }

        // Explicitly construct the AppDatabaseRecord object from the returned data
        const returnData: AppDatabaseRecord = {
          id: data.id as number,
          app_id: data.app_id as number,
          client_id: data.client_id as string,
          client_secret: data.client_secret as string,
          configured_scopes: data.configured_scopes as string,
          install_url: data.install_url as string,
          redirect_url: data.redirect_url as string
        };

        return { success: true, appRecord: returnData, error: ""};
    }
    catch (err) {
      console.error("Failed to get registered app:", err);
      return { success: false, appRecord: null, error: err as string }
    }
}

// Get all currently registered apps.
export async function getAllRegisteredApps():
  Promise< {success: boolean, appRecords: AppDatabaseRecord[] | null, error: string} > {
    try {
      const { data, error } = await supabaseAdmin
        .from("hubspot_apps")
        .select("*");

      if (error) {
        return { success: false, appRecords: null, error: error.message };
      }

      if (!data) {
        return { success: false, appRecords: null, error: "No apps found" };
      }

      const appRecords: AppDatabaseRecord[] = data.map((item) => ({
        id: item.id as number,
        app_id: item.app_id as number,
        client_id: item.client_id as string,
        client_secret: item.client_secret as string,
        configured_scopes: item.configured_scopes as string,
        install_url: item.install_url as string,
        redirect_url: item.redirect_url as string
      }));

      return { success: true, appRecords, error: "" };
    }
    catch (err) {
      console.error("Failed to get all registered apps:", err);
      return { success: false, appRecords: null, error: err as string };
    }
}

// Get a HubSpot installation by app ID and portal ID
export async function getHubSpotInstall(appId: number, portalId: number):
  Promise< {success: boolean, installRecord: InstallDatabaseRecord | null, error: string} > {
  try {
    const { data, error: sb_error } = await supabaseAdmin
      .from("hubspot_installs")
      .select("*")
      .eq("app_id", appId)
      .eq("portal_id", portalId)
      .single();

    if (sb_error) {
      return { success: false, installRecord: null, error: `An installation for app ${appId} on portal ${portalId} wasn't found. ${sb_error.message}` };
    }

    if (!data) {
      return { success: false, installRecord: null, error: `An installation for app ${appId} on portal ${portalId} wasn't found.` };
    }

    const returnData: InstallDatabaseRecord = {
      id: data.id as number,
      app_id: data.app_id as number,
      portal_id: data.portal_id as string,
      access_token: data.access_token as string,
      refresh_token: data.refresh_token as string,
      expires_at: new Date(data.expires_at as string),
      created_at: new Date(data.created_at as string),
      updated_at: new Date(data.updated_at as string)
    }

    return { success: true, installRecord: returnData, error: "" };
  }
  catch (err) {
    console.error(`Failed to get HubSpot installation for app ${appId} on portal ${portalId}:`, err);
    return { success: false, installRecord: null, error: err as string }
  }
}

// Get all HubSpot installations
export async function getAllHubSpotInstalls() {
  try {
    const { data, error } = await supabaseAdmin
      .from("hubspot_installs")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, installs: data };
  } catch (error) {
    console.error("Failed to get HubSpot installations:", error);
    return { success: false, error };
  }
}

// Get all HubSpot installations for a specific app
export async function getAllHubSpotInstallsForApp(appId: string) {
  try {
    const { data, error } = await supabaseAdmin
      .from("hubspot_installs")
      .select("*")
      .eq("app_id", appId)
      .order("created_at", { ascending: false });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, installs: data };
  } catch (error) {
    console.error("Failed to get HubSpot installations:", error);
    return { success: false, error };
  }
}

// Delete a HubSpot installation
export async function deleteHubSpotInstall(appId: string, portalId: string) {
  try {
    const { data, error } = await supabaseAdmin
      .from("hubspot_installs")
      .delete()
      .eq("app_id", appId)
      .eq("portal_id", portalId)
      .select()
      .single();

    if (error) {
      return { success: false, error: error.message };
    }

    if (!data) {
      return { success: false, error: "Installation not found" };
    }

    return { success: true, install: data };
  } catch (error) {
    console.error("Failed to delete HubSpot installation:", error);
    return { success: false, error };
  }
}
