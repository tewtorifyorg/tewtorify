// Placeholder pages — will be fully implemented in later milestones
// Each page is a simple component with a title and description

import { motion } from 'framer-motion';
import { Construction } from 'lucide-react';
import { Link } from 'react-router-dom';

function PlaceholderPage({ title, description }: { title: string; description: string }) {
  return (
    <div className="min-h-screen pt-24 pb-12 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-md px-4"
      >
        <div className="h-16 w-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-6">
          <Construction className="h-8 w-8" />
        </div>
        <h1 className="text-2xl font-bold text-foreground mb-2">{title}</h1>
        <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 mt-6 px-5 py-2 rounded-lg border border-border text-sm font-medium hover:bg-muted transition-colors"
        >
          Back to Home
        </Link>
      </motion.div>
    </div>
  );
}

// ---------- Guardian Pages ----------

export function GuardianPostRequestPage() {
  return <PlaceholderPage title="Post Tuition Request" description="This form will let you specify subject, class level, area, budget, and more to find the perfect tutor match." />;
}

export function GuardianMatchesPage() {
  return <PlaceholderPage title="Your Matches" description="AI-recommended tutors for your request will appear here with match scores and reasoning." />;
}

export function GuardianPostAdPage() {
  return <PlaceholderPage title="Post Public Ad" description="Create a public tuition advertisement visible to all tutors." />;
}

export function GuardianReviewsPage() {
  return <PlaceholderPage title="Your Reviews" description="Leave and view reviews for your confirmed tutor engagements." />;
}

// ---------- Tutor Pages ----------

export function TutorApplyPage() {
  return <PlaceholderPage title="Tutor Application" description="Complete your profile, upload certificates and NID to apply for verification." />;
}

export function TutorProfilePage() {
  return <PlaceholderPage title="Your Profile" description="View and edit your tutor profile, qualifications, and preferences." />;
}

export function TutorBrowseRequestsPage() {
  return <PlaceholderPage title="Browse Tuition Requests" description="Browse and apply to open tuition requests from guardians." />;
}

// ---------- Admin Pages ----------

export function AdminVerificationsPage() {
  return <PlaceholderPage title="Verification Queue" description="Review pending tutor applications, view documents, and approve or reject." />;
}

export function AdminMatchesPage() {
  return <PlaceholderPage title="Manage Matches" description="View all matches, manage contact requests, and confirm engagements." />;
}

export function AdminDonationsPage() {
  return <PlaceholderPage title="Donation Ledger" description="View and add donation records for the platform." />;
}

export function AdminAdminsPage() {
  return <PlaceholderPage title="Manage Admins" description="Promote or remove admin accounts (super_admin only)." />;
}

// ---------- Public Pages ----------

export function BrowseAdsPage() {
  return <PlaceholderPage title="Tuition Advertisements" description="Browse public tuition ads posted by guardians looking for tutors." />;
}

export function DonatePage() {
  return <PlaceholderPage title="Donate" description="Support Tewtorify with your donation. Every contribution keeps this platform free." />;
}
