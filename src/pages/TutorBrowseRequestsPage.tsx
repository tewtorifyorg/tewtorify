// ============================================================
// Tewtorify — Tutor Browse Requests Page
// Shows tuition requests FILTERED to tutor's subjects/class levels
// ============================================================

import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Search, Filter, MapPin, BookOpen, DollarSign, Clock,
  User, Loader2, SlidersHorizontal, X, AlertCircle,
  GraduationCap, ArrowLeft, Eye,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/features/auth/AuthContext';
import { getTuitionRequests, getTutorProfile, getUserProfile } from '@/lib/firestore';
import { CLASS_LEVELS, TUTORING_MODES } from '@/lib/constants';
import { formatBDT, timeAgo } from '@/lib/utils';
import type { TuitionRequest, TutorProfile } from '@/types';

// ---------- Component ----------

export default function TutorBrowseRequestsPage() {
  const { user } = useAuth();
  const [requests, setRequests] = useState<(TuitionRequest & { guardianName?: string })[]>([]);
  const [tutorProfile, setTutorProfile] = useState<TutorProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [filterMode, setFilterMode] = useState<'matched' | 'all'>('matched');
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch tutor profile and requests
  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      setLoading(true);
      try {
        const [profile, allRequests] = await Promise.all([
          getTutorProfile(user.uid),
          getTuitionRequests('open'),
        ]);

        setTutorProfile(profile);

        // Fetch guardian names for display
        const requestsWithNames = await Promise.all(
          allRequests.map(async (req) => {
            const guardian = await getUserProfile(req.guardianUid);
            return { ...req, guardianName: guardian?.name || 'Guardian' };
          })
        );

        setRequests(requestsWithNames);
      } catch (err) {
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  // Filter requests based on tutor's subjects and class levels
  const filteredRequests = useMemo(() => {
    let result = requests;

    // Apply subject/class level matching
    if (filterMode === 'matched' && tutorProfile) {
      result = result.filter((req) => {
        // Check if request's class level is in tutor's class levels
        const classMatch = tutorProfile.classLevels.includes(req.studentClassLevel);

        // Check if any request subject overlaps with tutor's subjects
        const subjectMatch = req.subjects.some((s) =>
          tutorProfile.subjects.includes(s)
        );

        // Check area overlap (optional — show if ANY match)
        const areaMatch = tutorProfile.preferredAreas.some(
          (a) => req.area.toLowerCase().includes(a.toLowerCase()) ||
                 a.toLowerCase().includes(req.area.toLowerCase())
        );

        // Must match class level AND at least one subject
        return classMatch && subjectMatch;
      });
    }

    // Apply search query
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (req) =>
          req.subjects.some((s) => s.toLowerCase().includes(q)) ||
          req.area.toLowerCase().includes(q) ||
          req.guardianName?.toLowerCase().includes(q) ||
          (CLASS_LEVELS.find((l) => l.value === req.studentClassLevel)?.label || '')
            .toLowerCase()
            .includes(q)
      );
    }

    return result;
  }, [requests, tutorProfile, filterMode, searchQuery]);

  // Match percentage helper
  const getMatchInfo = (req: TuitionRequest) => {
    if (!tutorProfile) return { score: 0, reasons: [] };
    const reasons: string[] = [];
    let score = 0;

    // Class level match
    if (tutorProfile.classLevels.includes(req.studentClassLevel)) {
      score += 30;
      reasons.push('Class level match');
    }

    // Subject overlap count
    const subjectOverlap = req.subjects.filter((s) =>
      tutorProfile.subjects.includes(s)
    );
    if (subjectOverlap.length > 0) {
      score += Math.min(40, subjectOverlap.length * 15);
      reasons.push(`${subjectOverlap.length}/${req.subjects.length} subjects`);
    }

    // Area match
    const areaMatch = tutorProfile.preferredAreas.some(
      (a) => req.area.toLowerCase().includes(a.toLowerCase())
    );
    if (areaMatch) {
      score += 20;
      reasons.push('Area match');
    }

    // Mode match
    if (
      req.tutoringMode === tutorProfile.tutoringMode ||
      req.tutoringMode === 'both' ||
      tutorProfile.tutoringMode === 'both'
    ) {
      score += 10;
    }

    return { score: Math.min(100, score), reasons };
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-12 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading tuition requests...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Link
            to="/tutor/dashboard"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Dashboard
          </Link>
          <h1 className="text-2xl font-bold text-foreground">Browse Tuition Requests</h1>
          <p className="text-muted-foreground mt-1">
            {filterMode === 'matched'
              ? 'Showing requests matching your subjects & class levels'
              : 'Showing all open requests'}
          </p>
        </motion.div>

        {/* Filter Bar */}
        <div className="mt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex gap-2">
            <button
              onClick={() => setFilterMode('matched')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                filterMode === 'matched'
                  ? 'gradient-primary text-white shadow-sm'
                  : 'bg-muted text-muted-foreground hover:text-foreground'
              }`}
            >
              <SlidersHorizontal className="h-3.5 w-3.5" />
              Matching My Subjects
            </button>
            <button
              onClick={() => setFilterMode('all')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                filterMode === 'all'
                  ? 'gradient-primary text-white shadow-sm'
                  : 'bg-muted text-muted-foreground hover:text-foreground'
              }`}
            >
              <Eye className="h-3.5 w-3.5" />
              All Requests
            </button>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search subjects, area..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 pl-9 pr-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
        </div>

        {/* Tutor's Profile Reminder */}
        {tutorProfile && filterMode === 'matched' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-4 p-3 rounded-lg bg-primary/5 border border-primary/10 text-sm"
          >
            <span className="text-muted-foreground">Your subjects: </span>
            <span className="text-foreground font-medium">
              {tutorProfile.subjects.slice(0, 5).join(', ')}
              {tutorProfile.subjects.length > 5 && ` +${tutorProfile.subjects.length - 5} more`}
            </span>
            <span className="text-muted-foreground"> • Class levels: </span>
            <span className="text-foreground font-medium">
              {tutorProfile.classLevels
                .map((cl) => CLASS_LEVELS.find((l) => l.value === cl)?.label || cl)
                .slice(0, 4)
                .join(', ')}
              {tutorProfile.classLevels.length > 4 && ` +${tutorProfile.classLevels.length - 4} more`}
            </span>
          </motion.div>
        )}

        {/* Request Cards */}
        <div className="mt-6 space-y-4">
          {filteredRequests.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="h-16 w-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
                <BookOpen className="h-8 w-8 text-muted-foreground" />
              </div>
              <p className="text-foreground font-medium">No matching requests</p>
              <p className="text-sm text-muted-foreground mt-1 text-center max-w-sm">
                {filterMode === 'matched'
                  ? "No open requests match your subjects right now. Try viewing all requests."
                  : "No open tuition requests at the moment. Check back later."}
              </p>
              {filterMode === 'matched' && (
                <button
                  onClick={() => setFilterMode('all')}
                  className="mt-4 px-4 py-2 rounded-lg border border-border text-sm font-medium hover:bg-muted transition-colors"
                >
                  View All Requests
                </button>
              )}
            </div>
          ) : (
            filteredRequests.map((req, i) => {
              const matchInfo = getMatchInfo(req);
              return (
                <motion.div
                  key={req.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="rounded-xl bg-card border border-border p-5 hover:border-primary/20 hover:shadow-md transition-all"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      {/* Title */}
                      <div className="flex items-center gap-2 flex-wrap mb-2">
                        <span className="px-2.5 py-0.5 rounded-md bg-primary/10 text-primary text-xs font-semibold">
                          {CLASS_LEVELS.find((l) => l.value === req.studentClassLevel)?.label || req.studentClassLevel}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          by {req.guardianName}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          • {timeAgo(req.createdAt)}
                        </span>
                      </div>

                      {/* Subjects */}
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {req.subjects.map((s) => {
                          const isMatch = tutorProfile?.subjects.includes(s);
                          return (
                            <span
                              key={s}
                              className={`px-2 py-0.5 rounded text-xs font-medium ${
                                isMatch
                                  ? 'bg-green-500/10 text-green-600 ring-1 ring-green-500/20'
                                  : 'bg-muted text-muted-foreground'
                              }`}
                            >
                              {s}
                              {isMatch && ' ✓'}
                            </span>
                          );
                        })}
                      </div>

                      {/* Details */}
                      <div className="flex items-center gap-4 text-xs text-muted-foreground flex-wrap">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {req.area}
                        </span>
                        <span className="flex items-center gap-1">
                          <DollarSign className="h-3 w-3" />
                          {formatBDT(req.budgetMin)} – {formatBDT(req.budgetMax)}/mo
                        </span>
                        <span className="flex items-center gap-1">
                          {TUTORING_MODES.find((m) => m.value === req.tutoringMode)?.label}
                        </span>
                        {req.preferredTutorGender && (
                          <span className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            {req.preferredTutorGender === 'male' ? 'Male tutor' : 'Female tutor'} preferred
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {req.timingPreference}
                        </span>
                      </div>
                    </div>

                    {/* Match Score */}
                    {tutorProfile && matchInfo.score > 0 && (
                      <div className="shrink-0 text-center">
                        <div
                          className={`h-12 w-12 rounded-xl flex items-center justify-center text-sm font-bold ${
                            matchInfo.score >= 70
                              ? 'bg-green-500/10 text-green-600'
                              : matchInfo.score >= 40
                              ? 'bg-amber-500/10 text-amber-600'
                              : 'bg-muted text-muted-foreground'
                          }`}
                        >
                          {matchInfo.score}%
                        </div>
                        <p className="text-[10px] text-muted-foreground mt-1">Match</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })
          )}
        </div>

        {/* Results Count */}
        {filteredRequests.length > 0 && (
          <p className="mt-6 text-center text-sm text-muted-foreground">
            Showing {filteredRequests.length} of {requests.length} open requests
          </p>
        )}
      </div>
    </div>
  );
}
