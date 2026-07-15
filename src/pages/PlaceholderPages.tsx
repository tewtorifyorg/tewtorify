// Placeholder pages — remaining pages to be fully implemented
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

// ---------- Guardian Pages (remaining placeholders) ----------

export function GuardianMatchesPage() {
  return <PlaceholderPage title="Your Matches" description="AI-recommended tutors for your request will appear here with match scores and reasoning." />;
}

export function GuardianPostAdPage() {
  return <PlaceholderPage title="Post Public Ad" description="Create a public tuition advertisement visible to all tutors." />;
}

export function GuardianReviewsPage() {
  return <PlaceholderPage title="Your Reviews" description="Leave and view reviews for your confirmed tutor engagements." />;
}
