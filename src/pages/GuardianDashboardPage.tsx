// Placeholder — Guardian Dashboard (Milestone 5)
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Search, Megaphone, Star, ClipboardList } from 'lucide-react';
import { useAuth } from '@/features/auth/AuthContext';

export default function GuardianDashboardPage() {
  const { userProfile } = useAuth();

  const actions = [
    { to: '/guardian/post-request', icon: Plus, label: 'Post Tuition Request', desc: 'Create a new request and get AI-matched tutors' },
    { to: '/guardian/post-ad', icon: Megaphone, label: 'Post Public Ad', desc: 'Advertise your tuition need publicly' },
    { to: '/browse-ads', icon: Search, label: 'Browse Ads', desc: 'See public tuition advertisements' },
    { to: '/guardian/reviews', icon: Star, label: 'My Reviews', desc: 'Leave reviews for confirmed tutors' },
  ];

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
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {actions.map((action, i) => (
            <motion.div
              key={action.to}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Link
                to={action.to}
                className="block p-5 rounded-xl bg-card border border-border hover:border-primary/30 hover:shadow-md transition-all group"
              >
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center group-hover:scale-110 transition-transform">
                    <action.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{action.label}</h3>
                    <p className="text-xs text-muted-foreground mt-1">{action.desc}</p>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Active Requests Placeholder */}
        <div className="mt-10">
          <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <ClipboardList className="h-5 w-5 text-primary" />
            Your Tuition Requests
          </h2>
          <div className="rounded-xl bg-card border border-border p-8 text-center">
            <p className="text-muted-foreground">No tuition requests yet.</p>
            <Link
              to="/guardian/post-request"
              className="inline-flex items-center gap-2 mt-4 px-5 py-2 rounded-lg gradient-primary text-white text-sm font-semibold"
            >
              <Plus className="h-4 w-4" />
              Post Your First Request
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
