/**
 * Utility functions for interacting with the HubSpot API using the official client library.
 * Provides methods for OAuth flow, token management, and data retrieval from HubSpot.
 */

import * as db from "@/lib/db";
import { Client } from "@hubspot/api-client";
const hubspotClient = new Client();

// Get OAuth URL
// This returns the URL that users will visit to install your app
export function getInstallUrl(clientId: string, scopes: string, redirectUri: string) {

  // The correct parameter order is: clientId, redirectUri, scopes (as a space-separated string)
  return hubspotClient.oauth.getAuthorizationUrl(
    clientId,
    redirectUri,
    scopes
  );
}

// Exchange code for tokens
// After the user authorizes your app, HubSpot redirects to your callback URL with a code
// This function exchanges that code for access and refresh tokens
export async function exchangeForTokens(code: string, redirectUri: string) {
  const tokenData = await hubspotClient.oauth.tokensApi.create(
    "authorization_code",
    code,
    redirectUri,
    process.env.HUBSPOT_CLIENT_ID,
    process.env.HUBSPOT_CLIENT_SECRET
  );
  return tokenData;
}

// Refresh tokens
// Access tokens expire, so you need to use the refresh token to get a new access token
export async function refreshToken(refreshToken: string) {
  const tokenData = await hubspotClient.oauth.tokensApi.create(
    "refresh_token",
    undefined,
    undefined,
    process.env.HUBSPOT_CLIENT_ID,
    process.env.HUBSPOT_CLIENT_SECRET,
    refreshToken
  );
  return tokenData;
}

// Stores a new app install in the database and local cache
export async function storeInstall(
  appId: number,
  portalId: number,
  accessToken: string,
  refreshToken: string,
  expiresIn: number
) {
  try {
    // Get creation and expiration timestamps
    //const createDate = new Date();
    const expiration = new Date(Date.now() + expiresIn * 1000);

    // Update database
    return await db.storeHubSpotInstall(
      appId,
      portalId,
      accessToken,
      refreshToken,
      expiration
    );
  }
  catch (error) {
    console.error("Error storing install info:", error);
    return { success: false, error };
  }
}

// Check if an access token is expired and refresh it if needed
export async function getValidAccessToken(appId: number, portalId: number):
  Promise< {success: boolean; accessToken: string | null, error: string | null}> {
  try {
    const { success, installRecord, error } = await db.getHubSpotInstall(
      appId,
      portalId
    );

    if (!success || !installRecord) {
      return { success: false, accessToken: null, error};
    }

    // Check if the token is expired
    const now = new Date();
    const expiresAt = installRecord.expires_at;

    if (expiresAt <= now) {
      // Token is expired, we need to refresh it
      const tokenData = await refreshToken(installRecord.refresh_token);
      return { success: true, accessToken: tokenData.accessToken, error: null };
    }

    return { success: true, accessToken: installRecord.access_token, error: null };
  }
  catch (err) {
    console.error("Failed to get valid access token:", err);
    return { success: false, accessToken: null, error: "Failed to get a valid access token." };
  }
}

// Get HubSpot account info
// This retrieves information about the HubSpot account associated with the given portal
export async function getAccountInfoFromPortal(appId: number, portalId: number) {
  try {
    const tokenData = await getValidAccessToken(appId, portalId);
    if (tokenData.success && tokenData.accessToken) {
      hubspotClient.setAccessToken(tokenData.accessToken);
      const accountInfo = await hubspotClient.oauth.accessTokensApi.get(
        tokenData.accessToken
      );
      return accountInfo;
    }
  }
  catch (error) {
    console.error("Error getting account info from portal:", error);
    return null;
  }
}

// Get HubSpot account info
// This retrieves information about the HubSpot account associated with the given access token
export async function getAccountInfoFromAccessToken(accessToken: string) {
  hubspotClient.setAccessToken(accessToken);
  return await hubspotClient.oauth.accessTokensApi.get(accessToken);
}

// Get HubSpot deals
// This retrieves a list of deals from the HubSpot CRM
export async function getDeals(appId: number, portalId: number, limit = 10) {
  const tokenData = await getValidAccessToken(appId, portalId);
  if (tokenData.success && tokenData.accessToken) {
    hubspotClient.setAccessToken(tokenData.accessToken);
  }
  else {
    throw new Error("Access token is missing or invalid.");
  }
  return await hubspotClient.crm.deals.basicApi.getPage(limit);
}

// Get HubSpot contacts
// This retrieves a list of contacts from the HubSpot CRM
export async function getContacts(appId: number, portalId: number, limit = 10) {
  const tokenData = await getValidAccessToken(appId, portalId);
  if (tokenData.success && tokenData.accessToken) {
    hubspotClient.setAccessToken(tokenData.accessToken);
  }
  else {
    throw new Error("Access token is missing or invalid.");
  }
  return await hubspotClient.crm.contacts.basicApi.getPage(limit);
}

// Get HubSpot owners (sales reps)
// This retrieves a list of owners (users) from the HubSpot CRM
export async function getOwners(appId: number, portalId: number) {
  const tokenData = await getValidAccessToken(appId, portalId);
  if (tokenData.success && tokenData.accessToken) {
    hubspotClient.setAccessToken(tokenData.accessToken);
  }
  else {
    throw new Error("Access token is missing or invalid.");
  }
  return await hubspotClient.crm.owners.ownersApi.getPage();
}
