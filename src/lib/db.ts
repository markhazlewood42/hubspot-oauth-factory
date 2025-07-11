/**
 * Database utility functions for connecting to Supabase and managing app data.
 * Provides methods for storing and retrieving HubSpot app installations.
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
  clientSecret: string
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
          clien_secret: clientSecret
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
          client_secret: clientSecret
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

// Get a HubSpot installation by portal ID
export async function getHubSpotInstall(appId: string, portalId: string) {
  try {
    const { data, error } = await supabaseAdmin
      .from("hubspot_installs")
      .select("*")
      .eq("app_id", appId)
      .eq("portal_id", portalId)
      .single();

    if (error) {
      return { success: false, error: error.message };
    }

    if (!data) {
      return { success: false, error: "Installation not found" };
    }

    return { success: true, installRecord: data };
  } catch (error) {
    console.error("Failed to get HubSpot installation:", error);
    return { success: false, error };
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
