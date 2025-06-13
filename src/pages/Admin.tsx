
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Search, Eye, CheckCircle, XCircle, Clock, FileText, Image, ExternalLink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PendingCompany {
  id: string;
  companyName: string;
  email: string;
  websiteUrl: string;
  country: string;
  dateOfIncorporation: string;
  phoneNumber: string;
  description: string;
  termsUrl: string;
  privacyUrl: string;
  submittedAt: string;
  status: 'pending' | 'under_review';
  documents: string[];
  branding: {
    logoUrl?: string;
    coverUrl?: string;
    primaryColor: string;
    displayText: string;
  };
}

const mockPendingCompanies: PendingCompany[] = [
  {
    id: '1',
    companyName: 'TechCorp Solutions',
    email: 'contact@techcorp.com',
    websiteUrl: 'https://techcorp.com',
    country: 'United States',
    dateOfIncorporation: '2020-03-15',
    phoneNumber: '+1 (555) 123-4567',
    description: 'Leading software development company specializing in enterprise solutions.',
    termsUrl: 'https://techcorp.com/terms',
    privacyUrl: 'https://techcorp.com/privacy',
    submittedAt: '2024-01-15T10:30:00Z',
    status: 'pending',
    documents: ['business-license.pdf', 'incorporation-cert.pdf'],
    branding: {
      logoUrl: '/placeholder.svg',
      primaryColor: '#3b82f6',
      displayText: 'Trusted enterprise software solutions since 2020'
    }
  },
  {
    id: '2',
    companyName: 'GreenTech Innovations',
    email: 'hello@greentech.io',
    websiteUrl: 'https://greentech.io',
    country: 'Canada',
    dateOfIncorporation: '2019-08-22',
    phoneNumber: '+1 (647) 555-9876',
    description: 'Sustainable technology solutions for a better tomorrow.',
    termsUrl: 'https://greentech.io/terms',
    privacyUrl: 'https://greentech.io/privacy',
    submittedAt: '2024-01-16T14:20:00Z',
    status: 'under_review',
    documents: ['business-registration.pdf'],
    branding: {
      primaryColor: '#10b981',
      displayText: 'Leading the green technology revolution'
    }
  }
];

