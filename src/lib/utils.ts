import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import * as hubspot from "@/lib/hubspot";
import * as db from "@/lib/db";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export async function registerNewApp( appId: number,
                                      clientId: string,
                                      clientSecret: string,
                                      scopes: string,
                                      redirectUrl: string) {

  // Generate install URL based on given params
  const installUrl = hubspot.getInstallUrl(clientId, redirectUrl, scopes);

  // Add app to the database
  return await db.storeHubSpotApp(appId, clientId, clientSecret, scopes, installUrl, redirectUrl);
}
