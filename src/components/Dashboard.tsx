"use client";

import React, { useState } from "react";
import {
  LayoutDashboard,
  CreditCard,
  Receipt,
  Users,
  BarChart3,
  FileText,
  Settings,
  Search,
  TrendingUp,
  Plus,
} from "lucide-react";
import { CircleFlag } from "react-circle-flags";
import Ycombinator from "../assets/companies/ycombinator";
import Stripe from "../assets/companies/stripe";
import Flexport from "../assets/companies/flexport";
import Copart from "../assets/companies/copart";

const Dashboard = () => {
  const [selectedAccount, setSelectedAccount] = useState("USD");

  // Mock data for accounts
  const accounts = [
    { currency: "USD", balance: 187600, change: 5.3, countryCode: "us" },
    { currency: "EUR", balance: 125400, change: 3.2, countryCode: "eu" },
    { currency: "GBP", balance: 98750, change: -1.5, countryCode: "gb" },
  ];

  // Mock data for transactions
  const transactions = [
    {
      id: 1,
      merchant: "Y Combinator",
      description: "Investment Proceeds",
      date: "Nov 5, 2025",
      time: "9:00 AM",
      amount: 500000.0,
      paymentType: "USDC Transfer",
      employee: "Finance Team",
      logoUrl: "yc-component",
    },
    {
      id: 2,
      merchant: "Flexport Inc.",
      description: "International Shipping - Container #FX4829",
      date: "Nov 4, 2025",
      time: "3:20 PM",
      amount: -8450.0,
      paymentType: "USDT Transfer",
      employee: "Operations",
      logoUrl: "flexport-component",
    },
    {
      id: 3,
      merchant: "Stripe Inc.",
      description: "Customer Payment - Invoice #INV-2847",
      date: "Nov 3, 2025",
      time: "11:45 AM",
      amount: 12750.0,
      paymentType: "Received",
      employee: "Sales Team",
      logoUrl: "stripe-component",
    },
    {
      id: 4,
      merchant: "Copart Auto Auction",
      description: "Fleet Vehicle Purchase - 2024 Toyota",
      date: "Nov 2, 2025",
      time: "2:15 PM",
      amount: -24500.0,
      paymentType: "USDC Transfer",
      employee: "Fleet Manager",
      logoUrl: "copart-component",
    },
    {
      id: 5,
      merchant: "AWS",
      description: "Cloud Infrastructure - October",
      date: "Nov 1, 2025",
      time: "4:22 PM",
      amount: -2450.0,
      paymentType: "Virtual Card (5678)",
      employee: "DevOps Team",
      logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Amazon_Web_Services_Logo.svg/2560px-Amazon_Web_Services_Logo.svg.png",
    },
    {
      id: 6,
      merchant: "FedEx Corporation",
      description: "Express Shipping - 48 Packages",
      date: "Oct 31, 2025",
      time: "10:30 AM",
      amount: -1820.0,
      paymentType: "USDT Transfer",
      employee: "Logistics",
      logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9d/FedEx_Express.svg/2560px-FedEx_Express.svg.png",
    },
    {
      id: 7,
      merchant: "Shopify",
      description: "Monthly Sales Revenue",
      date: "Oct 30, 2025",
      time: "8:00 AM",
      amount: 45600.0,
      paymentType: "Received",
      employee: "Sales Team",
      logoUrl: "https://cdn.worldvectorlogo.com/logos/shopify.svg",
    },
    {
      id: 8,
      merchant: "WeWork Companies",
      description: "Office Space - Monthly Rent",
      date: "Oct 29, 2025",
      time: "1:00 PM",
      amount: -5800.0,
      paymentType: "USDC Transfer",
      employee: "Admin",
      logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cb/WeWork.svg/2560px-WeWork.svg.png",
    },
    {
      id: 9,
      merchant: "UPS",
      description: "Ground Shipping - Bulk Order",
      date: "Oct 28, 2025",
      time: "3:45 PM",
      amount: -945.0,
      paymentType: "Virtual Card (4521)",
      employee: "Logistics",
      logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d8/UPS_Logo_Shield_2017.svg/2560px-UPS_Logo_Shield_2017.svg.png",
    },
    {
      id: 10,
      merchant: "Square Inc.",
      description: "POS Transaction Settlement",
      date: "Oct 27, 2025",
      time: "5:30 PM",
      amount: 8920.0,
      paymentType: "Received",
      employee: "Retail Team",
      logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Square%2C_Inc._-_Square_Icon.svg/2048px-Square%2C_Inc._-_Square_Icon.svg.png",
    },
  ];

  const navItems = [
    { icon: LayoutDashboard, label: "Dashboard", active: true },
    { icon: CreditCard, label: "Accounts", active: false },
    { icon: CreditCard, label: "Cards", active: false },
    { icon: Receipt, label: "Transactions", active: false },
    { icon: Users, label: "Spend Groups", active: false },
    { icon: BarChart3, label: "Analytics", active: false },
    { icon: FileText, label: "Invoices", active: false },
    { icon: Settings, label: "Settings", active: false },
  ];

  const formatCurrency = (amount: number, currency: string) => {
    const symbols: { [key: string]: string } = {
      USD: "$",
      EUR: "€",
      GBP: "£",
    };
    return `${symbols[currency]}${Math.abs(amount).toLocaleString("en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })}`;
  };

  const formatTransactionAmount = (amount: number) => {
    return `${amount < 0 ? "-" : "+"}$${Math.abs(amount).toLocaleString(
      "en-US",
      {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }
    )}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-xl"
              style={{ backgroundColor: "#163300" }}
            >
              P
            </div>
            <div>
              <h1 className="font-bold text-[18px] text-gray-900">PayBridge</h1>
              <p className="text-sm text-gray-500">Business Account</p>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="px-4 py-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search"
              className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:border-gray-300"
            />
            <kbd className="absolute right-3 top-1/2 -translate-y-1/2 px-1.5 py-0.5 bg-white border border-gray-200 rounded text-xs text-gray-500">
              /
            </kbd>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-2">
          {navItems.map((item, index) => (
            <button
              key={index}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                item.active
                  ? "bg-gray-100 text-gray-900 font-medium"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <item.icon className="w-4 h-4" />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Dashboard
            </h1>
            <p className="text-gray-600">
              View and manage all your business transactions
            </p>
          </div>

          {/* Account Balances */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {accounts.map((account) => (
              <button
                key={account.currency}
                onClick={() => setSelectedAccount(account.currency)}
                className={`bg-white rounded-2xl p-6 text-left transition-all ${
                  selectedAccount === account.currency
                    ? "ring-1 ring-offset-1 ring-[#163300]"
                    : "hover:shadow-md"
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <CircleFlag
                      countryCode={account.countryCode}
                      height="24"
                      width="24"
                    />
                    <span className="text-sm font-medium text-gray-600">
                      {account.currency} Balance
                    </span>
                  </div>
                  <Plus className="w-4 h-4 text-gray-400" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  {formatCurrency(account.balance, account.currency)}
                </div>
                <div
                  className={`flex items-center gap-1 text-sm ${
                    account.change >= 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  <TrendingUp
                    className={`w-4 h-4 ${
                      account.change < 0 ? "rotate-180" : ""
                    }`}
                  />
                  <span>
                    {account.change >= 0 ? "+" : ""}
                    {account.change}%
                  </span>
                  <span className="text-gray-500">vs last 30 days</span>
                </div>
              </button>
            ))}
          </div>

          {/* Transactions Table */}
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            {/* Table Header */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">
                  All Transactions
                </h2>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search transactions..."
                    className="pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:border-gray-300"
                  />
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <input type="checkbox" className="rounded" />
                    </th>
                    <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Merchant
                    </th>
                    <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Transaction Date
                    </th>
                    <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Payment Type
                    </th>
                    <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Employee
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((transaction) => (
                    <tr
                      key={transaction.id}
                      className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                    >
                      <td className="py-4 px-6">
                        <input type="checkbox" className="rounded" />
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-white border border-gray-200 flex items-center justify-center overflow-hidden flex-shrink-0">
                            {transaction.logoUrl === "yc-component" ? (
                              <Ycombinator className="w-full h-full" />
                            ) : transaction.logoUrl === "stripe-component" ? (
                              <Stripe className="w-full h-full" />
                            ) : transaction.logoUrl === "flexport-component" ? (
                              <Flexport className="w-10 h-10" />
                            ) : transaction.logoUrl === "copart-component" ? (
                              <Copart className="w-full h-full" />
                            ) : (
                              <img
                                src={transaction.logoUrl}
                                alt={transaction.merchant}
                                className="w-full h-full object-contain p-1"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.style.display = "none";
                                  target.parentElement!.innerHTML = `<span class="text-xs font-semibold text-gray-600">${transaction.merchant.substring(0, 2).toUpperCase()}</span>`;
                                }}
                              />
                            )}
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">
                              {transaction.merchant}
                            </div>
                            <div className="text-sm text-gray-500">
                              {transaction.description}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="text-sm text-gray-900">
                          {transaction.date}
                        </div>
                        <div className="text-sm text-gray-500">
                          {transaction.time}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span
                          className={`font-semibold ${
                            transaction.amount < 0
                              ? "text-gray-900"
                              : "text-green-600"
                          }`}
                        >
                          {formatTransactionAmount(transaction.amount)}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-sm text-gray-600">
                          {transaction.paymentType}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-sm text-gray-600">
                          {transaction.employee}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
