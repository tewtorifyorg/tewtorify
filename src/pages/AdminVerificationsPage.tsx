// ============================================================
// Tewtorify — Admin Verification Queue Page
// Review pending tutor applications, view docs, approve/reject
// ============================================================

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldCheck, Clock, CheckCircle2, XCircle, Eye, FileText,
  Download, ChevronDown, ChevronUp, Loader2, AlertCircle,
  Search, Filter, User, GraduationCap, MapPin, BookOpen,
  ExternalLink, X,
} from 'lucide-react';
import { useAuth } from '@/features/auth/AuthContext';
import {
  getTutorProfilesByStatus,
  getAllTutorProfiles,
  updateTutorVerification,
  getUserProfile,
} from '@/lib/firestore';
import { QUALIFICATION_LEVELS, CLASS_LEVELS, TUTORING_MODES } from '@/lib/constants';
import { formatBDT, formatDate, timeAgo } from '@/lib/utils';
import type { TutorProfile, VerificationStatus, User as UserType } from '@/types';

// ---------- Types ----------

interface TutorWithUser extends TutorProfile {
  userName: string;
  userEmail: string;
  userPhone: string;
}

type FilterTab = 'pending' | 'verified' | 'rejected' | 'all';

// ---------- Component ----------

export default function AdminVerificationsPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<FilterTab>('pending');
  const [tutors, setTutors] = useState<TutorWithUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedUid, setExpandedUid] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Action state
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [rejectModal, setRejectModal] = useState<{ uid: string; name: string } | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  // Fetch tutors
  useEffect(() => {
    fetchTutors();
  }, [activeTab]);

  const fetchTutors = async () => {
    setLoading(true);
    try {
      let profiles: TutorProfile[];
      if (activeTab === 'all') {
        profiles = await getAllTutorProfiles();
      } else {
        profiles = await getTutorProfilesByStatus(activeTab as VerificationStatus);
      }

      // Fetch user data for each tutor
      const tutorsWithUser = await Promise.all(
        profiles.map(async (profile) => {
          const userData = await getUserProfile(profile.uid);
          return {
            ...profile,
            userName: userData?.name || 'Unknown',
            userEmail: userData?.email || 'N/A',
            userPhone: userData?.phone || 'N/A',
          };
        })
      );

      setTutors(tutorsWithUser);
    } catch (err) {
      console.error('Error fetching tutors:', err);
    } finally {
      setLoading(false);
    }
  };

  // Approve tutor
  const handleApprove = async (uid: string) => {
    if (!user) return;
    setActionLoading(uid);
    try {
      await updateTutorVerification(uid, 'verified', user.uid);
      await fetchTutors();
    } catch (err) {
      console.error('Error approving tutor:', err);
    } finally {
      setActionLoading(null);
    }
  };

  // Reject tutor
  const handleReject = async () => {
    if (!user || !rejectModal) return;
    setActionLoading(rejectModal.uid);
    try {
      await updateTutorVerification(
        rejectModal.uid,
        'rejected',
        user.uid,
        rejectReason || 'Application did not meet our requirements.'
      );
      setRejectModal(null);
      setRejectReason('');
      await fetchTutors();
    } catch (err) {
      console.error('Error rejecting tutor:', err);
    } finally {
      setActionLoading(null);
    }
  };

  // Filter by search
  const filteredTutors = tutors.filter((t) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      t.userName.toLowerCase().includes(q) ||
      t.userEmail.toLowerCase().includes(q) ||
      t.institution.toLowerCase().includes(q) ||
      t.department.toLowerCase().includes(q) ||
      t.subjects.some((s) => s.toLowerCase().includes(q))
    );
  });

  // Tab counts
  const tabs: { key: FilterTab; label: string; icon: typeof Clock }[] = [
    { key: 'pending', label: 'Pending', icon: Clock },
    { key: 'verified', label: 'Verified', icon: CheckCircle2 },
    { key: 'rejected', label: 'Rejected', icon: XCircle },
    { key: 'all', label: 'All', icon: Filter },
  ];

  const getStatusBadge = (status: VerificationStatus) => {
    switch (status) {
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-600 text-xs font-medium">
            <Clock className="h-3 w-3" /> Pending
          </span>
        );
      case 'verified':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-green-500/10 text-green-600 text-xs font-medium">
            <CheckCircle2 className="h-3 w-3" /> Verified
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-red-500/10 text-red-600 text-xs font-medium">
            <XCircle className="h-3 w-3" /> Rejected
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-3 mb-1">
            <div className="h-10 w-10 rounded-xl gradient-primary text-white flex items-center justify-center">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Verification Queue</h1>
              <p className="text-sm text-muted-foreground">Review and verify tutor applications</p>
            </div>
          </div>
        </motion.div>

        {/* Tabs & Search */}
        <div className="mt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex gap-1 bg-muted rounded-xl p-1">
            {tabs.map((tab) => (
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
              placeholder="Search by name, email, subject..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 pl-9 pr-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
        </div>

        {/* Tutor List */}
        <div className="mt-6 space-y-4">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="flex flex-col items-center gap-3">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground">Loading applications...</p>
              </div>
            </div>
          ) : filteredTutors.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="h-16 w-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
                <ShieldCheck className="h-8 w-8 text-muted-foreground" />
              </div>
              <p className="text-foreground font-medium">No applications found</p>
              <p className="text-sm text-muted-foreground mt-1">
                {activeTab === 'pending'
                  ? 'All caught up! No pending applications.'
                  : `No ${activeTab} applications${searchQuery ? ` matching "${searchQuery}"` : ''}.`}
              </p>
            </div>
          ) : (
            filteredTutors.map((tutor, i) => (
              <motion.div
                key={tutor.uid}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="rounded-xl bg-card border border-border overflow-hidden hover:border-primary/20 transition-colors"
              >
                {/* Summary Row */}
                <div
                  className="flex items-center justify-between p-5 cursor-pointer"
                  onClick={() => setExpandedUid(expandedUid === tutor.uid ? null : tutor.uid)}
                >
                  <div className="flex items-center gap-4 min-w-0">
                    {/* Avatar */}
                    <div className="h-11 w-11 rounded-full gradient-primary flex items-center justify-center text-white font-semibold text-sm shrink-0">
                      {tutor.userName[0]?.toUpperCase() || 'T'}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold text-foreground">{tutor.userName}</h3>
                        {getStatusBadge(tutor.verificationStatus)}
                      </div>
                      <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground flex-wrap">
                        <span className="flex items-center gap-1">
                          <GraduationCap className="h-3 w-3" />
                          {QUALIFICATION_LEVELS.find((q) => q.value === tutor.qualificationLevel)?.label || tutor.qualificationLevel}
                        </span>
                        <span>•</span>
                        <span>{tutor.institution}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {tutor.preferredAreas.slice(0, 2).join(', ')}
                          {tutor.preferredAreas.length > 2 && ` +${tutor.preferredAreas.length - 2}`}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-xs text-muted-foreground hidden sm:block">
                      {timeAgo(tutor.createdAt)}
                    </span>
                    {expandedUid === tutor.uid ? (
                      <ChevronUp className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    )}
                  </div>
                </div>

                {/* Expanded Details */}
                <AnimatePresence>
                  {expandedUid === tutor.uid && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-5 border-t border-border pt-5">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* Left Column — Profile Details */}
                          <div className="space-y-4">
                            {/* Contact */}
                            <div>
                              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                                Contact Info
                              </p>
                              <div className="space-y-1 text-sm">
                                <p className="text-foreground">{tutor.userEmail}</p>
                                <p className="text-foreground">{tutor.userPhone}</p>
                              </div>
                            </div>

                            {/* Qualification */}
                            <div>
                              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                                Qualification
                              </p>
                              <div className="space-y-1 text-sm">
                                <p className="text-foreground">
                                  <strong>Level:</strong>{' '}
                                  {QUALIFICATION_LEVELS.find((q) => q.value === tutor.qualificationLevel)?.label}
                                </p>
                                <p className="text-foreground">
                                  <strong>Institution:</strong> {tutor.institution}
                                </p>
                                <p className="text-foreground">
                                  <strong>Department:</strong> {tutor.department}
                                </p>
                              </div>
                            </div>

                            {/* Bio */}
                            <div>
                              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                                About
                              </p>
                              <p className="text-sm text-foreground leading-relaxed">{tutor.bio}</p>
                            </div>

                            {/* Availability */}
                            <div>
                              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                                Availability
                              </p>
                              <p className="text-sm text-foreground">{tutor.availability}</p>
                            </div>
                          </div>

                          {/* Right Column — Subjects, Areas, Docs */}
                          <div className="space-y-4">
                            {/* Class Levels */}
                            <div>
                              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                                Class Levels
                              </p>
                              <div className="flex flex-wrap gap-1.5">
                                {tutor.classLevels.map((cl) => (
                                  <span
                                    key={cl}
                                    className="px-2 py-0.5 rounded-md bg-primary/10 text-primary text-xs font-medium"
                                  >
                                    {CLASS_LEVELS.find((l) => l.value === cl)?.label || cl}
                                  </span>
                                ))}
                              </div>
                            </div>

                            {/* Subjects */}
                            <div>
                              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                                Subjects
                              </p>
                              <div className="flex flex-wrap gap-1.5">
                                {tutor.subjects.map((s) => (
                                  <span
                                    key={s}
                                    className="px-2 py-0.5 rounded-md bg-accent/10 text-accent text-xs font-medium"
                                  >
                                    {s}
                                  </span>
                                ))}
                              </div>
                            </div>

                            {/* Areas & Mode */}
                            <div>
                              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                                Areas & Mode
                              </p>
                              <p className="text-sm text-foreground">
                                {tutor.preferredAreas.join(', ')} •{' '}
                                {TUTORING_MODES.find((m) => m.value === tutor.tutoringMode)?.label}
                              </p>
                            </div>

                            {/* Salary */}
                            <div>
                              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                                Expected Salary
                              </p>
                              <p className="text-sm text-foreground">
                                {formatBDT(tutor.expectedSalaryMin)} – {formatBDT(tutor.expectedSalaryMax)}/month
                              </p>
                            </div>

                            {/* Documents */}
                            <div>
                              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                                Documents
                              </p>
                              <div className="space-y-2">
                                {/* Certificates */}
                                {tutor.certificateUrls.map((url, idx) => (
                                  <a
                                    key={idx}
                                    href={url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted hover:bg-muted/80 text-sm transition-colors group"
                                  >
                                    <FileText className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-foreground">Certificate {idx + 1}</span>
                                    <ExternalLink className="h-3 w-3 text-muted-foreground ml-auto group-hover:text-primary" />
                                  </a>
                                ))}

                                {/* NID */}
                                <a
                                  href={tutor.nidUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted hover:bg-muted/80 text-sm transition-colors group"
                                >
                                  <User className="h-4 w-4 text-muted-foreground" />
                                  <span className="text-foreground">National ID (NID)</span>
                                  <ExternalLink className="h-3 w-3 text-muted-foreground ml-auto group-hover:text-primary" />
                                </a>
                              </div>
                            </div>

                            {/* Rejection Reason (if rejected) */}
                            {tutor.verificationStatus === 'rejected' && tutor.rejectionReason && (
                              <div>
                                <p className="text-xs font-semibold text-destructive uppercase tracking-wider mb-2">
                                  Rejection Reason
                                </p>
                                <p className="text-sm text-foreground bg-destructive/5 rounded-lg p-3 border border-destructive/20">
                                  {tutor.rejectionReason}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="mt-6 flex items-center gap-3 pt-4 border-t border-border">
                          {tutor.verificationStatus === 'pending' && (
                            <>
                              <button
                                onClick={() => handleApprove(tutor.uid)}
                                disabled={actionLoading === tutor.uid}
                                className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-green-600 text-white text-sm font-semibold hover:bg-green-700 transition-colors disabled:opacity-50"
                              >
                                {actionLoading === tutor.uid ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <CheckCircle2 className="h-4 w-4" />
                                )}
                                Approve
                              </button>
                              <button
                                onClick={() => setRejectModal({ uid: tutor.uid, name: tutor.userName })}
                                disabled={actionLoading === tutor.uid}
                                className="flex items-center gap-2 px-5 py-2.5 rounded-lg border border-destructive/30 text-destructive text-sm font-semibold hover:bg-destructive/10 transition-colors disabled:opacity-50"
                              >
                                <XCircle className="h-4 w-4" />
                                Reject
                              </button>
                            </>
                          )}
                          {tutor.verificationStatus === 'rejected' && (
                            <button
                              onClick={() => handleApprove(tutor.uid)}
                              disabled={actionLoading === tutor.uid}
                              className="flex items-center gap-2 px-5 py-2.5 rounded-lg gradient-primary text-white text-sm font-semibold shadow-md hover:shadow-lg transition-all disabled:opacity-50"
                            >
                              {actionLoading === tutor.uid ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <CheckCircle2 className="h-4 w-4" />
                              )}
                              Re-Approve
                            </button>
                          )}
                          {tutor.verificationStatus === 'verified' && (
                            <p className="text-sm text-muted-foreground">
                              Verified {tutor.verifiedAt ? formatDate(tutor.verifiedAt) : ''}
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
                <h3 className="text-lg font-semibold text-foreground">Reject Application</h3>
                <button
                  onClick={() => setRejectModal(null)}
                  className="p-1.5 rounded-lg hover:bg-muted transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                You are rejecting <strong className="text-foreground">{rejectModal.name}</strong>'s application.
                Please provide a reason.
              </p>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                rows={3}
                placeholder="e.g., Certificates are unclear, NID photo not readable, incorrect information..."
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
                  disabled={actionLoading === rejectModal.uid}
                  className="flex items-center gap-2 px-5 py-2 rounded-lg bg-destructive text-destructive-foreground text-sm font-semibold hover:bg-destructive/90 transition-colors disabled:opacity-50"
                >
                  {actionLoading === rejectModal.uid ? (
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