const Admin = () => {
  const [companies, setCompanies] = useState<PendingCompany[]>(mockPendingCompanies);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCompany, setSelectedCompany] = useState<PendingCompany | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const { toast } = useToast();

  const filteredCompanies = companies.filter(company =>
    company.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleApprove = async (companyId: string) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setCompanies(prev => prev.filter(c => c.id !== companyId));
    toast({
      title: "Company Approved",
      description: "The company has been successfully approved and moved to active clients.",
    });
    setSelectedCompany(null);
  };

  const handleReject = async (companyId: string, reason: string) => {
    if (!reason.trim()) {
      toast({
        title: "Rejection Reason Required",
        description: "Please provide a reason for rejection.",
        variant: "destructive"
      });
      return;
    }

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setCompanies(prev => prev.filter(c => c.id !== companyId));
    toast({
      title: "Company Rejected",
      description: "The company has been rejected and notified via email.",
    });
    setSelectedCompany(null);
    setRejectionReason('');
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Panel</h1>
          <p className="text-gray-600 mt-1">Manage company verification requests</p>
        </div>
        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
          {filteredCompanies.length} Pending Reviews
        </Badge>
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
                      <p className="font-medium">{company.companyName}</p>
                      <p className="text-sm text-gray-500">{company.websiteUrl}</p>
                    </div>
                  </TableCell>
                  <TableCell>{company.email}</TableCell>
                  <TableCell>{company.country}</TableCell>
                  <TableCell>{new Date(company.submittedAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Badge variant={company.status === 'pending' ? 'secondary' : 'outline'}>
                      <Clock className="h-3 w-3 mr-1" />
                      {company.status === 'pending' ? 'Pending' : 'Under Review'}
                    </Badge>
                  </TableCell>
                  <TableCell>
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
                          <DialogTitle>Company Review: {company.companyName}</DialogTitle>
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
                                  <p>{selectedCompany.companyName}</p>
                                </div>
                                <div>
                                  <Label className="text-sm font-medium text-gray-700">Email</Label>
                                  <p>{selectedCompany.email}</p>
                                </div>
                                <div>
                                  <Label className="text-sm font-medium text-gray-700">Website</Label>
                                  <a href={selectedCompany.websiteUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline flex items-center">
                                    {selectedCompany.websiteUrl}
                                    <ExternalLink className="h-3 w-3 ml-1" />
                                  </a>
                                </div>
                                <div>
                                  <Label className="text-sm font-medium text-gray-700">Phone</Label>
                                  <p>{selectedCompany.phoneNumber}</p>
                                </div>
                                <div>
                                  <Label className="text-sm font-medium text-gray-700">Country</Label>
                                  <p>{selectedCompany.country}</p>
                                </div>
                                <div>
                                  <Label className="text-sm font-medium text-gray-700">Incorporated</Label>
                                  <p>{new Date(selectedCompany.dateOfIncorporation).toLocaleDateString()}</p>
                                </div>
                                <div className="col-span-2">
                                  <Label className="text-sm font-medium text-gray-700">Description</Label>
                                  <p>{selectedCompany.description}</p>
                                </div>
                              </CardContent>
                            </Card>

                            {/* Legal Links */}
                            <Card>
                              <CardHeader>
                                <CardTitle className="text-lg">Legal Pages</CardTitle>
                              </CardHeader>
                              <CardContent className="space-y-2">
                                {selectedCompany.termsUrl && (
                                  <a href={selectedCompany.termsUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline flex items-center">
                                    Terms of Service <ExternalLink className="h-3 w-3 ml-1" />
                                  </a>
                                )}
                                {selectedCompany.privacyUrl && (
                                  <a href={selectedCompany.privacyUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline flex items-center">
                                    Privacy Policy <ExternalLink className="h-3 w-3 ml-1" />
                                  </a>
                                )}
                              </CardContent>
                            </Card>

                            {/* Documents */}
                            <Card>
                              <CardHeader>
                                <CardTitle className="text-lg">Uploaded Documents</CardTitle>
                              </CardHeader>
                              <CardContent>
                                <div className="space-y-2">
                                  {selectedCompany.documents.map((doc, index) => (
                                    <div key={index} className="flex items-center space-x-2 p-2 bg-gray-50 rounded">
                                      <FileText className="h-4 w-4 text-gray-500" />
                                      <span className="text-sm">{doc}</span>
                                      <Button variant="ghost" size="sm">Download</Button>
                                    </div>
                                  ))}
                                </div>
                              </CardContent>
                            </Card>

                            {/* Branding Preview */}
                            <Card>
                              <CardHeader>
                                <CardTitle className="text-lg">Branding Setup</CardTitle>
                              </CardHeader>
                              <CardContent>
                                <div className="text-center space-y-4">
                                  {selectedCompany.branding.logoUrl && (
                                    <img src={selectedCompany.branding.logoUrl} alt="Logo" className="h-16 mx-auto" />
                                  )}
                                  <div 
                                    className="h-32 rounded-lg flex items-center justify-center text-white"
                                    style={{ backgroundColor: selectedCompany.branding.primaryColor }}
                                  >
                                    <span>Welo Page Preview</span>
                                  </div>
                                  {selectedCompany.branding.displayText && (
                                    <p className="text-gray-700">{selectedCompany.branding.displayText}</p>
                                  )}
                                </div>
                              </CardContent>
                            </Card>

                            {/* Actions */}
                            <div className="flex space-x-4">
                              <Button 
                                onClick={() => handleApprove(selectedCompany.id)}
                                className="flex-1 bg-green-600 hover:bg-green-700"
                              >
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Approve Company
                              </Button>
                              
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button variant="destructive" className="flex-1">
                                    <XCircle className="h-4 w-4 mr-2" />
                                    Reject Company
                                  </Button>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>Reject Company</DialogTitle>
                                  </DialogHeader>
                                  <div className="space-y-4">
                                    <p>Please provide a reason for rejecting this application:</p>
                                    <Textarea
                                      value={rejectionReason}
                                      onChange={(e) => setRejectionReason(e.target.value)}
                                      placeholder="Enter rejection reason..."
                                      rows={4}
                                    />
                                    <div className="flex space-x-2">
                                      <Button
                                        variant="destructive"
                                        onClick={() => handleReject(selectedCompany.id, rejectionReason)}
                                        disabled={!rejectionReason.trim()}
                                      >
                                        Confirm Rejection
                                      </Button>
                                      <Button variant="outline">Cancel</Button>
                                    </div>
                                  </div>
                                </DialogContent>
                              </Dialog>
                            </div>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Admin;
