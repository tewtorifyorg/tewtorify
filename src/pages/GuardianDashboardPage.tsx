// ============================================================
// Tewtorify — Guardian Dashboard (Live Firestore Data)
// ============================================================

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Plus, Search, Megaphone, Star, ClipboardList, Loader2,
  MapPin, BookOpen, DollarSign, Clock,
} from 'lucide-react';
import { useAuth } from '@/features/auth/AuthContext';
import { getGuardianRequests } from '@/lib/firestore';
import { CLASS_LEVELS } from '@/lib/constants';
import { formatBDT, timeAgo } from '@/lib/utils';
import type { TuitionRequest } from '@/types';
import { FeatureCard } from '@/components/FeatureCard';

export default function GuardianDashboardPage() {
  const { user, userProfile } = useAuth();
  const [requests, setRequests] = useState<TuitionRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      if (!user) return;
      try {
        const data = await getGuardianRequests(user.uid);
        setRequests(data);
      } catch (err) {
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, [user]);

  const actions = [
    { to: '/guardian/post-request', icon: Plus, label: 'Post Tuition Request', desc: 'Create a new request and get AI-matched tutors' },
    { to: '/guardian/post-ad', icon: Megaphone, label: 'Post Public Ad', desc: 'Advertise your tuition need publicly' },
    { to: '/browse-teachers', icon: Search, label: 'Browse Teachers', desc: 'See verified tutor profiles' },
    { to: '/guardian/reviews', icon: Star, label: 'My Reviews', desc: 'Leave reviews for confirmed tutors' },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'open':
        return <span className="px-2 py-0.5 rounded-full bg-green-500/10 text-green-600 text-xs font-medium">Open</span>;
      case 'matched':
        return <span className="px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 text-xs font-medium">Matched</span>;
      case 'closed':
        return <span className="px-2 py-0.5 rounded-full bg-black/10 dark:bg-white/10 text-foreground/80 text-xs font-medium">Closed</span>;
      default:
        return null;
    }
  };

  const getAdStatusBadge = (req: TuitionRequest) => {
    if (!req.isPublicAd) return null;
    switch (req.adStatus) {
      case 'pending':
        return <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 text-xs font-medium">Ad Pending</span>;
      case 'approved':
        return <span className="px-2 py-0.5 rounded-full bg-green-500/10 text-green-600 text-xs font-medium">Ad Approved</span>;
      case 'rejected':
        return <span className="px-2 py-0.5 rounded-full bg-red-500/10 text-red-600 text-xs font-medium">Ad Rejected</span>;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl font-bold text-foreground">
            Welcome, {userProfile?.name || 'Guardian'} 👋
          </h1>
          <p className="text-muted-foreground mt-1">
            Find the perfect tutor for your needs
          </p>
        </motion.div>

        {/* Quick Actions */}
        <div className="mt-8 flex flex-wrap gap-[20px] *:w-full sm:*:w-[calc(50%-10px)]">
          {actions.map((action) => (
            <FeatureCard
              key={action.to}
              to={action.to}
              title={action.label}
              description={action.desc}
              icon={action.icon}
            />
          ))}
        </div>

        {/* Active Requests */}
        <div className="mt-10">
          <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <ClipboardList className="h-5 w-5 text-primary" />
            Your Tuition Requests
          </h2>

          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : requests.length === 0 ? (
            <div className="rounded-xl bg-card border border-border p-8 text-center">
              <p className="text-muted-foreground">No tuition requests yet.</p>
              <Link
                to="/guardian/post-request"
                className="inline-flex items-center gap-2 mt-4 px-5 py-2 rounded-full bg-dark text-canvas text-sm font-semibold hover:scale-105 transition-transform"
              >
                <Plus className="h-4 w-4" />
                Post Your First Request
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {requests.map((req, i) => (
                <motion.div
                  key={req.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + i * 0.05 }}
                  className="rounded-xl bg-card border border-border p-5 hover:border-primary/20 transition-colors"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <span className="px-2.5 py-0.5 rounded-full bg-dark text-canvas text-xs font-semibold">
                          {CLASS_LEVELS.find((l) => l.value === req.studentClassLevel)?.label || req.studentClassLevel}
                        </span>
                        {getStatusBadge(req.status)}
                        {getAdStatusBadge(req)}
                        <span className="text-xs text-muted-foreground">{timeAgo(req.createdAt)}</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5 mb-2">
                        {req.subjects.map((s) => (
                          <span key={s} className="px-2 py-0.5 rounded bg-black/10 dark:bg-white/10 text-foreground/80 text-xs font-medium">{s}</span>
                        ))}
                      </div>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground flex-wrap">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />{req.area}
                        </span>
                        <span className="flex items-center gap-1">
                          <DollarSign className="h-3 w-3" />
                          {formatBDT(req.budgetMin)}–{formatBDT(req.budgetMax)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />{req.timingPreference}
                        </span>
                      </div>
                    </div>
                    {req.status === 'matched' && (
                      <Link
                        to={`/guardian/matches/${req.id}`}
                        className="shrink-0 px-4 py-2 rounded-full bg-dark text-canvas text-xs font-semibold hover:scale-105 transition-transform"
                      >
                        View Matches
                      </Link>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
