
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import MetricsCard from '@/components/MetricsCard';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useCompanyStatus } from '@/hooks/useCompanyStatus';
import { 
  Eye, 
  MousePointer, 
  Shield, 
  TrendingUp, 
  Calendar,
  AlertTriangle,
  Code,
  CheckCircle
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useNavigate } from 'react-router-dom';

const chartData = [
  { name: 'Jan', views: 1200, clicks: 89 },
  { name: 'Feb', views: 1900, clicks: 142 },
  { name: 'Mar', views: 1700, clicks: 126 },
  { name: 'Apr', views: 2400, clicks: 180 },
  { name: 'May', views: 2100, clicks: 156 },
  { name: 'Jun', views: 2800, clicks: 201 },
];

const Dashboard = () => {
  const { isApproved, hasScriptInstalled, scriptStatus, loading } = useCompanyStatus();
  const navigate = useNavigate();

  const getScriptStatusBadge = () => {
    if (!isApproved) {
      return (
        <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200 flex items-center space-x-1">
          <AlertTriangle className="h-3 w-3" />
          <span>Pending Approval</span>
        </Badge>
      );
    }

    if (scriptStatus === 'active') {
      return (
        <Badge className="bg-green-100 text-green-800 border-green-200 flex items-center space-x-1">
          <CheckCircle className="h-3 w-3" />
          <span>Tracking Active</span>
        </Badge>
      );
    }

    return (
      <Badge className="bg-orange-100 text-orange-800 border-orange-200 flex items-center space-x-1">
        <Code className="h-3 w-3" />
        <span>Script Needed</span>
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back! Here's your badge performance overview.</p>
        </div>
        {getScriptStatusBadge()}
      </div>

      {/* Setup Alert for Non-Approved or Script Not Installed */}
      {!isApproved && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <AlertTriangle className="h-5 w-5 text-yellow-600" />
                <div>
                  <p className="text-sm font-medium text-yellow-800">
                    Company approval pending
                  </p>
                  <p className="text-xs text-yellow-700">
                    Your company is under review. You'll receive full access once approved.
                  </p>
                </div>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigate('/verification')}
              >
                Check Status
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {isApproved && !hasScriptInstalled && (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Code className="h-5 w-5 text-orange-600" />
                <div>
                  <p className="text-sm font-medium text-orange-800">
                    Install your tracking script to start collecting data
                  </p>
                  <p className="text-xs text-orange-700">
                    Get your tracking script and start monitoring badge performance.
                  </p>
                </div>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigate('/widgets')}
              >
                Get Script
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Metrics Grid - Show placeholder data even without tracking */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricsCard
          title="Total Views"
          value={hasScriptInstalled ? "2,456" : "0"}
          change={hasScriptInstalled ? { value: 12, type: 'increase' } : undefined}
          icon={Eye}
          className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200"
        />
        <MetricsCard
          title="Badge Clicks"
          value={hasScriptInstalled ? "187" : "0"}
          change={hasScriptInstalled ? { value: 8, type: 'increase' } : undefined}
          icon={MousePointer}
          className="bg-gradient-to-br from-green-50 to-green-100 border-green-200"
        />
        <MetricsCard
          title="Click Rate"
          value={hasScriptInstalled ? "7.6%" : "0%"}
          change={hasScriptInstalled ? { value: 2, type: 'decrease' } : undefined}
          icon={TrendingUp}
          className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200"
        />
        <MetricsCard
          title="Days Active"
          value={hasScriptInstalled ? "127" : "0"}
          icon={Calendar}
          className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200"
        />
      </div>

      {/* Chart - Only show if tracking is active */}
      {hasScriptInstalled ? (
        <Card>
          <CardHeader>
            <CardTitle>Badge Performance Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false}
                    tickLine={false}
                    className="text-gray-600"
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    className="text-gray-600"
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="views" 
                    stroke="#3b82f6" 
                    strokeWidth={3}
                    dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: '#3b82f6', strokeWidth: 2 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="clicks" 
                    stroke="#10b981" 
                    strokeWidth={3}
                    dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: '#10b981', strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="flex items-center justify-center space-x-6 mt-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <span className="text-sm text-gray-600">Badge Views</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="text-sm text-gray-600">Badge Clicks</span>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Badge Performance Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80 flex items-center justify-center">
              <div className="text-center">
                <Code className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Install tracking script to see performance data</p>
                <Button 
                  className="mt-4" 
                  onClick={() => navigate('/widgets')}
                  disabled={!isApproved}
                >
                  {isApproved ? 'Get Tracking Script' : 'Pending Approval'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Activity - Show when tracking is active */}
      {hasScriptInstalled && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { action: 'Badge viewed', time: '2 minutes ago', detail: 'techcorp.com/about' },
                { action: 'Badge clicked', time: '5 minutes ago', detail: 'Redirected to Welo page' },
                { action: 'Widget updated', time: '1 hour ago', detail: 'Changed badge color to dark' },
                { action: 'Badge viewed', time: '2 hours ago', detail: 'techcorp.com/contact' },
                { action: 'Badge clicked', time: '3 hours ago', detail: 'Redirected to Welo page' },
              ].map((activity, index) => (
                <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                    <p className="text-xs text-gray-500">{activity.detail}</p>
                  </div>
                  <span className="text-xs text-gray-400">{activity.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Dashboard;
