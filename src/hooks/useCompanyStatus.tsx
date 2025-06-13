
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

interface CompanyStatus {
  isApproved: boolean;
  hasScriptInstalled: boolean;
  scriptStatus: string;
  loading: boolean;
}

export const useCompanyStatus = (): CompanyStatus => {
  const [status, setStatus] = useState<CompanyStatus>({
    isApproved: false,
    hasScriptInstalled: false,
    scriptStatus: 'pending',
    loading: true
  });
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      setStatus(prev => ({ ...prev, loading: false }));
      return;
    }

    const fetchCompanyStatus = async () => {
      try {
        const { data, error } = await supabase
          .from('companies')
          .select('status, script_installed, script_verification_status')
          .eq('user_id', user.id)
          .single();

        if (error) throw error;

        setStatus({
          isApproved: data.status === 'approved',
          hasScriptInstalled: data.script_installed || false,
          scriptStatus: data.script_verification_status || 'pending',
          loading: false
        });
      } catch (error) {
        console.error('Error fetching company status:', error);
        setStatus(prev => ({ ...prev, loading: false }));
      }
    };

    fetchCompanyStatus();
  }, [user]);

  return status;
};
