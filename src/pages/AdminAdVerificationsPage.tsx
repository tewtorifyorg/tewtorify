// ============================================================
// Tewtorify — Admin Ad Verifications Page
// Review pending guardian tuition ads, approve/reject
// ============================================================

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Clock, CheckCircle2, XCircle, Filter, Loader2,
  Search, BookOpen, MapPin, ChevronDown, ChevronUp,
  Megaphone, DollarSign, X
} from 'lucide-react';
import { useAuth } from '@/features/auth/AuthContext';
import {
  getPendingAds,
  getTuitionRequests,
  updateAdStatus,
  getUserProfile,
} from '@/lib/firestore';
import { CLASS_LEVELS, TUTORING_MODES } from '@/lib/constants';
import { formatBDT, timeAgo } from '@/lib/utils';
import type { TuitionRequest } from '@/types';

// ---------- Types ----------
interface AdWithGuardian extends TuitionRequest {
  guardianName: string;
  guardianPhone: string;
}

type FilterTab = 'pending' | 'approved' | 'rejected' | 'all';

// ---------- Component ----------
export default function AdminAdVerificationsPage() {
  const { user } = useAuth();
  
  const [activeTab, setActiveTab] = useState<FilterTab>('pending');
  const [ads, setAds] = useState<AdWithGuardian[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedAdId, setExpandedAdId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Action state
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [rejectModal, setRejectModal] = useState<{ id: string; name: string } | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  // Fetch ads
  useEffect(() => {
    fetchAds();
  }, [activeTab]);

  const fetchAds = async () => {
    setLoading(true);
    try {
      let requests: TuitionRequest[];
      if (activeTab === 'pending') {
        requests = await getPendingAds();
      } else if (activeTab === 'all') {
        const all = await getTuitionRequests();
        requests = all.filter((r) => r.isPublicAd);
      } else {
        const all = await getTuitionRequests();
        requests = all.filter((r) => r.isPublicAd && (r.adStatus || 'pending') === activeTab);
      }
      
      // Fetch guardian names
      const adsWithGuardian = await Promise.all(
        requests.map(async (req) => {
          const guardian = req.guardianUid ? await getUserProfile(req.guardianUid) : null;
          return {
            ...req,
            adStatus: req.adStatus || 'pending', // Guarantee adStatus is never undefined
            guardianName: guardian?.name || 'Unknown',
            guardianPhone: guardian?.phone || 'N/A',
          };
        })
      );
      setAds(adsWithGuardian);
    } catch (err) {
      console.error('Error fetching ads:', err);
    } finally {
      setLoading(false);
    }
  };

  // Approve ad
  const handleApprove = async (id: string) => {
    if (!user) return;
    setActionLoading(id);
    try {
      await updateAdStatus(id, 'approved', user.uid);
      await fetchAds();
    } catch (err) {
      console.error('Error approving ad:', err);
    } finally {
      setActionLoading(null);
    }
  };

  // Reject ad
  const handleReject = async () => {
    if (!user || !rejectModal) return;
    setActionLoading(rejectModal.id);
    try {
      await updateAdStatus(
        rejectModal.id,
        'rejected',
        user.uid,
        rejectReason || 'Ad does not meet our guidelines.'
      );
      setRejectModal(null);
      setRejectReason('');
      await fetchAds();
    } catch (err) {
      console.error('Error rejecting ad:', err);
    } finally {
      setActionLoading(null);
    }
  };

  // Filter ads by search
  const filteredAds = ads.filter((a) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      a.guardianName.toLowerCase().includes(q) ||
      a.area.toLowerCase().includes(q) ||
      a.subjects.some((s) => s.toLowerCase().includes(q))
    );
  });

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-3 mb-1">
            <div className="h-10 w-10 rounded-xl gradient-primary text-white flex items-center justify-center">
              <Megaphone className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Ad Verifications</h1>
              <p className="text-sm text-muted-foreground">Review and verify guardian tuition posts</p>
            </div>
          </div>
        </motion.div>

        {/* Tabs & Search */}
        <div className="mt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex gap-1 bg-muted rounded-xl p-1">
            {([
              { key: 'pending' as const, label: 'Pending', icon: Clock },
              { key: 'approved' as const, label: 'Approved', icon: CheckCircle2 },
              { key: 'rejected' as const, label: 'Rejected', icon: XCircle },
              { key: 'all' as const, label: 'All', icon: Filter },
            ]).map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === tab.key
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <tab.icon className="h-3.5 w-3.5" />
                {tab.label}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by guardian, area, subject..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 pl-9 pr-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
        </div>

        {/* Ad List */}
        <div className="mt-6 space-y-4">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="flex flex-col items-center gap-3">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground">Loading ads...</p>
              </div>
            </div>
          ) : filteredAds.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="h-16 w-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
                <Megaphone className="h-8 w-8 text-muted-foreground" />
              </div>
              <p className="text-foreground font-medium">No ads found</p>
              <p className="text-sm text-muted-foreground mt-1">
                {activeTab === 'pending'
                  ? 'All caught up! No pending ads to review.'
                  : `No ${activeTab} ads${searchQuery ? ` matching "${searchQuery}"` : ''}.`}
              </p>
            </div>
          ) : (
            filteredAds.map((ad, i) => (
              <motion.div
                key={ad.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="rounded-xl bg-card border border-border overflow-hidden hover:border-primary/20 transition-colors"
              >
                {/* Ad Summary Row */}
                <div
                  className="flex items-center justify-between p-5 cursor-pointer"
                  onClick={() => setExpandedAdId(expandedAdId === ad.id ? null : ad.id)}
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="h-11 w-11 rounded-full bg-accent/10 flex items-center justify-center text-accent font-semibold text-sm shrink-0">
                      {ad.guardianName[0]?.toUpperCase() || 'G'}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold text-foreground">{ad.guardianName}</h3>
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${
                          ad.adStatus === 'pending' ? 'bg-amber-500/10 text-amber-600' :
                          ad.adStatus === 'approved' ? 'bg-green-500/10 text-green-600' :
                          'bg-red-500/10 text-red-600'
                        }`}>
                          {ad.adStatus === 'pending' && <Clock className="h-3 w-3" />}
                          {ad.adStatus === 'approved' && <CheckCircle2 className="h-3 w-3" />}
                          {ad.adStatus === 'rejected' && <XCircle className="h-3 w-3" />}
                          {ad.adStatus.charAt(0).toUpperCase() + ad.adStatus.slice(1)}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground flex-wrap">
                        <span className="flex items-center gap-1">
                          <BookOpen className="h-3 w-3" />
                          {CLASS_LEVELS.find((l) => l.value === ad.studentClassLevel)?.label}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {ad.area}
                        </span>
                        <span>•</span>
                        <span>{ad.subjects.slice(0, 3).join(', ')}{ad.subjects.length > 3 && ` +${ad.subjects.length - 3}`}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-xs text-muted-foreground hidden sm:block">
                      {timeAgo(ad.createdAt)}
                    </span>
                    {expandedAdId === ad.id ? (
                      <ChevronUp className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    )}
                  </div>
                </div>

                {/* Expanded Ad Details */}
                <AnimatePresence>
                  {expandedAdId === ad.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-5 border-t border-border pt-5">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-4">
                            <div>
                              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Guardian Contact</p>
                              <div className="space-y-1 text-sm">
                                <p className="text-foreground">{ad.guardianName}</p>
                                <p className="text-foreground">{ad.guardianPhone}</p>
                                {ad.contactInfo && <p className="text-foreground">Public contact: {ad.contactInfo}</p>}
                              </div>
                            </div>
                            <div>
                              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Class Level</p>
                              <p className="text-sm text-foreground">{CLASS_LEVELS.find((l) => l.value === ad.studentClassLevel)?.label}</p>
                            </div>
                            <div>
                              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Timing</p>
                              <p className="text-sm text-foreground">{ad.timingPreference}</p>
                            </div>
                          </div>
                          <div className="space-y-4">
                            <div>
                              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Subjects</p>
                              <div className="flex flex-wrap gap-1.5">
                                {ad.subjects.map((s) => (
                                  <span key={s} className="px-2 py-0.5 rounded-md bg-accent/10 text-accent text-xs font-medium">{s}</span>
                                ))}
                              </div>
                            </div>
                            <div>
                              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Area & Mode</p>
                              <p className="text-sm text-foreground">
                                {ad.area} • {TUTORING_MODES.find((m) => m.value === ad.tutoringMode)?.label}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Budget</p>
                              <p className="text-sm text-foreground flex items-center gap-1">
                                <DollarSign className="h-3 w-3" />
                                {formatBDT(ad.budgetMin)} – {formatBDT(ad.budgetMax)}/month
                              </p>
                            </div>
                            {ad.preferredTutorGender && (
                              <div>
                                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Gender Preference</p>
                                <p className="text-sm text-foreground capitalize">{ad.preferredTutorGender} tutor preferred</p>
                              </div>
                            )}
                            {ad.adRejectionReason && ad.adStatus === 'rejected' && (
                              <div>
                                <p className="text-xs font-semibold text-destructive uppercase tracking-wider mb-2">Rejection Reason</p>
                                <p className="text-sm text-foreground bg-destructive/5 rounded-lg p-3 border border-destructive/20">{ad.adRejectionReason}</p>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Ad Action Buttons */}
                        <div className="mt-6 flex items-center gap-3 pt-4 border-t border-border">
                          {ad.adStatus === 'pending' && (
                            <>
                              <button
                                onClick={() => handleApprove(ad.id)}
                                disabled={actionLoading === ad.id}
                                className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-green-600 text-white text-sm font-semibold hover:bg-green-700 transition-colors disabled:opacity-50"
                              >
                                {actionLoading === ad.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
                                Approve Ad
                              </button>
                              <button
                                onClick={() => setRejectModal({ id: ad.id, name: ad.guardianName })}
                                disabled={actionLoading === ad.id}
                                className="flex items-center gap-2 px-5 py-2.5 rounded-lg border border-destructive/30 text-destructive text-sm font-semibold hover:bg-destructive/10 transition-colors disabled:opacity-50"
                              >
                                <XCircle className="h-4 w-4" />
                                Reject Ad
                              </button>
                            </>
                          )}
                          {ad.adStatus === 'rejected' && (
                            <button
                              onClick={() => handleApprove(ad.id)}
                              disabled={actionLoading === ad.id}
                              className="flex items-center gap-2 px-5 py-2.5 rounded-lg gradient-primary text-white text-sm font-semibold shadow-md hover:shadow-lg transition-all disabled:opacity-50"
                            >
                              {actionLoading === ad.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
                              Re-Approve Ad
                            </button>
                          )}
                          {ad.adStatus === 'approved' && (
                            <p className="text-sm text-green-600 flex items-center gap-1.5">
                              <CheckCircle2 className="h-4 w-4" /> This ad is live and visible to the public
                            </p>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))
          )}
        </div>
      </div>

      {/* Reject Modal */}
      <AnimatePresence>
        {rejectModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
            onClick={() => setRejectModal(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md rounded-2xl bg-card border border-border shadow-2xl p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-foreground">Reject Ad</h3>
                <button
                  onClick={() => setRejectModal(null)}
                  className="p-1.5 rounded-lg hover:bg-muted transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                You are rejecting <strong className="text-foreground">{rejectModal.name}</strong>'s tuition ad.
                Please provide a reason.
              </p>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                rows={3}
                placeholder="e.g., Inappropriate content, misleading information, duplicate ad..."
                className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
              />
              <div className="flex justify-end gap-3 mt-4">
                <button
                  onClick={() => setRejectModal(null)}
                  className="px-4 py-2 rounded-lg border border-border text-sm font-medium hover:bg-muted transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReject}
                  disabled={actionLoading === rejectModal.id}
                  className="flex items-center gap-2 px-5 py-2 rounded-lg bg-destructive text-destructive-foreground text-sm font-semibold hover:bg-destructive/90 transition-colors disabled:opacity-50"
                >
                  {actionLoading === rejectModal.id ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <XCircle className="h-4 w-4" />
                  )}
                  Confirm Rejection
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
