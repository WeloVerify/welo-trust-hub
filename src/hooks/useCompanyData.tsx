
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

interface Company {
  id: string;
  company_name: string;
  website_url: string;
  email: string;
  status: string;
  tracking_id: string;
  views_count: number;
  script_installed: boolean;
  script_verification_status: string;
  created_at: string;
}

export const useCompanyData = () => {
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchCompany();
    }
  }, [user]);

  const fetchCompany = async () => {
    try {
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      setCompany(data);
    } catch (error) {
      console.error('Error fetching company:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateCompany = async (updates: Partial<Company>) => {
    if (!company) return;
    
    try {
      const { error } = await supabase
        .from('companies')
        .update(updates)
        .eq('id', company.id);

      if (error) throw error;
      setCompany(prev => prev ? { ...prev, ...updates } : null);
    } catch (error) {
      console.error('Error updating company:', error);
      throw error;
    }
  };

  return { company, loading, fetchCompany, updateCompany };
};
