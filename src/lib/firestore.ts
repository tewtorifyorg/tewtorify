// ============================================================
// Tewtorify — Firestore Service Layer
// All CRUD operations for the platform
// ============================================================

import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  getCountFromServer,
  type DocumentData,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type {
  TutorProfile,
  TuitionRequest,
  Match,
  Review,
  Donation,
  AdminRecord,
  VerificationStatus,
  AdStatus,
  PlatformStats,
  User,
} from '@/types';

// ---------- Collection Refs ----------

const usersRef = collection(db, 'users');
const tutorProfilesRef = collection(db, 'tutorProfiles');
const tuitionRequestsRef = collection(db, 'tuitionRequests');
const matchesRef = collection(db, 'matches');
const reviewsRef = collection(db, 'reviews');
const donationsRef = collection(db, 'donations');
const adminsRef = collection(db, 'admins');

// ---------- Tutor Profiles ----------

export async function getTutorProfile(uid: string): Promise<TutorProfile | null> {
  const snap = await getDoc(doc(db, 'tutorProfiles', uid));
  if (!snap.exists()) return null;
  return { uid: snap.id, ...snap.data() } as TutorProfile;
}

export async function getTutorProfilesByStatus(
  status: VerificationStatus
): Promise<TutorProfile[]> {
  const q = query(
    tutorProfilesRef,
    orderBy('createdAt', 'desc')
  );
  const snap = await getDocs(q);
  const allProfiles = snap.docs.map((d) => ({ uid: d.id, ...d.data() }) as TutorProfile);
  return allProfiles.filter((p) => p.verificationStatus === status);
}

