"use client"

import { useState, useEffect } from "react";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui-lib/card";
import { Button } from "@/components/ui-lib/button";
import { Plus, ExternalLink, Calendar, Key } from "lucide-react";
import RegisterAppPanel from '@/components/custom/registerAppPanel';
import RegisteredAppsTable from '@/components/custom/registeredAppsTable';

export default function Home() {
    // Data state
    const [apps, setApps] = useState<AppDatabaseRecord[] | null>(null);
    const [loading, setLoading] = useState(true);

    // Panel state
    const [isSheetOpen, setIsSheetOpen] = useState(false);

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

    // Handle opening the registration panel
    const handleRegistrationPanelOpen = () => {
        setIsSheetOpen(true);
    };

    // Handle closing the registration panel
    const handleRegistrationPanelClose = () => {
        setIsSheetOpen(false);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
                <div className="text-lg text-slate-600 dark:text-slate-400">Loading apps...</div>
            </div>
        );
    }
		return (
				<>
						<div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
								<div className="container mx-auto px-4 py-8">
										{/* Header */}
										<div className="mb-8">
												<div className="flex items-center justify-between">
														<div>
																<h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100 mb-2">
																		HubSpot OAuth Factory
																</h1>
																<p className="text-lg text-slate-600 dark:text-slate-400">
																		Tired of dealing with OAuth? Me too!
																</p>
														</div>
														<Button size="lg" className="gap-2" onClick={handleRegistrationPanelOpen}>
																<Plus className="h-4 w-4" />
																Register New App
														</Button>
												</div>
										</div>

										{/* Stats Cards */}
										<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
												<Card className="border-0 shadow-lg bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm">
														<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
																<CardTitle className="text-sm font-medium">Total Apps</CardTitle>
																<Key className="h-4 w-4 text-blue-600" />
														</CardHeader>
														<CardContent>
																<div className="text-2xl font-bold">{apps?.length}</div>
																<p className="text-xs text-muted-foreground">
																		Registered apps
																</p>
														</CardContent>
												</Card>
												<Card className="border-0 shadow-lg bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm">
														<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
																<CardTitle className="text-sm font-medium">Active Apps</CardTitle>
																<ExternalLink className="h-4 w-4 text-green-600" />
														</CardHeader>
														<CardContent>
																<div className="text-2xl font-bold">
																		{/* {apps.appRecords?.filter((app) => app.status === "active").length} */}
																</div>
																<p className="text-xs text-muted-foreground">
																		Currently active
																</p>
														</CardContent>
												</Card>
												<Card className="border-0 shadow-lg bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm">
														<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
																<CardTitle className="text-sm font-medium">Recent</CardTitle>
																<Calendar className="h-4 w-4 text-purple-600" />
														</CardHeader>
														<CardContent>
																<div className="text-2xl font-bold">
																		{/* {apps.filter((app) => {
																				const weekAgo = new Date();
																				weekAgo.setDate(weekAgo.getDate() - 7);
																				return new Date(app.created_at) > weekAgo;
																		}).length} */}
																</div>
																<p className="text-xs text-muted-foreground">
																		Added this week
																</p>
														</CardContent>
												</Card>
										</div>

										{/* Apps Table */}
										<RegisteredAppsTable onRegisterNewAppClicked={handleRegistrationPanelOpen} />
								</div>
						</div>

						{/* Registration Side Panel */}
						<RegisterAppPanel open={isSheetOpen} onOpenChange={setIsSheetOpen} onClose={handleRegistrationPanelClose} />
				</>
		);
}
