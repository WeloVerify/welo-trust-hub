
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useCompanyStatus } from '@/hooks/useCompanyStatus';
import { useCompanyData } from '@/hooks/useCompanyData';
import TrackingVerification from '@/components/TrackingVerification';
import TrackingScript from '@/components/TrackingScript';
import { CheckCircle, Clock, XCircle, AlertCircle } from 'lucide-react';

const Verification = () => {
  const { isApproved, loading } = useCompanyStatus();
  const { company } = useCompanyData();

  const getApprovalStatus = () => {
    if (!company) return { icon: Clock, color: 'yellow', label: 'In attesa', variant: 'secondary' as const };
    
    switch (company.status) {
      case 'approved':
        return { icon: CheckCircle, color: 'green', label: 'Approvata', variant: 'default' as const };
      case 'under_review':
        return { icon: Clock, color: 'yellow', label: 'In revisione', variant: 'secondary' as const };
      case 'rejected':
        return { icon: XCircle, color: 'red', label: 'Rifiutata', variant: 'destructive' as const };
      default:
        return { icon: AlertCircle, color: 'gray', label: 'In attesa', variant: 'outline' as const };
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const approvalStatus = getApprovalStatus();
  const StatusIcon = approvalStatus.icon;

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">Stato Verifica</h1>

      {/* Company Approval Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Stato Approvazione Azienda</span>
            <Badge variant={approvalStatus.variant}>
              <StatusIcon className="w-4 h-4 mr-1" />
              {approvalStatus.label}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <StatusIcon className={`w-6 h-6 text-${approvalStatus.color}-500`} />
              <div>
                <p className="font-medium">
                  {company?.status === 'approved' && 'La tua azienda è stata approvata!'}
                  {company?.status === 'under_review' && 'La tua azienda è in fase di revisione'}
                  {company?.status === 'rejected' && 'La richiesta è stata rifiutata'}
                  {company?.status === 'pending' && 'In attesa di revisione'}
                </p>
                <p className="text-sm text-gray-600">
                  {company?.status === 'approved' && 'Puoi ora utilizzare tutti i servizi della piattaforma.'}
                  {company?.status === 'under_review' && 'Il nostro team sta verificando le informazioni fornite.'}
                  {company?.status === 'rejected' && `Motivo: ${company.rejection_reason || 'Non specificato'}`}
                  {company?.status === 'pending' && 'La tua richiesta è in coda per la revisione.'}
                </p>
              </div>
            </div>
            
            {company?.company_name && (
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm"><strong>Azienda:</strong> {company.company_name}</p>
                <p className="text-sm"><strong>Sito web:</strong> {company.website_url}</p>
                <p className="text-sm"><strong>Data registrazione:</strong> {new Date(company.created_at).toLocaleDateString('it-IT')}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Tracking Verification */}
      <TrackingVerification />

      {/* Tracking Script */}
      {isApproved && (
        <Card>
          <CardHeader>
            <CardTitle>Script di Tracking</CardTitle>
          </CardHeader>
          <CardContent>
            <TrackingScript />
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Verification;
