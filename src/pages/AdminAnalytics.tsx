
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';
import { 
  TrendingUp, 
  Users, 
  Globe, 
  Activity,
  Calendar,
  Building2
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const AdminAnalytics = () => {
  const [timeFilter, setTimeFilter] = useState<'7' | '30' | '90'>('30');
  const [analytics, setAnalytics] = useState({
    totalCompanies: 0,
    activeCompanies: 0,
    totalViews: 0,
    planBreakdown: [],
    countryBreakdown: [],
    activityData: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, [timeFilter]);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const daysAgo = new Date();
      daysAgo.setDate(daysAgo.getDate() - parseInt(timeFilter));

      // Fetch companies data
      const { data: companies, error: companiesError } = await supabase
        .from('companies')
        .select('*');

      // Fetch tracking events for the time period
      const { data: events, error: eventsError } = await supabase
        .from('tracking_events')
        .select('*')
        .gte('created_at', daysAgo.toISOString());

      if (companiesError || eventsError) {
        console.error('Error fetching analytics:', companiesError || eventsError);
        return;
      }

      // Process the data
      const totalCompanies = companies?.length || 0;
      const activeCompanies = companies?.filter(c => c.status === 'approved').length || 0;
      const totalViews = events?.length || 0;

      // Plan breakdown (mock data since plans aren't fully implemented)
      const planBreakdown = [
        { name: 'Starter', value: Math.floor(totalCompanies * 0.4), color: '#3B82F6' },
        { name: 'Growth', value: Math.floor(totalCompanies * 0.3), color: '#10B981' },
        { name: 'Pro', value: Math.floor(totalCompanies * 0.2), color: '#F59E0B' },
        { name: 'Enterprise', value: Math.floor(totalCompanies * 0.1), color: '#8B5CF6' },
      ];

      // Country breakdown
      const countryCounts = companies?.reduce((acc: any, company) => {
        const country = company.country || 'Unknown';
        acc[country] = (acc[country] || 0) + 1;
        return acc;
      }, {});

      const countryBreakdown = Object.entries(countryCounts || {})
        .map(([country, count]) => ({ country, companies: count }))
        .sort((a: any, b: any) => b.companies - a.companies)
        .slice(0, 5);

      // Activity data for the last 7 days
      const activityData = [];
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dayEvents = events?.filter(e => 
          new Date(e.created_at).toDateString() === date.toDateString()
        ).length || 0;
        
        activityData.push({
          date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          views: dayEvents
        });
      }

      setAnalytics({
        totalCompanies,
        activeCompanies,
        totalViews,
        planBreakdown,
        countryBreakdown,
        activityData
      });
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-10">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold">Global Analytics</h1>
        <div className="flex gap-2">
          {(['7', '30', '90'] as const).map((days) => (
            <Button
              key={days}
              variant={timeFilter === days ? 'default' : 'outline'}
              onClick={() => setTimeFilter(days)}
              size="sm"
            >
              Last {days} days
            </Button>
          ))}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Companies</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalCompanies}</div>
            <p className="text-xs text-muted-foreground">
              {analytics.activeCompanies} active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalViews}</div>
            <p className="text-xs text-muted-foreground">
              Last {timeFilter} days
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approval Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analytics.totalCompanies > 0 ? Math.round((analytics.activeCompanies / analytics.totalCompanies) * 100) : 0}%
            </div>
            <p className="text-xs text-muted-foreground">
              Companies approved
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Countries</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.countryBreakdown.length}</div>
            <p className="text-xs text-muted-foreground">
              Active countries
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Activity Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Daily Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={analytics.activityData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="views" stroke="#3B82F6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Plan Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Plan Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={analytics.planBreakdown}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {analytics.planBreakdown.map((entry: any, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Country Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Top Countries</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analytics.countryBreakdown}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="country" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="companies" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminAnalytics;
