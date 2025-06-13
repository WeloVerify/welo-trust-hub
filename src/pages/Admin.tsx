import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Search, Eye, CheckCircle, XCircle, Clock, FileText, ExternalLink, LogOut, BarChart3 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import AdminConfirmDialog from '@/components/AdminConfirmDialog';

interface Company {
  id: string;
  company_name: string;
  email: string;
  website_url: string;
  country: string;
  date_of_incorporation: string;
  phone_number: string;
  description: string;
  terms_url: string;
  privacy_url: string;
  created_at: string;
  status: 'pending' | 'under_review' | 'approved' | 'rejected';
  tracking_id: string;
  company_branding: Array<{
    logo_url?: string;
    cover_url?: string;
    primary_color: string;
    display_text?: string;
  }>;
  company_documents: Array<{
    file_name: string;
    file_url: string;
    file_type: string;
  }>;
}

const Admin = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    type: 'approve' | 'reject';
    company: Company | null;
  }>({ open: false, type: 'approve', company: null });
  
  const { toast } = useToast();
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Fetch pending companies
  const { data: companies = [], isLoading } = useQuery({
    queryKey: ['pending-companies'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('companies')
        .select(`
          *,
          company_branding(*),
          company_documents(*)
        `)
        .in('status', ['pending', 'under_review'])
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Company[];
    },
  });

  const filteredCompanies = companies.filter(company =>
    company.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Generate Welo page URL
  const generateWeloPageUrl = (companyName: string, trackingId: string) => {
    const slug = companyName.toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
    return `https://welobadge.com/company/${slug}?id=${trackingId}`;
  };

  // Approve company mutation
  const approveMutation = useMutation({
    mutationFn: async (companyId: string) => {
      const { error } = await supabase
        .from('companies')
        .update({ status: 'approved' })
        .eq('id', companyId);

      if (error) throw error;
    },
    onSuccess: (_, companyId) => {
      const company = companies.find(c => c.id === companyId);
      if (company) {
        const weloPageUrl = generateWeloPageUrl(company.company_name, company.tracking_id);
        
        toast({
          title: "Company Approved ✅",
          description: `${company.company_name} has been approved. Their Welo Page: ${weloPageUrl}`,
        });
      }
      
      queryClient.invalidateQueries({ queryKey: ['pending-companies'] });
      setSelectedCompany(null);
      setConfirmDialog({ open: false, type: 'approve', company: null });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: "Failed to approve company: " + error.message,
        variant: "destructive"
      });
    }
  });

  // Reject company mutation
  const rejectMutation = useMutation({
    mutationFn: async ({ companyId, reason }: { companyId: string; reason: string }) => {
      const { error } = await supabase
        .from('companies')
        .update({ 
          status: 'rejected',
          rejection_reason: reason 
        })
        .eq('id', companyId);

      if (error) throw error;
    },
    onSuccess: (_, { reason }) => {
      const company = confirmDialog.company;
      toast({
        title: "Company Rejected ❌",
        description: `${company?.company_name} has been rejected. Reason: ${reason}`,
      });
      
      queryClient.invalidateQueries({ queryKey: ['pending-companies'] });
      setSelectedCompany(null);
      setConfirmDialog({ open: false, type: 'reject', company: null });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: "Failed to reject company: " + error.message,
        variant: "destructive"
      });
    }
  });

  const handleApprove = (company: Company) => {
    setConfirmDialog({ open: true, type: 'approve', company });
  };

  const handleReject = (company: Company) => {
    setConfirmDialog({ open: true, type: 'reject', company });
  };

  const handleConfirmAction = (reason?: string) => {
    if (!confirmDialog.company) return;

    if (confirmDialog.type === 'approve') {
      approveMutation.mutate(confirmDialog.company.id);
    } else {
      if (!reason?.trim()) {
        toast({
          title: "Rejection Reason Required",
          description: "Please provide a reason for rejection.",
          variant: "destructive"
        });
        return;
      }
      rejectMutation.mutate({ companyId: confirmDialog.company.id, reason });
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-32 bg-gray-200 rounded mb-6"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Panel</h1>
          <p className="text-gray-600 mt-1">Manage company verification requests</p>
        </div>
        <div className="flex items-center space-x-3">
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            {filteredCompanies.length} Pending Reviews
          </Badge>
          <Button 
            variant="outline" 
            onClick={() => navigate('/admin/analytics')} 
            size="sm"
            className="flex items-center space-x-2"
          >
            <BarChart3 className="h-4 w-4" />
            <span>Analytics</span>
          </Button>
          <Button variant="outline" onClick={signOut} size="sm">
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search companies by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Companies Table */}
      <Card>
        <CardHeader>
          <CardTitle>Pending Verifications</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredCompanies.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No pending companies found
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Company</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Country</TableHead>
                  <TableHead>Submitted</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCompanies.map((company) => (
                  <TableRow key={company.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{company.company_name}</p>
                        <p className="text-sm text-gray-500">{company.website_url}</p>
                      </div>
                    </TableCell>
                    <TableCell>{company.email}</TableCell>
                    <TableCell>{company.country}</TableCell>
                    <TableCell>{new Date(company.created_at).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Badge variant={company.status === 'pending' ? 'secondary' : 'outline'}>
                        <Clock className="h-3 w-3 mr-1" />
                        {company.status === 'pending' ? 'Pending' : 'Under Review'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedCompany(company)}
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              Review
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>Company Review: {selectedCompany?.company_name}</DialogTitle>
                            </DialogHeader>
                            
                            {selectedCompany && (
                              <div className="space-y-6">
                                {/* Company Details */}
                                <Card>
                                  <CardHeader>
                                    <CardTitle className="text-lg">Company Information</CardTitle>
                                  </CardHeader>
                                  <CardContent className="grid grid-cols-2 gap-4">
                                    <div>
                                      <Label className="text-sm font-medium text-gray-700">Company Name</Label>
                                      <p>{selectedCompany.company_name}</p>
                                    </div>
                                    <div>
                                      <Label className="text-sm font-medium text-gray-700">Email</Label>
                                      <p>{selectedCompany.email}</p>
                                    </div>
                                    <div>
                                      <Label className="text-sm font-medium text-gray-700">Website</Label>
                                      <a href={selectedCompany.website_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline flex items-center">
                                        {selectedCompany.website_url}
                                        <ExternalLink className="h-3 w-3 ml-1" />
                                      </a>
                                    </div>
                                    <div>
                                      <Label className="text-sm font-medium text-gray-700">Phone</Label>
                                      <p>{selectedCompany.phone_number || 'Not provided'}</p>
                                    </div>
                                    <div>
                                      <Label className="text-sm font-medium text-gray-700">Country</Label>
                                      <p>{selectedCompany.country}</p>
                                    </div>
                                    <div>
                                      <Label className="text-sm font-medium text-gray-700">Tracking ID</Label>
                                      <p className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">{selectedCompany.tracking_id}</p>
                                    </div>
                                    {selectedCompany.date_of_incorporation && (
                                      <div>
                                        <Label className="text-sm font-medium text-gray-700">Incorporated</Label>
                                        <p>{new Date(selectedCompany.date_of_incorporation).toLocaleDateString()}</p>
                                      </div>
                                    )}
                                    {selectedCompany.description && (
                                      <div className="col-span-2">
                                        <Label className="text-sm font-medium text-gray-700">Description</Label>
                                        <p>{selectedCompany.description}</p>
                                      </div>
                                    )}
                                  </CardContent>
                                </Card>

                                {/* Legal Links */}
                                {(selectedCompany.terms_url || selectedCompany.privacy_url) && (
                                  <Card>
                                    <CardHeader>
                                      <CardTitle className="text-lg">Legal Pages</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-2">
                                      {selectedCompany.terms_url && (
                                        <a href={selectedCompany.terms_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline flex items-center">
                                          Terms of Service <ExternalLink className="h-3 w-3 ml-1" />
                                        </a>
                                      )}
                                      {selectedCompany.privacy_url && (
                                        <a href={selectedCompany.privacy_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline flex items-center">
                                          Privacy Policy <ExternalLink className="h-3 w-3 ml-1" />
                                        </a>
                                      )}
                                    </CardContent>
                                  </Card>
                                )}

                                {/* Documents */}
                                {selectedCompany.company_documents.length > 0 && (
                                  <Card>
                                    <CardHeader>
                                      <CardTitle className="text-lg">Uploaded Documents</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                      <div className="space-y-2">
                                        {selectedCompany.company_documents.map((doc, index) => (
                                          <div key={index} className="flex items-center space-x-2 p-2 bg-gray-50 rounded">
                                            <FileText className="h-4 w-4 text-gray-500" />
                                            <span className="text-sm">{doc.file_name}</span>
                                            <a href={doc.file_url} target="_blank" rel="noopener noreferrer">
                                              <Button variant="ghost" size="sm">View</Button>
                                            </a>
                                          </div>
                                        ))}
                                      </div>
                                    </CardContent>
                                  </Card>
                                )}

                                {/* Branding Preview */}
                                {selectedCompany.company_branding.length > 0 && (
                                  <Card>
                                    <CardHeader>
                                      <CardTitle className="text-lg">Branding Setup</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                      <div className="text-center space-y-4">
                                        {selectedCompany.company_branding[0]?.logo_url && (
                                          <img src={selectedCompany.company_branding[0].logo_url} alt="Logo" className="h-16 mx-auto" />
                                        )}
                                        <div 
                                          className="h-32 rounded-lg flex items-center justify-center text-white"
                                          style={{ backgroundColor: selectedCompany.company_branding[0]?.primary_color || '#3b82f6' }}
                                        >
                                          <span>Welo Page Preview</span>
                                        </div>
                                        {selectedCompany.company_branding[0]?.display_text && (
                                          <p className="text-gray-700">{selectedCompany.company_branding[0].display_text}</p>
                                        )}
                                      </div>
                                    </CardContent>
                                  </Card>
                                )}

                                {/* Actions */}
                                <div className="flex space-x-4">
                                  <Button 
                                    onClick={() => handleApprove(selectedCompany)}
                                    className="flex-1 bg-green-600 hover:bg-green-700"
                                    disabled={approveMutation.isPending}
                                  >
                                    <CheckCircle className="h-4 w-4 mr-2" />
                                    Approve Company
                                  </Button>
                                  
                                  <Button 
                                    variant="destructive" 
                                    className="flex-1"
                                    onClick={() => handleReject(selectedCompany)}
                                    disabled={rejectMutation.isPending}
                                  >
                                    <XCircle className="h-4 w-4 mr-2" />
                                    Reject Company
                                  </Button>
                                </div>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                        
                        <Button
                          onClick={() => handleApprove(company)}
                          size="sm"
                          className="bg-green-600 hover:bg-green-700"
                          disabled={approveMutation.isPending}
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Approve
                        </Button>
                        
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleReject(company)}
                          disabled={rejectMutation.isPending}
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          Reject
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Confirmation Dialog */}
      <AdminConfirmDialog
        open={confirmDialog.open}
        onOpenChange={(open) => setConfirmDialog(prev => ({ ...prev, open }))}
        type={confirmDialog.type}
        companyName={confirmDialog.company?.company_name || ''}
        onConfirm={handleConfirmAction}
        loading={approveMutation.isPending || rejectMutation.isPending}
      />
    </div>
  );
};

export default Admin;
