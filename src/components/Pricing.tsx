import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
const Pricing = () => {
  const plans = [{
    name: "Starter",
    price: "Free",
    description: "Perfect for small businesses starting their fintech journey",
    features: ["Up to 100 transactions/month", "Basic payment processing", "Standard reporting", "Email support", "Basic fraud protection"],
    buttonText: "Get Started",
    buttonVariant: "outline",
    popular: false
  }, {
    name: "Professional",
    price: "$99",
    period: "per month",
    description: "Ideal for growing businesses with higher transaction volumes",
    features: ["Up to 10,000 transactions/month", "Advanced payment processing", "Real-time analytics", "Multi-currency support", "Advanced fraud protection", "API access", "Priority support"],
    buttonText: "Start 14-day trial",
    buttonVariant: "default",
    popular: true
  }, {
    name: "Enterprise",
    price: "Custom",
    description: "For large organizations with complex financial operations",
    features: ["Unlimited transactions", "Custom payment workflows", "Advanced compliance tools", "Dedicated infrastructure", "White-label solutions", "Dedicated account manager", "24/7 premium support"],
    buttonText: "Contact Sales",
    buttonVariant: "outline",
    popular: false
  }];
  return;
};
export default Pricing;