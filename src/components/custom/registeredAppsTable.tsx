"use client"

import React from 'react';
import { useState, useEffect } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui-lib/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui-lib/table";
import { Button } from "@/components/ui-lib/button";
import { Plus, ExternalLink, Key } from "lucide-react";

interface RegisteredAppsTableProps {
  onRegisterNewAppClicked: () => void;
}

const RegisteredAppsTable = (props: RegisteredAppsTableProps) => {
  const [apps, setApps] = useState<AppDatabaseRecord[] | null>(null);
  const [loading, setLoading] = useState(true);

  // Load apps data on component mount
  useEffect(() => {
      const loadApps = async () => {
          try {
              const response = await fetch('/api/registeredApps');
              const result = await response.json();
              setApps(result.appRecords);
          }
          catch (error) {
              console.error('Failed to load apps:', error);
              setApps(null);
          }
          finally {
              setLoading(false);
          }
      };

      loadApps();
  }, []);

  return (
    <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
      <CardHeader>
          <CardTitle className="text-xl">Registered Apps</CardTitle>
          <CardDescription>
              Register an app with OAuth Factory to get started
          </CardDescription>
      </CardHeader>
      <CardContent>
          {apps === null || apps?.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Key className="h-12 w-12 text-slate-400 mb-4" />
                  <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-2">
                      No apps registered yet
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 mb-4">
                      Get started by registering your first HubSpot application
                  </p>
                  <Button onClick={props.onRegisterNewAppClicked}>
                      <Plus className="h-4 w-4 mr-2" />
                      Register First App
                  </Button>
              </div>
          ) : (
              <div className="rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
                  {loading ? (
                    <div className="flex items-center justify-center py-12">
                      <span className="text-slate-500 dark:text-slate-400 text-sm">Loading apps...</span>
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-slate-50 dark:bg-slate-800/50">
                          <TableHead className="font-semibold">App ID</TableHead>
                          <TableHead className="font-semibold">Client ID</TableHead>
                          <TableHead className="font-semibold">Install URL</TableHead>
                          <TableHead className="font-semibold text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {apps?.map((app) => (
                          <TableRow
                            key={app.id}
                            className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors"
                          >
                            <TableCell className="font-medium">
                              <div className="flex items-center gap-2">
                                {app.app_id}
                              </div>
                            </TableCell>
                            <TableCell>
                              <code className="bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded text-sm">
                                {app.client_id}
                              </code>
                            </TableCell>
                            <TableCell className="max-w-xs flex items-center gap-2">
                              <code className="w-full truncate bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded text-sm">{app.install_url}</code>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="p-1 cursor-pointer"
                                title="Copy to clipboard"
                                onClick={async (e) => {
                                  await navigator.clipboard.writeText(app.install_url);
                                  const overlay = document.createElement("div");
                                  overlay.textContent = "Copied install URL";
                                  overlay.style.position = "fixed";
                                  overlay.style.zIndex = "9999";
                                  overlay.style.background = "#1e293b";
                                  overlay.style.color = "#fff";
                                  overlay.style.padding = "4px 10px";
                                  overlay.style.borderRadius = "6px";
                                  overlay.style.fontSize = "13px";
                                  overlay.style.pointerEvents = "none";
                                  overlay.style.boxShadow = "0 2px 8px rgba(0,0,0,0.12)";
                                  overlay.style.transition = "opacity 0.2s";
                                  overlay.style.opacity = "1";
                                  overlay.style.left = `${e.clientX - 60}px`;
                                  overlay.style.top = `${e.clientY - 30}px`;
                                  document.body.appendChild(overlay);
                                  setTimeout(() => {
                                    overlay.style.opacity = "0";
                                    setTimeout(() => document.body.removeChild(overlay), 200);
                                  }, 1000);
                                }}
                              > Copy </Button>
                            </TableCell>
                            <TableCell className="text-sm text-slate-600 dark:text-slate-400">
                              {/* {new Date(app.created_at).toLocaleDateString()} */}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end gap-2">
                                <Button variant="outline" size="sm">
                                  Edit
                                </Button>
                                <Button variant="outline" size="sm">
                                  <ExternalLink className="h-3 w-3" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
              </div>
          )}
      </CardContent>
  </Card>
  )
}

export default RegisteredAppsTable;
