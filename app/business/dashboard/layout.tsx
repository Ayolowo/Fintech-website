'use client';

import { ReactNode } from 'react';
import { ProtectedRoute } from '@/components/business/ProtectedRoute';
import { DashboardLayout } from '@/components/business/DashboardLayout';

export default function BusinessDashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <ProtectedRoute>
      <DashboardLayout>{children}</DashboardLayout>
    </ProtectedRoute>
  );
}
