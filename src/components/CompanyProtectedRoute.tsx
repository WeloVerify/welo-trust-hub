
import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, Clock, Shield } from 'lucide-react';
import { useCompanyStatus } from '@/hooks/useCompanyStatus';

interface CompanyProtectedRouteProps {
  children: React.ReactNode;
  requireApproval?: boolean;
  requireScript?: boolean;
}

const CompanyProtectedRoute = ({ 
  children, 
  requireApproval = false, 
  requireScript = false 
}: CompanyProtectedRouteProps) => {
  const { isApproved, hasScriptInstalled, loading } = useCompanyStatus();

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="h-20 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (requireApproval && !isApproved) {
    return (
      <div className="p-6">
        <Alert className="border-yellow-200 bg-yellow-50">
          <Shield className="h-4 w-4 text-yellow-600" />
          <AlertDescription className="text-yellow-800">
            <strong>Company Approval Required</strong>
            <p className="mt-2">
              This page is only available to approved companies. Please wait for admin approval 
              or check your verification status in the verification section.
            </p>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (requireScript && !hasScriptInstalled) {
    return (
      <div className="p-6">
        <Alert className="border-orange-200 bg-orange-50">
          <Clock className="h-4 w-4 text-orange-600" />
          <AlertDescription className="text-orange-800">
            <strong>Tracking Script Required</strong>
            <p className="mt-2">
              This page requires an active tracking script installation. Please install 
              and verify your tracking script in the widgets section.
            </p>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return <>{children}</>;
};

export default CompanyProtectedRoute;
