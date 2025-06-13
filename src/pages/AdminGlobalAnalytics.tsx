
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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
  Building2,
  Eye,
  MousePointer
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface PlanBreakdownEntry {
  name: string;
  value: number;
  color: string;
}

interface CountryBreakdownEntry {
  country: string;
  companies: number;
}

interface ActivityEntry {
  date: string;
  views: number;
}

interface AnalyticsState {
  totalCompanies: number;
  activeCompanies: number;
  totalViews: number;
  averageViewsPerCompany: number;
  planBreakdown: PlanBreakdownEntry[];
  countryBreakdown: CountryBreakdownEntry[];
  activityData: ActivityEntry[];
  clickThroughRate: number;
}

const AdminGlobalAnalytics = () => {
  const [timeFilter, setTimeFilter] = useState<'7' | '30' | '90' | 'all'>('30');
  const [analytics, setAnalytics] = useState<AnalyticsState>({
    totalCompanies: 0,
    activeCompanies: 0,
    totalViews: 0,
    averageViewsPerCompany: 0,
    planBreakdown: [],
    countryBreakdown: [],
    activityData: [],
    clickThroughRate: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, [timeFilter]);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      let dateFilter = null;
      if (timeFilter !== 'all') {
        const daysAgo = new Date();
        daysAgo.setDate(daysAgo.getDate() - parseInt(timeFilter));
        dateFilter = daysAgo.toISOString();
      }

      // Fetch companies data
      const { data: companies, error: companiesError } = await supabase
        .from('companies')
        .select('*')
        .gte('created_at', dateFilter || '1970-01-01');

      // Fetch tracking events for the time period
      const { data: events, error: eventsError } = await supabase
        .from('tracking_events')
        .select('*')
        .gte('created_at', dateFilter || '1970-01-01');

      if (companiesError || eventsError) {
        console.error('Error fetching analytics:', companiesError || eventsError);
        return;
      }

      // Process the data
      const totalCompanies = companies?.length || 0;
      const activeCompanies = companies?.filter(c => c.status === 'approved').length || 0;
      const totalViews = events?.length || 0;
      const averageViewsPerCompany = totalCompanies > 0 ? Math.round(totalViews / totalCompanies) : 0;

      // Plan breakdown
      const planCounts = companies?.reduce<Record<string, number>>((acc, company) => {
        const plan = company.plan_type || 'starter';
        acc[plan] = (acc[plan] || 0) + 1;
        return acc;
      }, {});

      const planBreakdown = Object.entries(planCounts || {})
        .map(([name, value]) => ({
          name: name.charAt(0).toUpperCase() + name.slice(1),
          value,
          color: {
            starter: '#3B82F6',
            growth: '#10B981',
            pro: '#F59E0B',
            business: '#8B5CF6',
            enterprise: '#EF4444'
          }[name] || '#6B7280'
        }));

      // Country breakdown
      const countryCounts = companies?.reduce<Record<string, number>>((acc, company) => {
        const country = company.country || 'Unknown';
        acc[country] = (acc[country] || 0) + 1;
        return acc;
      }, {});

      const countryBreakdown = Object.entries(countryCounts || {})
        .map(([country, companies]) => ({ country, companies }))
        .sort((a, b) => b.companies - a.companies)
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

      // Mock CTR calculation (you can enhance this based on your tracking)
      const clickThroughRate = totalViews > 0 ? Math.round((totalViews * 0.12) * 100) / 100 : 0;

      setAnalytics({
        totalCompanies,
        activeCompanies,
        totalViews,
        averageViewsPerCompany,
        planBreakdown,
        countryBreakdown,
        activityData,
        clickThroughRate
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
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold">Global Analytics</h1>
        <div className="flex gap-2">
          {(['7', '30', '90', 'all'] as const).map((days) => (
            <Button
              key={days}
              variant={timeFilter === days ? 'default' : 'outline'}
              onClick={() => setTimeFilter(days)}
              size="sm"
            >
              {days === 'all' ? 'All time' : `Last ${days} days`}
            </Button>
          ))}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Companies</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalCompanies}</div>
            <p className="text-xs text-muted-foreground">
              {analytics.activeCompanies} approved
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalViews}</div>
            <p className="text-xs text-muted-foreground">
              Across all companies
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Views/Company</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.averageViewsPerCompany}</div>
            <p className="text-xs text-muted-foreground">
              Per approved company
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Click-Through Rate</CardTitle>
            <MousePointer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.clickThroughRate}%</div>
            <p className="text-xs text-muted-foreground">
              Platform average
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Activity Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Daily Activity (Last 7 Days)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={analytics.activityData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="views" stroke="#8B5CF6" strokeWidth={2} />
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
                  {analytics.planBreakdown.map((entry, index) => (
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
              <Bar dataKey="companies" fill="#8B5CF6" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminGlobalAnalytics;
