
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, DollarSign, TrendingUp, ExternalLink } from 'lucide-react';

const AdminAffiliates = () => {
  const affiliates = [
    {
      id: 1,
      name: 'Marketing Partners Inc.',
      email: 'partners@marketingpartners.com',
      companiesReferred: 12,
      revenue: 2400,
      status: 'active',
      joinedDate: '2024-01-15'
    },
    {
      id: 2,
      name: 'Growth Agency',
      email: 'hello@growthagency.com',
      companiesReferred: 8,
      revenue: 1600,
      status: 'active',
      joinedDate: '2024-02-20'
    },
    {
      id: 3,
      name: 'Business Consultants',
      email: 'info@bizconsult.com',
      companiesReferred: 5,
      revenue: 1000,
      status: 'pending',
      joinedDate: '2024-03-10'
    }
  ];

  return (
    <div className="container mx-auto py-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-semibold">Affiliate Management</h1>
        <Button>Add New Affiliate</Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Affiliates</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{affiliates.length}</div>
            <p className="text-xs text-muted-foreground">
              {affiliates.filter(a => a.status === 'active').length} active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              €{affiliates.reduce((sum, a) => sum + a.revenue, 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              From affiliate referrals
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Companies Referred</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {affiliates.reduce((sum, a) => sum + a.companiesReferred, 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              Total referrals
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Affiliates List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {affiliates.map((affiliate) => (
          <Card key={affiliate.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{affiliate.name}</CardTitle>
                <Badge className={
                  affiliate.status === 'active' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }>
                  {affiliate.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="text-sm font-medium">{affiliate.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Companies Referred</p>
                <p className="text-sm font-medium">{affiliate.companiesReferred}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Revenue Generated</p>
                <p className="text-sm font-medium">€{affiliate.revenue}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Joined</p>
                <p className="text-sm font-medium">
                  {new Date(affiliate.joinedDate).toLocaleDateString()}
                </p>
              </div>
              <div className="pt-2">
                <Button size="sm" variant="outline" className="w-full">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View Details
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AdminAffiliates;
