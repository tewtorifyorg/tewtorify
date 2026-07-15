// ============================================================
// Tewtorify — Admin Match Management Page
// ============================================================

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Handshake, Loader2, CheckCircle2, Phone, Clock,
  User, BookOpen, MapPin, AlertCircle,
} from 'lucide-react';
import { useAuth } from '@/features/auth/AuthContext';
import {
  getAllMatches,
  getUserProfile,
  getTutorProfile,
  updateMatch,
} from '@/lib/firestore';
import { CLASS_LEVELS } from '@/lib/constants';
import { formatBDT, timeAgo } from '@/lib/utils';
import type { Match, User as UserType, TutorProfile } from '@/types';

interface MatchWithDetails extends Match {
  tutorName: string;
  tutorPhone: string;
  guardianName: string;
  guardianPhone: string;
  tutorSubjects: string[];
}

export default function AdminMatchesPage() {
  const { user } = useAuth();
  const [matches, setMatches] = useState<MatchWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    fetchMatches();
  }, []);

  const fetchMatches = async () => {
    try {
      const allMatches = await getAllMatches();
      const matchesWithDetails = await Promise.all(
        allMatches.map(async (match) => {
          const [tutorUser, guardianUser, tutorProfile] = await Promise.all([
            getUserProfile(match.tutorUid),
            getUserProfile(match.guardianUid),
            getTutorProfile(match.tutorUid),
          ]);
          return {
            ...match,
            tutorName: tutorUser?.name || 'Unknown Tutor',
            tutorPhone: tutorUser?.phone || 'N/A',
            guardianName: guardianUser?.name || 'Unknown Guardian',
            guardianPhone: guardianUser?.phone || 'N/A',
            tutorSubjects: tutorProfile?.subjects || [],
          };
        })
      );
      setMatches(matchesWithDetails);
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async (matchId: string) => {
    if (!user) return;
    setActionLoading(matchId);
    try {
      await updateMatch(matchId, {
        status: 'confirmed',
        confirmedByAdmin: user.uid,
      });
      await fetchMatches();
    } catch (err) {
      console.error('Error confirming match:', err);
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'suggested':
        return <span className="px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 text-xs font-medium">Suggested</span>;
      case 'contact_requested':
        return <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 text-xs font-medium">Contact Requested</span>;
      case 'confirmed':
        return <span className="px-2 py-0.5 rounded-full bg-green-500/10 text-green-600 text-xs font-medium">✓ Confirmed</span>;
      case 'closed':
        return <span className="px-2 py-0.5 rounded-full bg-muted text-muted-foreground text-xs font-medium">Closed</span>;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl font-bold text-foreground">Manage Matches</h1>
          <p className="text-sm text-muted-foreground mt-1">
            View and confirm tutor-guardian engagements
          </p>
        </motion.div>

        <div className="mt-8 space-y-4">
          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : matches.length === 0 ? (
            <div className="text-center py-20">
              <Handshake className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-foreground font-medium">No matches yet</p>
              <p className="text-sm text-muted-foreground mt-1">
                Matches will appear here when tutors are matched with requests
              </p>
            </div>
          ) : (
            matches.map((match, i) => (
              <motion.div
                key={match.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="rounded-xl bg-card border border-border p-5"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-3">
                      {getStatusBadge(match.status)}
                      <span className="text-xs text-muted-foreground">{timeAgo(match.createdAt)}</span>
                      {match.matchScore > 0 && (
                        <span className="px-2 py-0.5 rounded bg-primary/10 text-primary text-xs font-medium">
                          {match.matchScore}% match
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Tutor */}
                      <div className="p-3 rounded-lg bg-muted/50">
                        <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">Tutor</p>
                        <p className="text-sm font-medium text-foreground">{match.tutorName}</p>
                        <p className="text-xs text-muted-foreground">{match.tutorPhone}</p>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {match.tutorSubjects.slice(0, 3).map((s) => (
                            <span key={s} className="px-1.5 py-0.5 rounded bg-primary/10 text-primary text-[10px]">{s}</span>
                          ))}
                        </div>
                      </div>
                      {/* Guardian */}
                      <div className="p-3 rounded-lg bg-muted/50">
                        <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">Guardian</p>
                        <p className="text-sm font-medium text-foreground">{match.guardianName}</p>
                        <p className="text-xs text-muted-foreground">{match.guardianPhone}</p>
                      </div>
                    </div>

                    {match.matchReasoning && (
                      <p className="mt-3 text-xs text-muted-foreground bg-muted/30 p-2 rounded">
                        {match.matchReasoning}
                      </p>
                    )}
                  </div>

                  {/* Actions */}
                  {(match.status === 'suggested' || match.status === 'contact_requested') && (
                    <button
                      onClick={() => handleConfirm(match.id)}
                      disabled={actionLoading === match.id}
                      className="shrink-0 flex items-center gap-2 px-4 py-2 rounded-lg bg-green-600 text-white text-sm font-semibold hover:bg-green-700 transition-colors disabled:opacity-50"
                    >
                      {actionLoading === match.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <CheckCircle2 className="h-4 w-4" />
                      )}
                      Confirm
                    </button>
                  )}
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
