
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Bell, Users, CheckCircle, AlertCircle } from 'lucide-react';

const AdminUpdates = () => {
  const updates = [
    {
      id: 1,
      type: 'new_company',
      title: 'New Company Registration',
      message: 'TechCorp Inc. has submitted their verification documents',
      timestamp: '2 hours ago',
      status: 'pending'
    },
    {
      id: 2,
      type: 'approval',
      title: 'Company Approved',
      message: 'FinanceFlow Ltd. has been successfully approved and verified',
      timestamp: '4 hours ago',
      status: 'completed'
    },
    {
      id: 3,
      type: 'system',
      title: 'System Update',
      message: 'Platform analytics have been updated with new metrics',
      timestamp: '1 day ago',
      status: 'info'
    }
  ];

  const getIcon = (type: string) => {
    switch (type) {
      case 'new_company':
        return <Users className="h-4 w-4 text-blue-600" />;
      case 'approval':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'system':
        return <AlertCircle className="h-4 w-4 text-orange-600" />;
      default:
        return <Bell className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case 'completed':
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
      case 'info':
        return <Badge className="bg-blue-100 text-blue-800">Info</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-semibold mb-6">Platform Updates</h1>
      
      <div className="space-y-4">
        {updates.map((update) => (
          <Card key={update.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-lg">
                  {getIcon(update.type)}
                  {update.title}
                </CardTitle>
                {getStatusBadge(update.status)}
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-2">{update.message}</p>
              <p className="text-sm text-gray-400">{update.timestamp}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AdminUpdates;
