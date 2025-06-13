
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Copy, CheckCircle, Clock, AlertTriangle, Code, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface Company {
  id: string;
  tracking_id: string;
  script_installed: boolean;
  script_verification_status: string;
  last_tracking_event: string | null;
  status: string;
}

const TrackingScript = () => {
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchCompanyData();
    }
  }, [user]);

  const fetchCompanyData = async () => {
    try {
      const { data, error } = await supabase
        .from('companies')
        .select('id, tracking_id, script_installed, script_verification_status, last_tracking_event, status')
        .eq('user_id', user?.id)
        .single();

      if (error) throw error;
      setCompany(data);
    } catch (error) {
      console.error('Error fetching company data:', error);
    } finally {
      setLoading(false);
    }
  };

  const verifyScript = async () => {
    if (!company?.tracking_id) return;
    
    setVerifying(true);
    try {
      const { data, error } = await supabase.rpc('verify_script_installation', {
        company_tracking_id: company.tracking_id
      });

      if (error) throw error;

      await fetchCompanyData();
      
      if (data) {
        toast({
          title: "Script Verified!",
          description: "Your tracking script is working correctly.",
        });
      } else {
        toast({
          title: "Script Not Detected",
          description: "Please make sure the script is properly installed on your website.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error verifying script:', error);
      toast({
        title: "Verification Error",
        description: "Could not verify script installation.",
        variant: "destructive"
      });
    } finally {
      setVerifying(false);
    }
  };

  const copyScript = () => {
    const script = `<script src="https://welobadge.com/welo-tracking.js" data-id="${company?.tracking_id}"></script>`;
    navigator.clipboard.writeText(script);
    toast({
      title: "Script Copied!",
      description: "The tracking script has been copied to your clipboard.",
    });
  };

  const getStatusBadge = () => {
    if (!company) return null;

    switch (company.script_verification_status) {
      case 'active':
        return (
          <Badge className="bg-green-100 text-green-800 border-green-200">
            <CheckCircle className="h-3 w-3 mr-1" />
            Tracking Active
          </Badge>
        );
      case 'pending':
        return (
          <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
            <Clock className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        );
      case 'error':
        return (
          <Badge className="bg-red-100 text-red-800 border-red-200">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Error
          </Badge>
        );
      default:
        return (
          <Badge className="bg-gray-100 text-gray-800 border-gray-200">
            <Clock className="h-3 w-3 mr-1" />
            Not Installed
          </Badge>
        );
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!company || company.status !== 'approved') {
    return (
      <Alert className="border-blue-200 bg-blue-50">
        <AlertTriangle className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-800">
          Your company needs to be approved before you can access the tracking script.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Code className="h-5 w-5" />
            <span>Tracking Script</span>
          </div>
          {getStatusBadge()}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">
            Installation Instructions
          </label>
          <p className="text-sm text-gray-600 mb-4">
            Copy and paste this script into the &lt;head&gt; section of your website to start tracking badge views.
          </p>
        </div>

        <div className="bg-gray-50 border rounded-lg p-4">
          <code className="text-sm text-gray-800 break-all">
            {`<script src="https://welobadge.com/welo-tracking.js" data-id="${company.tracking_id}"></script>`}
          </code>
        </div>

        <div className="flex space-x-2">
          <Button onClick={copyScript} className="flex-1">
            <Copy className="h-4 w-4 mr-2" />
            Copy Script
          </Button>
          <Button 
            variant="outline" 
            onClick={verifyScript}
            disabled={verifying}
            className="flex-1"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${verifying ? 'animate-spin' : ''}`} />
            Verify Installation
          </Button>
        </div>

        {company.script_verification_status === 'active' && company.last_tracking_event && (
          <Alert className="border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              <strong>Script is working!</strong> Last tracking event: {new Date(company.last_tracking_event).toLocaleString()}
            </AlertDescription>
          </Alert>
        )}

        {company.script_verification_status === 'pending' && (
          <Alert className="border-yellow-200 bg-yellow-50">
            <Clock className="h-4 w-4 text-yellow-600" />
            <AlertDescription className="text-yellow-800">
              <strong>Waiting for first page view.</strong> Make sure the script is installed correctly on your website.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};

export default TrackingScript;
