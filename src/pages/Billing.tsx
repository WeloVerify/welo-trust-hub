
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { CreditCard, Calendar, DollarSign, Download } from 'lucide-react';
import { toast } from '@/components/ui/sonner';

interface BillingTransaction {
  id: string;
  amount: number;
  currency: string;
  status: string;
  plan_type: string;
  billing_period_start: string;
  billing_period_end: string;
  created_at: string;
}

interface Plan {
  id: string;
  name: string;
  plan_type: string;
  view_limit: number;
  price_eur: number;
  features: string[];
}

const Billing = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<BillingTransaction[]>([]);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [currentPlan, setCurrentPlan] = useState<string>('starter');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchBillingData();
      fetchPlans();
    }
  }, [user]);

  const fetchBillingData = async () => {
    try {
      const { data: transactions, error } = await supabase
        .from('billing_transactions')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTransactions(transactions || []);
    } catch (error) {
      console.error('Error fetching billing data:', error);
      toast.error('Errore nel caricamento dei dati di fatturazione');
    }
  };

  const fetchPlans = async () => {
    try {
      const { data: plans, error } = await supabase
        .from('plans')
        .select('*')
        .eq('active', true)
        .order('price_eur', { ascending: true });

      if (error) throw error;
      setPlans(plans || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching plans:', error);
      setLoading(false);
    }
  };

  const handleUpgrade = (planType: string) => {
    toast.info(`Upgrade a ${planType} - Feature in arrivo!`);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('it-IT');
  };

  const getStatusBadge = (status: string) => {
    const statusMap = {
      completed: { label: 'Completato', variant: 'default' as const },
      pending: { label: 'In elaborazione', variant: 'secondary' as const },
      failed: { label: 'Fallito', variant: 'destructive' as const },
      cancelled: { label: 'Annullato', variant: 'outline' as const }
    };

    const statusInfo = statusMap[status as keyof typeof statusMap] || { label: status, variant: 'outline' as const };
    return <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Fatturazione e Abbonamenti</h1>
        <Button variant="outline">
          <Download className="w-4 h-4 mr-2" />
          Scarica Fatture
        </Button>
      </div>

      {/* Current Plan */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <CreditCard className="w-5 h-5 mr-2" />
            Piano Attuale
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold capitalize">{currentPlan}</h3>
              <p className="text-gray-600">Piano attivo</p>
            </div>
            <Badge variant="default">Attivo</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Available Plans */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <Card key={plan.id} className={currentPlan === plan.plan_type ? 'border-blue-500' : ''}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                {plan.name}
                {currentPlan === plan.plan_type && <Badge>Attuale</Badge>}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <span className="text-3xl font-bold">€{plan.price_eur}</span>
                <span className="text-gray-600">/mese</span>
              </div>
              <div className="space-y-2">
                <p className="font-medium">{plan.view_limit.toLocaleString()} visualizzazioni/mese</p>
                <ul className="space-y-1 text-sm text-gray-600">
                  {plan.features?.map((feature, index) => (
                    <li key={index}>• {feature}</li>
                  ))}
                </ul>
              </div>
              {currentPlan !== plan.plan_type && (
                <Button 
                  className="w-full" 
                  onClick={() => handleUpgrade(plan.name)}
                >
                  Scegli {plan.name}
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Transaction History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <DollarSign className="w-5 h-5 mr-2" />
            Storico Transazioni
          </CardTitle>
        </CardHeader>
        <CardContent>
          {transactions.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data</TableHead>
                  <TableHead>Piano</TableHead>
                  <TableHead>Importo</TableHead>
                  <TableHead>Stato</TableHead>
                  <TableHead>Periodo</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell>{formatDate(transaction.created_at)}</TableCell>
                    <TableCell className="capitalize">{transaction.plan_type}</TableCell>
                    <TableCell>€{transaction.amount}</TableCell>
                    <TableCell>{getStatusBadge(transaction.status)}</TableCell>
                    <TableCell>
                      {transaction.billing_period_start && transaction.billing_period_end && (
                        <div className="flex items-center text-sm text-gray-600">
                          <Calendar className="w-4 h-4 mr-1" />
                          {formatDate(transaction.billing_period_start)} - {formatDate(transaction.billing_period_end)}
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">Nessuna transazione trovata</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Billing;
