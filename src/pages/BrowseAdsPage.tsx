// ============================================================
// Tewtorify — Browse Public Tuition Ads (Fixed: shows approved guardian ads)
// ============================================================

import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Search, MapPin, BookOpen, DollarSign, Clock, User,
  Loader2, Megaphone, Phone, Users, ArrowRight,
} from 'lucide-react';
import { getApprovedPublicAds, getUserProfile } from '@/lib/firestore';
import { CLASS_LEVELS, TUTORING_MODES } from '@/lib/constants';
import { formatBDT, timeAgo } from '@/lib/utils';
import type { TuitionRequest } from '@/types';
import { useAuth } from '@/features/auth/AuthContext';

interface AdWithGuardian extends TuitionRequest {
  guardianName: string;
  guardianPhone: string;
}

export default function BrowseAdsPage() {
  const { userProfile } = useAuth();
  const navigate = useNavigate();
  const [ads, setAds] = useState<AdWithGuardian[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Redirect guardians away from ads
  useEffect(() => {
    if (userProfile?.role === 'guardian') {
      navigate('/guardian/dashboard', { replace: true });
    }
  }, [userProfile, navigate]);

  useEffect(() => {
    const fetchAds = async () => {
      try {
        const approvedAds = await getApprovedPublicAds();
        // Fetch guardian names for each ad
        const adsWithGuardian = await Promise.all(
          approvedAds.map(async (ad) => {
            const guardian = await getUserProfile(ad.guardianUid);
            return {
              ...ad,
              guardianName: guardian?.name || 'Guardian',
              guardianPhone: guardian?.phone || '',
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
    fetchAds();
  }, []);

  const filteredAds = ads.filter((ad) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      ad.subjects.some((s) => s.toLowerCase().includes(q)) ||
      ad.area.toLowerCase().includes(q) ||
      ad.guardianName.toLowerCase().includes(q) ||
      (CLASS_LEVELS.find((l) => l.value === ad.studentClassLevel)?.label || '')
        .toLowerCase()
        .includes(q)
    );
  });

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center justify-between flex-wrap gap-4 mb-1">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                <Megaphone className="h-5 w-5" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Tuition Advertisements</h1>
                <p className="text-sm text-muted-foreground">Public tuition requests from guardians</p>
              </div>
            </div>

            {/* Browse Teachers Button */}
            <Link
              to="/browse-teachers"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl gradient-primary text-white text-sm font-semibold shadow-md hover:shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Users className="h-4 w-4" />
              Browse Teachers
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </motion.div>

        {/* Search */}
        <div className="mt-6 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by subject, area, class, guardian name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-11 pl-9 pr-3 rounded-xl border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        {/* Ads */}
        <div className="mt-6 space-y-4">
          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : filteredAds.length === 0 ? (
            <div className="text-center py-20">
              <Megaphone className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-foreground font-medium">No public ads yet</p>
              <p className="text-sm text-muted-foreground mt-1">
                Check back later for tuition advertisements
              </p>
            </div>
          ) : (
            filteredAds.map((ad, i) => (
              <motion.div
                key={ad.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="rounded-xl bg-card border border-border p-5 hover:border-primary/20 hover:shadow-md transition-all"
              >
                {/* Guardian Name & Time */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full gradient-primary flex items-center justify-center text-xs text-white font-semibold">
                      {ad.guardianName[0]?.toUpperCase() || 'G'}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{ad.guardianName}</p>
                      <p className="text-xs text-muted-foreground">Posted {timeAgo(ad.createdAt)}</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-md bg-primary/10 text-primary text-xs font-semibold">
                    {CLASS_LEVELS.find((l) => l.value === ad.studentClassLevel)?.label}
                  </span>
                </div>

                {/* Subjects */}
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {ad.subjects.map((s) => (
                    <span key={s} className="px-2 py-0.5 rounded bg-accent/10 text-accent text-xs font-medium">{s}</span>
                  ))}
                </div>

                {/* Details Row */}
                <div className="flex items-center gap-4 text-xs text-muted-foreground flex-wrap mb-3">
                  <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{ad.area}</span>
                  <span className="flex items-center gap-1">
                    <DollarSign className="h-3 w-3" />
                    {formatBDT(ad.budgetMin)}–{formatBDT(ad.budgetMax)}/mo
                  </span>
                  <span>{TUTORING_MODES.find((m) => m.value === ad.tutoringMode)?.label}</span>
                  <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{ad.timingPreference}</span>
                  {ad.preferredTutorGender && (
                    <span className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      {ad.preferredTutorGender === 'male' ? 'Male' : 'Female'} tutor preferred
                    </span>
                  )}
                </div>

                {/* Contact Info */}
                {ad.contactInfo && (
                  <div className="flex items-center gap-2 p-2.5 rounded-lg bg-primary/5 border border-primary/10 text-sm">
                    <Phone className="h-4 w-4 text-primary" />
                    <span className="text-foreground font-medium">{ad.contactInfo}</span>
                  </div>
                )}
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
