
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { 
  Users, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Building2,
  Mail,
  ExternalLink,
  Copy
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/sonner';
import AdminApprovalDialog from '@/components/AdminApprovalDialog';

interface CompanyProfile {
  id: string;
  company_name: string;
  email: string;
  website_url: string;
  phone_number: string | null;
  created_at: string;
  status: 'pending' | 'under_review' | 'approved' | 'rejected';
  rejection_reason: string | null;
  tracking_id: string | null;
  country: string;
  plan_type: string | null;
  views_count: number | null;
}

const Admin = () => {
  const [companies, setCompanies] = useState<CompanyProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<CompanyProfile | null>(null);
  const [actionType, setActionType] = useState<'approve' | 'reject'>('approve');
  const [confirmLoading, setConfirmLoading] = useState(false);

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching companies:', error);
        toast.error('Failed to fetch companies. Please try again.');
      } else {
        setCompanies(data || []);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleOpenConfirmation = (company: CompanyProfile, type: 'approve' | 'reject') => {
    setSelectedCompany(company);
    setActionType(type);
    setConfirmDialogOpen(true);
  };

  const generateWeloPageUrl = (trackingId: string) => {
    return `https://welobadge.com/welo-page/${trackingId}`;
  };

  const generateTrackingId = () => {
    return 'welo_' + Math.random().toString(36).substr(2, 12);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('URL copied to clipboard!');
  };

  const handleConfirmAction = async (reason?: string) => {
    if (!selectedCompany) return;

    setConfirmLoading(true);
    try {
      let updateData: {
        status: CompanyProfile['status'];
        tracking_id?: string;
        rejection_reason?: string | null;
      } = {
        status: selectedCompany.status,
      };

      if (actionType === 'approve') {
        const trackingId = selectedCompany.tracking_id || generateTrackingId();
        updateData = {
          status: 'approved',
          tracking_id: trackingId,
          rejection_reason: null,
        };
      } else {
        updateData = {
          status: 'rejected',
          rejection_reason: reason || null,
        };
      }

      const { error } = await supabase
        .from('companies')
        .update(updateData)
        .eq('id', selectedCompany.id);

      if (error) {
        console.error(`Error ${actionType} company:`, error);
        toast.error(`Failed to ${actionType} company. Please try again.`);
      } else {
        if (actionType === 'approve') {
          const weloUrl = generateWeloPageUrl(updateData.tracking_id);
          toast.success(
            `Company approved successfully! Welo page created.`,
            { duration: 5000 }
          );
          setTimeout(() => {
            toast.success(`Welo URL: ${weloUrl}`, { 
              duration: 10000,
              action: {
                label: "Copy",
                onClick: () => copyToClipboard(weloUrl)
              }
            });
          }, 1000);
        } else {
          toast.success('Company rejected successfully!');
        }
        fetchCompanies(); // Refresh the company list
      }
    } finally {
      setConfirmLoading(false);
      setConfirmDialogOpen(false);
      setSelectedCompany(null);
    }
  };

  const getStatusStats = () => {
    const stats = companies.reduce((acc, company) => {
      acc[company.status] = (acc[company.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return {
      total: companies.length,
      pending: stats.pending || 0,
      approved: stats.approved || 0,
      rejected: stats.rejected || 0
    };
  };

  const stats = getStatusStats();

  return (
    <div className="container mx-auto py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold mb-4">Company Management</h1>
        
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Companies</p>
                  <p className="text-2xl font-bold">{stats.total}</p>
                </div>
                <Building2 className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending</p>
                  <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
                </div>
                <Clock className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Approved</p>
                  <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Rejected</p>
                  <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
                </div>
                <XCircle className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {companies.map((company) => (
            <Card key={company.id} className="bg-white shadow-md rounded-lg overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-md font-semibold text-gray-800">{company.company_name}</CardTitle>
                <Badge className={`flex items-center space-x-1 ${
                  company.status === 'pending' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
                  company.status === 'approved' ? 'bg-green-100 text-green-800 border-green-200' :
                  'bg-red-100 text-red-800 border-red-200'
                }`}>
                  {company.status === 'pending' && <><Clock className="h-3 w-3" /><span>Pending</span></>}
                  {company.status === 'approved' && <><CheckCircle className="h-3 w-3" /><span>Approved</span></>}
                  {company.status === 'rejected' && <><XCircle className="h-3 w-3" /><span>Rejected</span></>}
                </Badge>
              </CardHeader>
              <CardContent className="text-gray-600">
                <div className="space-y-2">
                  <div>
                    <Label className="text-xs font-medium text-gray-700">Email</Label>
                    <p className="text-sm flex items-center space-x-2"><Mail className="h-4 w-4"/><span>{company.email}</span></p>
                  </div>
                  <div>
                    <Label className="text-xs font-medium text-gray-700">Website</Label>
                    <p className="text-sm flex items-center space-x-2"><Building2 className="h-4 w-4"/><span>{company.website_url}</span></p>
                  </div>
                  <div>
                    <Label className="text-xs font-medium text-gray-700">Country</Label>
                    <p className="text-sm">{company.country}</p>
                  </div>
                  <div>
                    <Label className="text-xs font-medium text-gray-700">Plan</Label>
                    <p className="text-sm capitalize">{company.plan_type || 'starter'}</p>
                  </div>
                  <div>
                    <Label className="text-xs font-medium text-gray-700">Views</Label>
                    <p className="text-sm">{company.views_count || 0}</p>
                  </div>
                  <div>
                    <Label className="text-xs font-medium text-gray-700">Registered</Label>
                    <p className="text-sm">{new Date(company.created_at).toLocaleDateString()}</p>
                  </div>
                  {company.status === 'approved' && company.tracking_id && (
                    <div>
                      <Label className="text-xs font-medium text-green-700">Welo Page</Label>
                      <div className="flex items-center space-x-2">
                        <a 
                          href={generateWeloPageUrl(company.tracking_id)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:text-blue-800 flex items-center space-x-1 truncate"
                        >
                          <span className="truncate">{generateWeloPageUrl(company.tracking_id)}</span>
                          <ExternalLink className="h-3 w-3 flex-shrink-0" />
                        </a>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => copyToClipboard(generateWeloPageUrl(company.tracking_id!))}
                          className="h-6 w-6 p-0"
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  )}
                  {company.status === 'rejected' && company.rejection_reason && (
                    <div>
                      <Label className="text-xs font-medium text-red-700">Rejection Reason</Label>
                      <p className="text-sm text-red-600">{company.rejection_reason}</p>
                    </div>
                  )}
                </div>
                
                {company.status === 'pending' && (
                  <div className="flex justify-end space-x-2 mt-4">
                    <Button 
                      size="sm"
                      variant="outline"
                      onClick={() => handleOpenConfirmation(company, 'reject')}
                      className="border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300"
                    >
                      Reject
                    </Button>
                    <Button 
                      size="sm"
                      onClick={() => handleOpenConfirmation(company, 'approve')}
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      Approve
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <AdminApprovalDialog
        open={confirmDialogOpen}
        onOpenChange={setConfirmDialogOpen}
        type={actionType}
        companyName={selectedCompany?.company_name || ''}
        onConfirm={handleConfirmAction}
        loading={confirmLoading}
      />
    </div>
  );
};

export default Admin;
