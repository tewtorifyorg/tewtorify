// ============================================================
// Tewtorify — TypeScript Types (matching Firestore collections)
// ============================================================

import { Timestamp } from 'firebase/firestore';

// ---------- Enums / Unions ----------

export type UserRole = 'guardian' | 'tutor' | 'admin';

export type VerificationStatus = 'pending' | 'verified' | 'rejected';

export type TutoringMode = 'in-person' | 'online' | 'both';

export type TuitionRequestStatus = 'open' | 'matched' | 'closed';

export type MatchStatus = 'suggested' | 'contact_requested' | 'confirmed' | 'closed';

export type AdminRole = 'admin' | 'super_admin';

export type TutorGenderPreference = 'male' | 'female' | null; // null = no preference

// ---------- Users ----------

export interface User {
  uid: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  createdAt: Timestamp;
  profilePhotoUrl?: string;
}

// ---------- Tutor Profiles ----------

export interface TutorProfile {
  uid: string;
  qualificationLevel: string;
  institution: string;
  department: string;
  certificateUrls: string[];
  nidUrl: string;
  subjects: string[];
  classLevels: string[];
  tutoringMode: TutoringMode;
  preferredAreas: string[];
  expectedSalaryMin: number;
  expectedSalaryMax: number;
  availability: string;
  bio: string;
  verificationStatus: VerificationStatus;
  rejectionReason?: string;
  verifiedAt?: Timestamp;
  verifiedBy?: string; // admin uid
  rating: number; // computed average
  reviewCount: number;
  createdAt: Timestamp;
  updatedAt?: Timestamp;
}

// ---------- Tuition Requests ----------

export interface TuitionRequest {
  id: string;
  guardianUid: string;
  studentClassLevel: string;
  subjects: string[];
  area: string;
  tutoringMode: TutoringMode;
  budgetMin: number;
  budgetMax: number;
  preferredTutorGender: TutorGenderPreference;
  timingPreference: string;
  status: TuitionRequestStatus;
  createdAt: Timestamp;
  isPublicAd: boolean;
  contactInfo?: string; // required if isPublicAd is true
}

// ---------- Matches ----------

export interface Match {
  id: string;
  requestId: string;
  tutorUid: string;
  guardianUid: string;
  matchScore: number; // 0-100 from Groq
  matchReasoning: string; // text from Groq
  status: MatchStatus;
  confirmedAt?: Timestamp;
  confirmedByAdmin?: string; // admin uid
  createdAt: Timestamp;
}

// ---------- Reviews ----------

export interface Review {
  id: string;
  matchId: string;
  guardianUid: string;
  tutorUid: string;
  rating: number; // 1-5
  comment: string;
  createdAt: Timestamp;
  eligible: boolean; // true only if match.status === "confirmed"
}

// ---------- Donations ----------

export interface Donation {
  id: string;
  donorName?: string; // optional / anonymous
  amount: number;
  date: Timestamp;
  note?: string;
  enteredBy: string; // admin uid
  createdAt: Timestamp;
}

// ---------- Admin ----------

export interface AdminRecord {
  uid: string;
  promotedBy: string;
  promotedAt: Timestamp;
  role: AdminRole;
}

// ---------- Platform Stats (computed / aggregated) ----------

export interface PlatformStats {
  totalTutors: number;
  verifiedTutors: number;
  pendingTutors: number;
  activeRequests: number;
  totalMatches: number;
  confirmedMatches: number;
  totalDonations: number;
  totalDonationAmount: number;
}
