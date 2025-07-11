'use client'

import { useState, useEffect } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
//import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    //SheetTrigger,
} from "@/components/ui/sheet";
import { Plus, ExternalLink, Calendar, Key } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface FormData {
    appId: string;
    clientId: string;
    clientSecret: string;
    scopes: string;
    installUrl: string;
    redirectUrl: string;
}

export default function Home() {
    // Data state
    const [apps, setApps] = useState<AppDatabaseRecord[] | null>(null);
    const [loading, setLoading] = useState(true);

    // Panel state
    const [isSheetOpen, setIsSheetOpen] = useState(false);

    // Form state
    const [formData, setFormData] = useState<FormData>({
        appId: '',
        clientId: '',
        clientSecret: '',
        scopes: '',
        installUrl: '',
        redirectUrl: ''
    });

    // Form submission state
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [submitSuccess, setSubmitSuccess] = useState(false);

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

    // Handle form input changes
    const handleInputChange = (field: keyof FormData, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    // Handle opening the registration panel
    const handleOpenRegistration = () => {
        setIsSheetOpen(true);
        setSubmitError(null);
        setSubmitSuccess(false);
        // Reset form data
        setFormData({
            appId: '',
            clientId: '',
            clientSecret: '',
            scopes: '',
            installUrl: '',
            redirectUrl: ''
        });
    };

    // Handle closing the registration panel
    const handleCloseRegistration = () => {
        setIsSheetOpen(false);
        setSubmitError(null);
        setSubmitSuccess(false);
    };

    // Handle form submission
    const handleSubmit = async () => {
        setIsSubmitting(true);
        setSubmitError(null);

        try {
            // Convert appId to number for the storeHubSpotApp function
            const appIdNumber = parseInt(formData.appId);
            if (isNaN(appIdNumber)) {
                throw new Error('App ID must be a valid number');
            }

            // Call the storeHubSpotApp function
            // Note: You'll need to create a server action or API route for this
            console.log('Submitting form data:', {
                appId: appIdNumber,
                clientId: formData.clientId,
                clientSecret: formData.clientSecret,
                scopes: formData.scopes,
                installUrl: formData.installUrl || null,
                redirectUrl: formData.redirectUrl || null
            });

            // For now, just close the panel and show success
            setSubmitSuccess(true);
            setTimeout(() => {
                handleCloseRegistration();
                // Reload apps data
                window.location.reload();
            }, 1000);

        } catch (error) {
            setSubmitError(error instanceof Error ? error.message : 'Failed to register app');
        } finally {
            setIsSubmitting(false);
        }
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
														<Button size="lg" className="gap-2" onClick={handleOpenRegistration}>
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
																		<Button onClick={handleOpenRegistration}>
																				<Plus className="h-4 w-4 mr-2" />
																				Register First App
																		</Button>
																</div>
														) : (
																<div className="rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
																		<Table>
																				<TableHeader>
																						<TableRow className="bg-slate-50 dark:bg-slate-800/50">
																								<TableHead className="font-semibold">App Name</TableHead>
																								<TableHead className="font-semibold">Client ID</TableHead>
																								<TableHead className="font-semibold">Status</TableHead>
																								<TableHead className="font-semibold">
																										Redirect URI
																								</TableHead>
																								<TableHead className="font-semibold">Created</TableHead>
																								<TableHead className="font-semibold text-right">
																										Actions
																								</TableHead>
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
																														<div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
																																<span className="text-white text-sm font-bold">
																																		{/* {app.app_name.charAt(0).toUpperCase()} */}
																																</span>
																														</div>
																														{app.app_id}
																												</div>
																										</TableCell>
																										<TableCell>
																												<code className="bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded text-sm">
																														{app.client_id}
																												</code>
																										</TableCell>
																										<TableCell>
																												{/* <Badge
																														variant={
																																app.status === "active"
																																		? "default"
																																		: "secondary"
																														}
																														className={
																																app.status === "active"
																																		? "bg-green-100 text-green-800 hover:bg-green-100"
																																		: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
																														}
																												>
																														{app.status || "pending"}
																												</Badge> */}
																										</TableCell>
																										<TableCell className="max-w-xs truncate">
																												{app.redirect_url}
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
																</div>
														)}
												</CardContent>
										</Card>
								</div>
						</div>

						{/* Registration Side Panel */}
						<Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
								<SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto">
										<SheetHeader>
												<SheetTitle>Register New HubSpot App</SheetTitle>
												<SheetDescription>
														Add your HubSpot app credentials to start using OAuth Factory
												</SheetDescription>
										</SheetHeader>

										<form className="mt-6 space-y-6" onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
												{/* App ID */}
												<div className="space-y-2">
														<Label htmlFor="appId">App ID *</Label>
														<Input
																id="appId"
																type="number"
																placeholder="Enter your HubSpot App ID"
																value={formData.appId}
																onChange={(e) => handleInputChange('appId', e.target.value)}
																required
														/>
												</div>

												{/* Client ID */}
												<div className="space-y-2">
														<Label htmlFor="clientId">Client ID *</Label>
														<Input
																id="clientId"
																placeholder="Enter your client ID"
																value={formData.clientId}
																onChange={(e) => handleInputChange('clientId', e.target.value)}
																required
														/>
												</div>

												{/* Client Secret */}
												<div className="space-y-2">
														<Label htmlFor="clientSecret">Client Secret *</Label>
														<Input
																id="clientSecret"
																type="password"
																placeholder="Enter your client secret"
																value={formData.clientSecret}
																onChange={(e) => handleInputChange('clientSecret', e.target.value)}
																required
														/>
												</div>

												{/* Scopes */}
												<div className="space-y-2">
														<Label htmlFor="scopes">Scopes *</Label>
														<Textarea
																id="scopes"
																placeholder="Enter scopes (space or comma separated)"
																value={formData.scopes}
																onChange={(e) => handleInputChange('scopes', e.target.value)}
																required
																rows={3}
														/>
												</div>

												{/* Install URL */}
												<div className="space-y-2">
														<Label htmlFor="installUrl">Install URL</Label>
														<Input
																id="installUrl"
																type="url"
																placeholder="https://app.hubspot.com/oauth/authorize?..."
																value={formData.installUrl}
																onChange={(e) => handleInputChange('installUrl', e.target.value)}
														/>
												</div>

												{/* Redirect URL */}
												<div className="space-y-2">
														<Label htmlFor="redirectUrl">Redirect URL</Label>
														<Input
																id="redirectUrl"
																type="url"
																placeholder="https://yourapp.com/oauth/callback"
																value={formData.redirectUrl}
																onChange={(e) => handleInputChange('redirectUrl', e.target.value)}
														/>
												</div>

												{/* Error Message */}
												{submitError && (
														<div className="p-3 bg-red-50 border border-red-200 rounded-md">
																<p className="text-sm text-red-600">{submitError}</p>
														</div>
												)}

												{/* Success Message */}
												{submitSuccess && (
														<div className="p-3 bg-green-50 border border-green-200 rounded-md">
																<p className="text-sm text-green-600">App registered successfully!</p>
														</div>
												)}

												{/* Form Actions */}
												<div className="flex gap-3 pt-4">
														<Button
																type="button"
																variant="outline"
																onClick={handleCloseRegistration}
																className="flex-1"
																disabled={isSubmitting}
														>
																Cancel
														</Button>
														<Button
																type="submit"
																className="flex-1"
																disabled={isSubmitting}
														>
																{isSubmitting ? 'Registering...' : 'Register App'}
														</Button>
												</div>
										</form>
								</SheetContent>
						</Sheet>
				</>
		);
}
