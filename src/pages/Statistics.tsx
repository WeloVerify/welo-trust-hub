
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Eye, 
  Users, 
  MousePointer, 
  Clock,
  Globe,
  Monitor,
  Smartphone,
  AlertTriangle,
  TrendingUp,
  Calendar
} from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import MetricsCard from '@/components/MetricsCard';

const viewsData = [
  { name: 'Jan', views: 1200, visitors: 800 },
  { name: 'Feb', views: 1900, visitors: 1200 },
  { name: 'Mar', views: 1700, visitors: 1100 },
  { name: 'Apr', views: 2400, visitors: 1600 },
  { name: 'May', views: 2100, visitors: 1400 },
  { name: 'Jun', views: 2800, visitors: 1800 },
];

const deviceData = [
  { name: 'Desktop', value: 65, color: '#3b82f6' },
  { name: 'Mobile', value: 30, color: '#10b981' },
  { name: 'Tablet', value: 5, color: '#f59e0b' },
];

const countryData = [
  { name: 'United States', visits: 1200 },
  { name: 'Canada', visits: 800 },
  { name: 'United Kingdom', visits: 650 },
  { name: 'Germany', visits: 400 },
  { name: 'France', visits: 300 },
];

const referrerData = [
  { name: 'google.com', visits: 2100 },
  { name: 'Direct', visits: 1800 },
  { name: 'facebook.com', visits: 650 },
  { name: 'linkedin.com', visits: 420 },
  { name: 'twitter.com', visits: 180 },
];

const Statistics = () => {
  const [dateRange, setDateRange] = useState('30d');
  const [isTrackingActive] = useState(true); // This would be determined by checking if pixel is installed

  if (!isTrackingActive) {
    return (
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Statistics</h1>
          <p className="text-gray-600 mt-1">Track your badge performance and visitor analytics</p>
        </div>
        
        <Alert className="border-orange-200 bg-orange-50">
          <AlertTriangle className="h-4 w-4 text-orange-600" />
          <AlertDescription className="text-orange-800">
            <strong>Tracking not active.</strong> Please install the tracking script on your website to start collecting data.
            <div className="mt-3">
              <Button size="sm" className="mr-2">
                Get Tracking Code
              </Button>
              <Button variant="outline" size="sm">
                Installation Guide
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Statistics</h1>
          <p className="text-gray-600 mt-1">Track your badge performance and visitor analytics</p>
        </div>
        <div className="flex items-center space-x-3">
          <Badge className="bg-green-100 text-green-800 border-green-200">
            Tracking Active
          </Badge>
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricsCard
          title="Total Views"
          value="12,456"
          change={{ value: 12, type: 'increase' }}
          icon={Eye}
          className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200"
        />
        <MetricsCard
          title="Unique Visitors"
          value="8,234"
          change={{ value: 8, type: 'increase' }}
          icon={Users}
          className="bg-gradient-to-br from-green-50 to-green-100 border-green-200"
        />
        <MetricsCard
          title="Badge Clicks"
          value="567"
          change={{ value: 15, type: 'increase' }}
          icon={MousePointer}
          className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200"
        />
        <MetricsCard
          title="Avg. Duration"
          value="2m 34s"
          change={{ value: 5, type: 'decrease' }}
          icon={Clock}
          className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200"
        />
      </div>

      {/* Views Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Views & Visitors Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={viewsData}>
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
                  dataKey="visitors" 
                  stroke="#10b981" 
                  strokeWidth={3}
                  dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: '#10b981', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Device Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Monitor className="h-5 w-5" />
              <span>Device Types</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={deviceData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    dataKey="value"
                  >
                    {deviceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center space-x-6 mt-4">
              {deviceData.map((item) => (
                <div key={item.name} className="flex items-center space-x-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <span className="text-sm text-gray-600">{item.name}: {item.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Countries */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Globe className="h-5 w-5" />
              <span>Top Countries</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={countryData} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis type="number" axisLine={false} tickLine={false} />
                  <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} width={80} />
                  <Tooltip />
                  <Bar dataKey="visits" fill="#3b82f6" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Referrers */}
      <Card>
        <CardHeader>
          <CardTitle>Top Referrers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {referrerData.map((referrer, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-sm font-medium">
                    {index + 1}
                  </div>
                  <span className="font-medium">{referrer.name}</span>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${(referrer.visits / referrerData[0].visits) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium w-16 text-right">{referrer.visits.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Statistics;
