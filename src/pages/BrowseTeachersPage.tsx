// ============================================================
// Tewtorify — Browse Teachers (Public Directory of Verified Tutors)
// ============================================================

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, MapPin, BookOpen, DollarSign, Clock, User, Users,
  Loader2, GraduationCap, Star, ShieldCheck, ChevronDown,
  ChevronUp, Megaphone, ArrowRight, Filter,
} from 'lucide-react';
import { getVerifiedTutorProfilesWithUser } from '@/lib/firestore';
import {
  QUALIFICATION_LEVELS, CLASS_LEVELS, TUTORING_MODES,
  ALL_SUBJECTS,
} from '@/lib/constants';
import { formatBDT, timeAgo } from '@/lib/utils';
import type { TutorProfile } from '@/types';

interface TutorWithUser extends TutorProfile {
  userName: string;
  userEmail: string;
  userPhone: string;
}

export default function BrowseTeachersPage() {
  const [tutors, setTutors] = useState<TutorWithUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedUid, setExpandedUid] = useState<string | null>(null);
  const [modeFilter, setModeFilter] = useState<string>('all');

  useEffect(() => {
    const fetchTutors = async () => {
      try {
        const data = await getVerifiedTutorProfilesWithUser();
        setTutors(data);
      } catch (err) {
        console.error('Error fetching tutors:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTutors();
  }, []);

  const filteredTutors = tutors.filter((t) => {
    // Search filter
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        t.userName.toLowerCase().includes(q) ||
        t.institution.toLowerCase().includes(q) ||
        t.department.toLowerCase().includes(q) ||
        t.subjects.some((s) => s.toLowerCase().includes(q)) ||
        t.preferredAreas.some((a) => a.toLowerCase().includes(q)) ||
        t.classLevels.some((cl) =>
          (CLASS_LEVELS.find((l) => l.value === cl)?.label || '').toLowerCase().includes(q)
        );
      if (!matchesSearch) return false;
    }
    // Mode filter
    if (modeFilter !== 'all' && t.tutoringMode !== modeFilter) {
      return false;
    }
    return true;
  });

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center justify-between flex-wrap gap-4 mb-1">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                <Users className="h-5 w-5" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Verified Teachers</h1>
                <p className="text-sm text-muted-foreground">Browse our network of verified tutors</p>
              </div>
            </div>

            {/* Browse Ads Button */}
            <Link
              to="/browse-ads"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl gradient-primary text-white text-sm font-semibold shadow-md hover:shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Megaphone className="h-4 w-4" />
              Tuition Ads
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </motion.div>

        {/* Search & Filters */}
        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by name, subject, area, institution..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-11 pl-9 pr-3 rounded-xl border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div className="flex gap-1 bg-gray-500 rounded-xl p-1 shrink-0">
            {[
              { value: 'all', label: 'All' },
              { value: 'in-person', label: 'In-person' },
              { value: 'online', label: 'Online' },
              { value: 'both', label: 'Both' },
            ].map((opt) => (
              <button
                key={opt.value}
                onClick={() => setModeFilter(opt.value)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  modeFilter === opt.value
                    ? 'bg-white text-black shadow-sm'
                    : 'text-white hover:text-gray-200'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Teachers Grid */}
        <div className="mt-6 space-y-4">
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="flex flex-col items-center gap-3">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground">Loading teachers...</p>
              </div>
            </div>
          ) : filteredTutors.length === 0 ? (
            <div className="text-center py-20">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-foreground font-medium">No teachers found</p>
              <p className="text-sm text-muted-foreground mt-1">
                {searchQuery
                  ? `No verified teachers matching "${searchQuery}"`
                  : 'No verified teachers available yet. Check back later!'}
              </p>
            </div>
          ) : (
            <>
              <p className="text-sm text-muted-foreground">
                {filteredTutors.length} verified teacher{filteredTutors.length !== 1 ? 's' : ''} found
              </p>
              {filteredTutors.map((tutor, i) => (
                <motion.div
                  key={tutor.uid}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="rounded-xl bg-card border border-border overflow-hidden hover:border-primary/20 hover:shadow-md transition-all"
                >
                  {/* Teacher Card Header */}
                  <div
                    className="p-5 cursor-pointer"
                    onClick={() => setExpandedUid(expandedUid === tutor.uid ? null : tutor.uid)}
                  >
                    <div className="flex items-start gap-4">
                      {/* Avatar */}
                      <div className="h-14 w-14 rounded-xl gradient-primary text-white flex items-center justify-center text-xl font-bold shrink-0 shadow-sm">
                        {tutor.userName[0]?.toUpperCase() || 'T'}
                      </div>

                      <div className="flex-1 min-w-0">
                        {/* Name & Badge */}
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-lg font-semibold text-foreground">{tutor.userName}</h3>
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-500/10 text-green-600 text-xs font-medium">
                            <ShieldCheck className="h-3 w-3" /> Verified
                          </span>
                          {tutor.rating > 0 && (
                            <span className="inline-flex items-center gap-1 text-xs text-amber-600">
                              <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                              {tutor.rating.toFixed(1)}
                              <span className="text-muted-foreground">({tutor.reviewCount})</span>
                            </span>
                          )}
                        </div>

                        {/* Qualification */}
                        <p className="text-sm text-muted-foreground mt-0.5">
                          {QUALIFICATION_LEVELS.find((q) => q.value === tutor.qualificationLevel)?.label} — {tutor.institution}
                        </p>

                        {/* Quick Info Row */}
                        <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground flex-wrap">
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {tutor.preferredAreas.slice(0, 2).join(', ')}
                            {tutor.preferredAreas.length > 2 && ` +${tutor.preferredAreas.length - 2}`}
                          </span>
                          <span className="flex items-center gap-1">
                            <DollarSign className="h-3 w-3" />
                            {formatBDT(tutor.expectedSalaryMin)}–{formatBDT(tutor.expectedSalaryMax)}/mo
                          </span>
                          <span>
                            {TUTORING_MODES.find((m) => m.value === tutor.tutoringMode)?.label}
                          </span>
                        </div>

                        {/* Subjects Preview */}
                        <div className="flex flex-wrap gap-1.5 mt-2.5">
                          {tutor.subjects.slice(0, 5).map((s) => (
                            <span key={s} className="px-2 py-0.5 rounded bg-accent/10 text-accent text-xs font-medium">{s}</span>
                          ))}
                          {tutor.subjects.length > 5 && (
                            <span className="px-2 py-0.5 rounded bg-muted text-muted-foreground text-xs">
                              +{tutor.subjects.length - 5} more
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Expand/Collapse */}
                      <div className="shrink-0 pt-2">
                        {expandedUid === tutor.uid ? (
                          <ChevronUp className="h-5 w-5 text-muted-foreground" />
                        ) : (
                          <ChevronDown className="h-5 w-5 text-muted-foreground" />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Expanded Profile Details */}
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
                            {/* Left Column */}
                            <div className="space-y-4">
                              {/* Bio */}
                              <div>
                                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">About</p>
                                <p className="text-sm text-foreground leading-relaxed">{tutor.bio}</p>
                              </div>

                              {/* Availability */}
                              <div>
                                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Availability</p>
                                <p className="text-sm text-foreground">{tutor.availability}</p>
                              </div>

                              {/* Department */}
                              <div>
                                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Department</p>
                                <p className="text-sm text-foreground">{tutor.department}</p>
                              </div>
                            </div>

                            {/* Right Column */}
                            <div className="space-y-4">
                              {/* Class Levels */}
                              <div>
                                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Class Levels</p>
                                <div className="flex flex-wrap gap-1.5">
                                  {tutor.classLevels.map((cl) => (
                                    <span key={cl} className="px-2.5 py-1 rounded-lg bg-primary/10 text-primary text-xs font-medium">
                                      {CLASS_LEVELS.find((l) => l.value === cl)?.label || cl}
                                    </span>
                                  ))}
                                </div>
                              </div>

                              {/* All Subjects */}
                              <div>
                                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">All Subjects</p>
                                <div className="flex flex-wrap gap-1.5">
                                  {tutor.subjects.map((s) => (
                                    <span key={s} className="px-2.5 py-1 rounded-lg bg-accent/10 text-accent text-xs font-medium">{s}</span>
                                  ))}
                                </div>
                              </div>

                              {/* Preferred Areas */}
                              <div>
                                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Preferred Areas</p>
                                <div className="flex flex-wrap gap-1.5">
                                  {tutor.preferredAreas.map((a) => (
                                    <span key={a} className="px-2.5 py-1 rounded-lg bg-muted text-foreground text-xs font-medium">
                                      <MapPin className="inline h-3 w-3 mr-1" />{a}
                                    </span>
                                  ))}
                                </div>
                              </div>

                              {/* Salary & Mode */}
                              <div>
                                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Expected Salary</p>
                                <p className="text-sm text-foreground">
                                  {formatBDT(tutor.expectedSalaryMin)} – {formatBDT(tutor.expectedSalaryMax)}/month
                                  <span className="text-muted-foreground ml-2">
                                    ({TUTORING_MODES.find((m) => m.value === tutor.tutoringMode)?.label})
                                  </span>
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
