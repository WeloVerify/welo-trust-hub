
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { CheckCircle, Clock, XCircle, Upload, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';

type VerificationStatusType = 'verified' | 'pending' | 'rejected' | 'incomplete';

interface VerificationStatusProps {
  status: VerificationStatusType;
  isAdmin?: boolean;
}

const statusConfig = {
  verified: {
    icon: CheckCircle,
    color: 'bg-green-100 text-green-800 border-green-200',
    iconColor: 'text-green-600',
    label: 'Verified'
  },
  pending: {
    icon: Clock,
    color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    iconColor: 'text-yellow-600',
    label: 'Pending Review'
  },
  rejected: {
    icon: XCircle,
    color: 'bg-red-100 text-red-800 border-red-200',
    iconColor: 'text-red-600',
    label: 'Rejected'
  },
  incomplete: {
    icon: Clock,
    color: 'bg-gray-100 text-gray-800 border-gray-200',
    iconColor: 'text-gray-600',
    label: 'Information Missing'
  }
};

const VerificationStatus = ({ status, isAdmin = false }: VerificationStatusProps) => {
  const config = statusConfig[status];
  const Icon = config.icon;

  const timeline = [
    { date: '2024-01-15', action: 'Application submitted', user: 'Client' },
    { date: '2024-01-16', action: 'Documents uploaded', user: 'Client' },
    { date: '2024-01-17', action: 'Initial review completed', user: 'Welo Admin' },
    { date: '2024-01-18', action: 'Additional information requested', user: 'Welo Admin' },
  ];

  return (
    <div className="space-y-6">
      {/* Status Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Verification Status</span>
            <Badge className={cn("flex items-center space-x-1 border", config.color)}>
              <Icon className={cn("h-3 w-3", config.iconColor)} />
              <span>{config.label}</span>
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Company Name</label>
              <p className="text-gray-900">TechCorp Inc.</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Client ID</label>
              <p className="text-gray-900 font-mono">WLO-2024-001</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Email</label>
              <p className="text-gray-900">contact@techcorp.com</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Phone</label>
              <p className="text-gray-900">+1 (555) 123-4567</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Timeline */}
      <Card>
        <CardHeader>
          <CardTitle>Communication Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {timeline.map((item, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className="h-2 w-2 rounded-full bg-blue-600 mt-2"></div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-900">{item.action}</span>
                    <Badge variant="outline" className="text-xs">
                      {item.user}
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-500">{item.date}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Upload Documents */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Upload className="h-5 w-5" />
            <span>Document Upload</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-blue-400 transition-colors cursor-pointer">
            <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-600">Click to upload or drag and drop</p>
            <p className="text-xs text-gray-500">PDF, PNG, JPG up to 10MB</p>
          </div>
          
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">Comments</label>
            <Textarea 
              placeholder="Add any additional information or comments..."
              className="resize-none"
              rows={3}
            />
          </div>
          
          <Button className="w-full">Upload Documents</Button>
        </CardContent>
      </Card>

      {/* Admin Actions */}
      {isAdmin && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MessageSquare className="h-5 w-5" />
              <span>Admin Actions</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex space-x-2">
              <Button className="flex-1 bg-green-600 hover:bg-green-700">
                <CheckCircle className="h-4 w-4 mr-2" />
                Approve
              </Button>
              <Button variant="destructive" className="flex-1">
                <XCircle className="h-4 w-4 mr-2" />
                Reject
              </Button>
              <Button variant="outline" className="flex-1">
                <Clock className="h-4 w-4 mr-2" />
                Request Info
              </Button>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Internal Notes</label>
              <Textarea 
                placeholder="Add internal notes (not visible to client)..."
                className="resize-none"
                rows={3}
              />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default VerificationStatus;
