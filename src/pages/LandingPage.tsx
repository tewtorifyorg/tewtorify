// ============================================================
// Tewtorify — Landing Page
// ============================================================

import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  GraduationCap, Shield, Brain, Heart, Users, BookOpen,
  ArrowRight, CheckCircle2, Sparkles, TrendingUp,
} from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: 'easeOut' as const },
  }),
};


export default function LandingPage() {
  return (
    <div className="overflow-hidden">
      {/* ============ HERO SECTION ============ */}
      <section className="relative min-h-screen flex items-center gradient-hero overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-primary/10 blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-accent/10 blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24 pt-32">
          <div className="text-center max-w-3xl mx-auto">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-8"
            >
              <Sparkles className="h-3.5 w-3.5" />
              100% Free, Donation-Funded
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight"
            >
              Connecting Pabna with{' '}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Verified Tutors
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-6 text-lg text-white/60 leading-relaxed max-w-2xl mx-auto"
            >
              Tired of overcharging tuition media? Tewtorify is a community-driven platform
              that matches students with verified tutors using AI — completely free for everyone.
              No hidden fees. No commissions. Just quality education.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link
                to="/signup"
                className="px-8 py-3.5 rounded-xl gradient-primary text-white font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center gap-2"
              >
                Get Started Free
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/donate"
                className="px-8 py-3.5 rounded-xl border border-white/20 text-white font-medium hover:bg-white/5 transition-all flex items-center gap-2"
              >
                <Heart className="h-4 w-4" />
                Support Us
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-16 grid grid-cols-3 gap-8 max-w-lg mx-auto"
            >
              {[
                { value: '100%', label: 'Free' },
                { value: 'AI', label: 'Matching' },
                { value: 'Verified', label: 'Tutors' },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-2xl font-bold text-white">{stat.value}</div>
                  <div className="text-sm text-white/50 mt-1">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ============ PROBLEM SECTION ============ */}
      <section className="py-20 bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center max-w-2xl mx-auto mb-16"
          >
            <motion.h2
              variants={fadeUp}
              custom={0}
              className="text-3xl sm:text-4xl font-bold text-foreground"
            >
              The Problem We're Solving
            </motion.h2>
            <motion.p
              variants={fadeUp}
              custom={1}
              className="mt-4 text-muted-foreground leading-relaxed"
            >
              Tuition media in Pabna charge hefty fees to both tutors and guardians.
              Students lose access to quality education because of financial barriers.
              We believe matching tutors with students should be free.
            </motion.p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: Shield,
                title: 'Verified Tutors Only',
                description: 'Every tutor is manually verified by our admin team. We check certificates, NID, and academic background before they can apply to teach.',
                color: 'text-primary',
                bg: 'bg-primary/10',
              },
              {
                icon: Brain,
                title: 'AI-Powered Matching',
                description: 'Our AI doesn\'t just keyword-match — it checks academic background fit. A History major won\'t be recommended for HSC Physics.',
                color: 'text-accent',
                bg: 'bg-accent/10',
              },
              {
                icon: Heart,
                title: 'Donation-Funded',
                description: 'The entire platform runs on community donations. No registration fee. No commission. No hidden charges — ever.',
                color: 'text-destructive',
                bg: 'bg-destructive/10',
              },
            ].map((feature, i) => (
              <motion.div
                key={feature.title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i + 2}
                className="p-6 rounded-2xl bg-card border border-border hover:border-primary/20 hover:shadow-lg transition-all duration-300 group"
              >
                <div className={`h-12 w-12 rounded-xl ${feature.bg} ${feature.color} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}>
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ HOW IT WORKS ============ */}
      <section id="how-it-works" className="py-20 bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center max-w-2xl mx-auto mb-16"
          >
            <motion.h2
              variants={fadeUp}
              custom={0}
              className="text-3xl sm:text-4xl font-bold text-foreground"
            >
              How It Works
            </motion.h2>
            <motion.p
              variants={fadeUp}
              custom={1}
              className="mt-4 text-muted-foreground"
            >
              Three simple steps to connect with the right tutor
            </motion.p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                icon: Users,
                title: 'Sign Up Free',
                description: 'Create your account as a Guardian (to find tutors) or as a Tutor (to offer your services). It takes less than a minute.',
              },
              {
                step: '02',
                icon: TrendingUp,
                title: 'Get Matched by AI',
                description: 'Post what you need — subject, class, area, budget. Our AI analyzes academic fit and recommends the best-matching verified tutors.',
              },
              {
                step: '03',
                icon: GraduationCap,
                title: 'Start Learning',
                description: 'Request contact with your matched tutor. Our admin team shares the details and you\'re ready to begin — at zero cost.',
              },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i + 2}
                className="relative text-center p-8"
              >
                <div className="text-6xl font-black text-primary/10 mb-4">{item.step}</div>
                <div className="h-14 w-14 rounded-2xl gradient-primary text-white flex items-center justify-center mx-auto mb-5 shadow-lg">
                  <item.icon className="h-7 w-7" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ FOR TUTORS / FOR GUARDIANS ============ */}
      <section className="py-20 bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* For Guardians */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              custom={0}
              className="p-8 rounded-2xl bg-card border border-border"
            >
              <div className="h-12 w-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-6">
                <Users className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">For Guardians & Students</h3>
              <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                Find the perfect tutor without paying any middlemen. Just tell us what you need,
                and our AI will match you with verified tutors whose expertise fits your requirements.
              </p>
              <ul className="space-y-3">
                {[
                  'Post tuition requests with your requirements',
                  'Get AI-matched tutor recommendations',
                  'Browse public tuition ads',
                  'Leave reviews after confirmed engagements',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-foreground">
                    <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                to="/signup"
                className="inline-flex items-center gap-2 mt-6 px-5 py-2.5 rounded-lg gradient-primary text-white text-sm font-semibold shadow-md hover:shadow-lg transition-all"
              >
                Find a Tutor
                <ArrowRight className="h-4 w-4" />
              </Link>
            </motion.div>

            {/* For Tutors */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              custom={1}
              className="p-8 rounded-2xl bg-card border border-border"
            >
              <div className="h-12 w-12 rounded-xl bg-accent/10 text-accent flex items-center justify-center mb-6">
                <BookOpen className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">For Tutors</h3>
              <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                Get verified, build your reputation, and connect with students who genuinely need
                your expertise. No commission — you keep 100% of your earnings.
              </p>
              <ul className="space-y-3">
                {[
                  'Get manually verified for trust',
                  'Appear in AI-powered recommendations',
                  'Browse open tuition requests',
                  'Build ratings & reviews over time',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-foreground">
                    <CheckCircle2 className="h-4 w-4 text-accent shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                to="/signup"
                className="inline-flex items-center gap-2 mt-6 px-5 py-2.5 rounded-lg gradient-accent text-accent-foreground text-sm font-semibold shadow-md hover:shadow-lg transition-all"
              >
                Become a Tutor
                <ArrowRight className="h-4 w-4" />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ============ DONATE CTA ============ */}
      <section className="py-20 gradient-hero relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/3 w-80 h-80 rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute bottom-0 right-1/3 w-60 h-60 rounded-full bg-accent/10 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.div
              variants={fadeUp}
              custom={0}
              className="h-16 w-16 rounded-2xl bg-white/10 flex items-center justify-center mx-auto mb-6"
            >
              <Heart className="h-8 w-8 text-white" />
            </motion.div>
            <motion.h2
              variants={fadeUp}
              custom={1}
              className="text-3xl sm:text-4xl font-bold text-white mb-4"
            >
              Help Us Stay Free Forever
            </motion.h2>
            <motion.p
              variants={fadeUp}
              custom={2}
              className="text-white/60 mb-8 leading-relaxed"
            >
              Tewtorify runs entirely on donations from the community. Your contribution
              helps us maintain the platform, verify tutors, and expand to more districts.
            </motion.p>
            <motion.div
              variants={fadeUp}
              custom={3}
            >
              <Link
                to="/donate"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl gradient-accent text-accent-foreground font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-[1.02]"
              >
                <Heart className="h-4 w-4" />
                Donate Now
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
