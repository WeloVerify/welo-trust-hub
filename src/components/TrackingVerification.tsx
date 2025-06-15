
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useCompanyData } from '@/hooks/useCompanyData';
import { supabase } from '@/integrations/supabase/client';
import { CheckCircle, XCircle, Clock, RefreshCw, Globe, Code } from 'lucide-react';
import { toast } from '@/components/ui/sonner';

const TrackingVerification = () => {
  const { company, loading } = useCompanyData();
  const [verifying, setVerifying] = useState(false);
  const [lastCheck, setLastCheck] = useState<Date | null>(null);

  useEffect(() => {
    if (company?.tracking_id) {
      checkScriptStatus();
    }
  }, [company]);

  const checkScriptStatus = async () => {
    if (!company?.tracking_id) return;

    setVerifying(true);
    try {
      const { data, error } = await supabase.rpc('verify_script_installation', {
        company_tracking_id: company.tracking_id
      });

      if (error) throw error;
      
      setLastCheck(new Date());
      toast.success('Verifica completata');
    } catch (error) {
      console.error('Error verifying script:', error);
      toast.error('Errore durante la verifica');
    } finally {
      setVerifying(false);
    }
  };

  const getStatusIcon = () => {
    if (!company) return <Clock className="w-5 h-5" />;
    
    switch (company.script_verification_status) {
      case 'active':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      default:
        return <XCircle className="w-5 h-5 text-red-500" />;
    }
  };

  const getStatusBadge = () => {
    if (!company) return <Badge variant="secondary">In attesa</Badge>;
    
    switch (company.script_verification_status) {
      case 'active':
        return <Badge variant="default" className="bg-green-500">Attivo</Badge>;
      case 'pending':
        return <Badge variant="secondary">In verifica</Badge>;
      default:
        return <Badge variant="destructive">Non attivo</Badge>;
    }
  };

  const getStatusMessage = () => {
    if (!company) return "Caricamento dati azienda...";
    
    switch (company.script_verification_status) {
      case 'active':
        return "Il tuo script di tracking è installato correttamente e sta funzionando.";
      case 'pending':
        return "Script di tracking in fase di verifica. Può richiedere alcuni minuti.";
      default:
        return "Script di tracking non rilevato. Assicurati di averlo installato correttamente.";
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-6">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Globe className="w-5 h-5" />
            <span>Verifica Script di Tracking</span>
          </div>
          {getStatusBadge()}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-3">
          {getStatusIcon()}
          <div className="flex-1">
            <p className="text-sm text-gray-600">{getStatusMessage()}</p>
            {lastCheck && (
              <p className="text-xs text-gray-400 mt-1">
                Ultima verifica: {lastCheck.toLocaleString('it-IT')}
              </p>
            )}
          </div>
        </div>

        {company?.script_verification_status !== 'active' && (
          <Alert>
            <Code className="h-4 w-4" />
            <AlertDescription>
              Per verificare che il tracking funzioni correttamente, visita il tuo sito web dopo aver installato lo script. 
              La verifica può richiedere alcuni minuti.
            </AlertDescription>
          </Alert>
        )}

        <div className="flex items-center justify-between pt-4 border-t">
          <div className="text-sm text-gray-500">
            ID Tracking: <code className="bg-gray-100 px-2 py-1 rounded text-xs">{company?.tracking_id}</code>
          </div>
          <Button
            onClick={checkScriptStatus}
            disabled={verifying}
            variant="outline"
            size="sm"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${verifying ? 'animate-spin' : ''}`} />
            {verifying ? 'Verificando...' : 'Verifica Ora'}
          </Button>
        </div>

        {company?.script_verification_status === 'active' && company.views_count > 0 && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span className="text-sm font-medium text-green-800">
                Tracking attivo - {company.views_count} visualizzazioni registrate
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TrackingVerification;
