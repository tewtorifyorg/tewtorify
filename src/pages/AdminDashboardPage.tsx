// ============================================================
// Tewtorify — Admin Dashboard (Live Data)
// ============================================================

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Users, UserCheck, ClipboardList, Handshake, Heart,
  ShieldCheck, ArrowRight, AlertCircle, Loader2, TrendingUp,
} from 'lucide-react';
import { useAuth } from '@/features/auth/AuthContext';
import { getPlatformStats } from '@/lib/firestore';
import { formatBDT } from '@/lib/utils';
import type { PlatformStats } from '@/types';

export default function AdminDashboardPage() {
  const { userProfile } = useAuth();
  const [stats, setStats] = useState<PlatformStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getPlatformStats();
        setStats(data);
      } catch (err) {
        console.error('Error fetching stats:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const statCards = [
    {
      label: 'Total Tutors',
      value: stats ? stats.totalTutors.toString() : '—',
      icon: Users,
      color: 'text-primary',
      bg: 'bg-primary/10',
    },
    {
      label: 'Verified',
      value: stats ? stats.verifiedTutors.toString() : '—',
      icon: UserCheck,
      color: 'text-green-500',
      bg: 'bg-green-500/10',
    },
    {
      label: 'Pending',
      value: stats ? stats.pendingTutors.toString() : '—',
      icon: AlertCircle,
      color: 'text-amber-500',
      bg: 'bg-amber-500/10',
      highlight: stats && stats.pendingTutors > 0,
    },
    {
      label: 'Active Requests',
      value: stats ? stats.activeRequests.toString() : '—',
      icon: ClipboardList,
      color: 'text-blue-500',
      bg: 'bg-blue-500/10',
    },
    {
      label: 'Total Matches',
      value: stats ? stats.totalMatches.toString() : '—',
      icon: Handshake,
      color: 'text-purple-500',
      bg: 'bg-purple-500/10',
    },
    {
      label: 'Donations',
      value: stats ? formatBDT(stats.totalDonationAmount) : '—',
      icon: Heart,
      color: 'text-destructive',
      bg: 'bg-destructive/10',
    },
  ];

  const quickLinks = [
    {
      to: '/admin/verifications',
      label: 'Verification Queue',
      icon: ShieldCheck,
      desc: 'Review pending tutor applications',
      badge: stats && stats.pendingTutors > 0 ? stats.pendingTutors : null,
    },
    {
      to: '/admin/matches',
      label: 'Manage Matches',
      icon: Handshake,
      desc: 'View and confirm engagements',
      badge: null,
    },
    {
      to: '/admin/donations',
      label: 'Donation Ledger',
      icon: Heart,
      desc: 'Add and view donation records',
      badge: null,
    },
    {
      to: '/admin/admins',
      label: 'Manage Admins',
      icon: Users,
      desc: 'Add or remove admin accounts',
      badge: null,
    },
  ];

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl font-bold text-foreground">
            Admin Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">
            Welcome, {userProfile?.name}. Manage the Tewtorify platform.
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {statCards.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`p-4 rounded-xl bg-card border transition-all ${
                (stat as { highlight?: boolean }).highlight
                  ? 'border-amber-500/30 shadow-md shadow-amber-500/5'
                  : 'border-border'
              }`}
            >
              <div
                className={`h-9 w-9 rounded-lg ${stat.bg} ${stat.color} flex items-center justify-center mb-3`}
              >
                <stat.icon className="h-4 w-4" />
              </div>
              {loading ? (
                <div className="h-8 w-12 bg-muted animate-pulse rounded" />
              ) : (
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              )}
              <p className="text-xs text-muted-foreground mt-0.5">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Quick Links */}
        <div className="mt-10">
          <h2 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {quickLinks.map((link, i) => (
              <motion.div
                key={link.to}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
              >
                <Link
                  to={link.to}
                  className="flex items-center justify-between p-5 rounded-xl bg-card border border-border hover:border-primary/30 hover:shadow-md transition-all group"
                >
                  <div className="flex items-start gap-4">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center group-hover:scale-110 transition-transform relative">
                      <link.icon className="h-5 w-5" />
                      {link.badge && (
                        <span className="absolute -top-1.5 -right-1.5 h-5 min-w-5 px-1 rounded-full bg-amber-500 text-white text-xs font-bold flex items-center justify-center">
                          {link.badge}
                        </span>
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{link.label}</h3>
                      <p className="text-xs text-muted-foreground mt-1">{link.desc}</p>
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