export async function getAllTutorProfiles(): Promise<TutorProfile[]> {
  const q = query(tutorProfilesRef, orderBy('createdAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ uid: d.id, ...d.data() }) as TutorProfile);
}

export async function updateTutorVerification(
  uid: string,
  status: VerificationStatus,
  adminUid: string,
  rejectionReason?: string
): Promise<void> {
  const updateData: DocumentData = {
    verificationStatus: status,
    verifiedBy: adminUid,
    verifiedAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };
  if (status === 'rejected' && rejectionReason) {
    updateData.rejectionReason = rejectionReason;
  }
  await updateDoc(doc(db, 'tutorProfiles', uid), updateData);
}

export async function updateTutorProfile(
  uid: string,
  data: Partial<TutorProfile>
): Promise<void> {
  await updateDoc(doc(db, 'tutorProfiles', uid), {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

// ---------- Users ----------

export async function getUserProfile(uid: string): Promise<User | null> {
  const snap = await getDoc(doc(db, 'users', uid));
  if (!snap.exists()) return null;
  return { uid: snap.id, ...snap.data() } as User;
}

export async function getAllUsers(): Promise<User[]> {
  const snap = await getDocs(usersRef);
  return snap.docs.map((d) => ({ uid: d.id, ...d.data() }) as User);
}

// ---------- Tuition Requests ----------

export async function createTuitionRequest(
  data: Omit<TuitionRequest, 'id' | 'createdAt'>
): Promise<string> {
  const docRef = doc(tuitionRequestsRef);
  await setDoc(docRef, {
    ...data,
    id: docRef.id,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function getTuitionRequests(
  status?: string
): Promise<TuitionRequest[]> {
  let q;
  if (status) {
    q = query(
      tuitionRequestsRef,
      where('status', '==', status),
      orderBy('createdAt', 'desc')
    );
  } else {
    q = query(tuitionRequestsRef, orderBy('createdAt', 'desc'));
  }
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as TuitionRequest);
}

export async function getGuardianRequests(
  guardianUid: string
): Promise<TuitionRequest[]> {
  const q = query(
    tuitionRequestsRef,
    where('guardianUid', '==', guardianUid),
    orderBy('createdAt', 'desc')
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as TuitionRequest);
}

export async function updateTuitionRequest(
  id: string,
  data: Partial<TuitionRequest>
): Promise<void> {
  await updateDoc(doc(db, 'tuitionRequests', id), data);
}

// Get only public ads that have been approved by admin
export async function getApprovedPublicAds(): Promise<TuitionRequest[]> {
  // To avoid requiring complex composite indexes in Firestore, we only sort by 'createdAt' 
  // (which is single-field indexed) and filter the rest locally.
  const q = query(
    tuitionRequestsRef,
    orderBy('createdAt', 'desc')
  );
  const snap = await getDocs(q);
  const allRequests = snap.docs.map((d) => ({ id: d.id, ...d.data() }) as TuitionRequest);
  
  // Filter for open, approved public ads
  return allRequests.filter(
    (req) => req.status === 'open' && req.isPublicAd === true && req.adStatus === 'approved'
  );
}

// Get pending public ads (for admin verification)
export async function getPendingAds(): Promise<TuitionRequest[]> {
  const q = query(
    tuitionRequestsRef,
    orderBy('createdAt', 'desc')
  );
  const snap = await getDocs(q);
  const allRequests = snap.docs.map((d) => ({ id: d.id, ...d.data() }) as TuitionRequest);
  
  return allRequests.filter(
    (req) => req.isPublicAd === true && (req.adStatus || 'pending') === 'pending'
  );
}

// Admin approve/reject an ad
export async function updateAdStatus(
  id: string,
  status: AdStatus,
  adminUid: string,
  rejectionReason?: string
): Promise<void> {
  const updateData: DocumentData = {
    adStatus: status,
  };
  if (status === 'rejected' && rejectionReason) {
    updateData.adRejectionReason = rejectionReason;
  }
  await updateDoc(doc(db, 'tuitionRequests', id), updateData);
}

// Get verified tutor profiles with user info (for public Teachers page)
export async function getVerifiedTutorProfilesWithUser(): Promise<
  (TutorProfile & { userName: string; userEmail: string; userPhone: string })[]
> {
  const profiles = await getTutorProfilesByStatus('verified');
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
  return tutorsWithUser;
}

// ---------- Matches ----------

export async function createMatch(
  data: Omit<Match, 'id' | 'createdAt'>
): Promise<string> {
  const docRef = doc(matchesRef);
  await setDoc(docRef, {
    ...data,
    id: docRef.id,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function getMatchesByRequest(
  requestId: string
): Promise<Match[]> {
  const q = query(
    matchesRef,
    where('requestId', '==', requestId),
    orderBy('matchScore', 'desc')
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Match);
}

export async function getAllMatches(): Promise<Match[]> {
  const q = query(matchesRef, orderBy('createdAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Match);
}

export async function updateMatch(
  id: string,
  data: Partial<Match>
): Promise<void> {
  await updateDoc(doc(db, 'matches', id), data);
}

// ---------- Reviews ----------

export async function createReview(
  data: Omit<Review, 'id' | 'createdAt'>
): Promise<string> {
  const docRef = doc(reviewsRef);
  await setDoc(docRef, {
    ...data,
    id: docRef.id,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function getReviewsByTutor(
  tutorUid: string
): Promise<Review[]> {
  const q = query(
    reviewsRef,
    where('tutorUid', '==', tutorUid),
    orderBy('createdAt', 'desc')
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Review);
}

export async function getReviewsByGuardian(
  guardianUid: string
): Promise<Review[]> {
  const q = query(
    reviewsRef,
    where('guardianUid', '==', guardianUid),
    orderBy('createdAt', 'desc')
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Review);
}

// ---------- Donations ----------

export async function createDonation(
  data: Omit<Donation, 'id' | 'createdAt'>
): Promise<string> {
  const docRef = doc(donationsRef);
  await setDoc(docRef, {
    ...data,
    id: docRef.id,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function getAllDonations(): Promise<Donation[]> {
  const q = query(donationsRef, orderBy('date', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Donation);
}

// ---------- Admin Records ----------

export async function isAdmin(uid: string): Promise<boolean> {
  const snap = await getDoc(doc(db, 'admins', uid));
  return snap.exists();
}

export async function getAdminRecord(
  uid: string
): Promise<AdminRecord | null> {
  const snap = await getDoc(doc(db, 'admins', uid));
  if (!snap.exists()) return null;
  return { uid: snap.id, ...snap.data() } as AdminRecord;
}

export async function getAllAdmins(): Promise<AdminRecord[]> {
  const snap = await getDocs(adminsRef);
  return snap.docs.map((d) => ({ uid: d.id, ...d.data() }) as AdminRecord);
}

export async function promoteToAdmin(
  uid: string,
  promotedByUid: string,
  role: 'admin' | 'super_admin' = 'admin'
): Promise<void> {
  await setDoc(doc(db, 'admins', uid), {
    uid,
    promotedBy: promotedByUid,
    promotedAt: serverTimestamp(),
    role,
  });
  // Also update the user's role in the users collection
  await updateDoc(doc(db, 'users', uid), { role: 'admin' });
}

export async function demoteAdmin(uid: string): Promise<void> {
  await deleteDoc(doc(db, 'admins', uid));
  // Revert user role to guardian (default non-admin role)
  await updateDoc(doc(db, 'users', uid), { role: 'guardian' });
}

// ---------- Platform Stats ----------

export async function getPlatformStats(): Promise<PlatformStats> {
  const [
    totalTutorsSnap,
    verifiedTutorsSnap,
    pendingTutorsSnap,
    activeRequestsSnap,
    totalMatchesSnap,
    confirmedMatchesSnap,
  ] = await Promise.all([
    getCountFromServer(tutorProfilesRef),
    getCountFromServer(
      query(tutorProfilesRef, where('verificationStatus', '==', 'verified'))
    ),
    getCountFromServer(
      query(tutorProfilesRef, where('verificationStatus', '==', 'pending'))
    ),
    getCountFromServer(
      query(tuitionRequestsRef, where('status', '==', 'open'))
    ),
    getCountFromServer(matchesRef),
    getCountFromServer(
      query(matchesRef, where('status', '==', 'confirmed'))
    ),
  ]);

  // Get donation totals
  const donationSnap = await getDocs(donationsRef);
  let totalDonationAmount = 0;
  donationSnap.docs.forEach((d) => {
    totalDonationAmount += d.data().amount || 0;
  });

  return {
    totalTutors: totalTutorsSnap.data().count,
    verifiedTutors: verifiedTutorsSnap.data().count,
    pendingTutors: pendingTutorsSnap.data().count,
    activeRequests: activeRequestsSnap.data().count,
    totalMatches: totalMatchesSnap.data().count,
    confirmedMatches: confirmedMatchesSnap.data().count,
    totalDonations: donationSnap.size,
    totalDonationAmount,
  };
}
