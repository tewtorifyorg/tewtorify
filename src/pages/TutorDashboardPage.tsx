// Placeholder — Tutor Dashboard (Milestone 3)
import { motion } from 'framer-motion';
import { Clock, CheckCircle2, XCircle, Edit, Search, Star } from 'lucide-react';
import { useAuth } from '@/features/auth/AuthContext';
import { Link } from 'react-router-dom';

export default function TutorDashboardPage() {
  const { userProfile } = useAuth();

  // This will later check tutorProfile.verificationStatus from Firestore
  // For now, show the pending state
  const verificationStatus = 'pending' as 'pending' | 'verified' | 'rejected';

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl font-bold text-foreground">
            Welcome, {userProfile?.name || 'Tutor'} 👋
          </h1>
          <p className="text-muted-foreground mt-1">Your tutor dashboard</p>
        </motion.div>

        {/* Verification Status Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mt-6"
        >
          {verificationStatus === 'pending' && (
            <div className="p-5 rounded-xl bg-amber-500/10 border border-amber-500/20">
              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-amber-500 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-foreground">Application Under Review</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Your tutor application is being reviewed by our admin team. This usually takes 24–48 hours.
                    You'll be notified once your profile is approved.
                  </p>
                  <Link
                    to="/tutor/profile"
                    className="inline-flex items-center gap-1 mt-3 text-sm text-primary hover:underline"
                  >
                    <Edit className="h-3.5 w-3.5" />
                    Edit Profile
                  </Link>
                </div>
              </div>
            </div>
          )}

          {verificationStatus === 'verified' && (
            <div className="p-5 rounded-xl bg-green-500/10 border border-green-500/20">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-foreground">Profile Verified ✓</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Your profile is verified. You can now browse tuition requests and appear in AI recommendations.
                  </p>
                </div>
              </div>
            </div>
          )}

          {verificationStatus === 'rejected' && (
            <div className="p-5 rounded-xl bg-destructive/10 border border-destructive/20">
              <div className="flex items-start gap-3">
                <XCircle className="h-5 w-5 text-destructive mt-0.5" />
                <div>
                  <h3 className="font-semibold text-foreground">Application Rejected</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Your application was not approved. Please review the rejection reason and re-submit.
                  </p>
                  <Link
                    to="/tutor/apply"
                    className="inline-flex items-center gap-1 mt-3 text-sm text-primary hover:underline"
                  >
                    Re-submit Application
                  </Link>
                </div>
              </div>
            </div>
          )}
        </motion.div>

        {/* Verified Actions (shown only when verified) */}
        {verificationStatus === 'verified' && (
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link to="/tutor/browse-requests" className="block p-5 rounded-xl bg-card border border-border hover:border-primary/30 hover:shadow-md transition-all group">
              <div className="flex items-start gap-4">
                <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Search className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Browse Requests</h3>
                  <p className="text-xs text-muted-foreground mt-1">Find open tuition requests matching your subjects</p>
                </div>
              </div>
            </Link>
            <Link to="/tutor/profile" className="block p-5 rounded-xl bg-card border border-border hover:border-primary/30 hover:shadow-md transition-all group">
              <div className="flex items-start gap-4">
                <div className="h-10 w-10 rounded-lg bg-accent/10 text-accent flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Star className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">My Profile & Reviews</h3>
                  <p className="text-xs text-muted-foreground mt-1">View your ratings and manage your profile</p>
                </div>
              </div>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
