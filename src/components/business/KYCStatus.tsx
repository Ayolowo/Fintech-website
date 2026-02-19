'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, Clock, XCircle, AlertCircle } from 'lucide-react';

interface KYCStatusProps {
  status: 'not_started' | 'pending' | 'approved' | 'rejected';
  requiredDocuments?: string[];
}

export function KYCStatus({ status, requiredDocuments }: KYCStatusProps) {
  const getStatusConfig = () => {
    switch (status) {
      case 'approved':
        return {
          icon: <CheckCircle2 className="h-8 w-8 text-green-500" />,
          badge: <Badge className="bg-green-500">Approved</Badge>,
          title: 'KYC Verified',
          description: 'Your business has been verified and you can access all features.',
          color: 'bg-green-50 border-green-200',
        };
      case 'pending':
        return {
          icon: <Clock className="h-8 w-8 text-yellow-500" />,
          badge: <Badge variant="secondary">Pending</Badge>,
          title: 'Verification In Progress',
          description: 'Your documents are being reviewed. This usually takes 1-3 business days.',
          color: 'bg-yellow-50 border-yellow-200',
        };
      case 'rejected':
        return {
          icon: <XCircle className="h-8 w-8 text-red-500" />,
          badge: <Badge variant="destructive">Rejected</Badge>,
          title: 'Verification Failed',
          description: 'Your verification was rejected. Please contact support for more information.',
          color: 'bg-red-50 border-red-200',
        };
      default:
        return {
          icon: <AlertCircle className="h-8 w-8 text-gray-500" />,
          badge: <Badge variant="outline">Not Started</Badge>,
          title: 'KYC Not Completed',
          description: 'Complete your KYC verification to unlock full access to PayBridge features.',
          color: 'bg-gray-50 border-gray-200',
        };
    }
  };

  const config = getStatusConfig();

  return (
    <Card className={`border-2 ${config.color}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {config.icon}
            <div>
              <CardTitle>{config.title}</CardTitle>
              <CardDescription className="mt-1">{config.description}</CardDescription>
            </div>
          </div>
          {config.badge}
        </div>
      </CardHeader>
      {requiredDocuments && requiredDocuments.length > 0 && status === 'not_started' && (
        <CardContent>
          <div className="space-y-2">
            <p className="text-sm font-medium">Required Documents:</p>
            <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
              {requiredDocuments.map((doc, index) => (
                <li key={index}>{doc}</li>
              ))}
            </ul>
          </div>
        </CardContent>
      )}
    </Card>
  );
}
