"use client"

import React from 'react';
import { useState, useEffect } from "react";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    //SheetTrigger,
} from "@/components/ui-lib/sheet";
import { Input } from "@/components/ui-lib/input";
import { Label } from "@/components/ui-lib/label";
import { Textarea } from "@/components/ui-lib/textarea";
import { Button } from "@/components/ui-lib/button";

interface FormData {
    appId: string;
    clientId: string;
    clientSecret: string;
    scopes: string;
    installUrl: string;
    redirectUrl: string;
}

interface RegisterAppPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onClose: () => void;
}

const RegisterAppPanel: React.FC<RegisterAppPanelProps> = ({ open, onOpenChange, onClose }) => {

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

  useEffect(() => {
    handleOpen();
  }, []);

  // Handle form input changes
  const handleInputChange = (field: keyof FormData, value: string) => {
      setFormData(prev => ({
          ...prev,
          [field]: value
      }));
  };

  // Handle closing the registration panel
  const handleClose = () => {
      //setIsSheetOpen(false);
      setSubmitError(null);
      setSubmitSuccess(false);

      onClose();
  };

      // Handle opening the registration panel
    const handleOpen = () => {
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
              handleClose();
              // Reload apps data
              window.location.reload();
          }, 1000);

      }
      catch (error) {
          setSubmitError(error instanceof Error ? error.message : 'Failed to register app');
      }
      finally {
          setIsSubmitting(false);
      }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
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
                      onClick={handleClose}
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
  );
};

export default RegisterAppPanel;
