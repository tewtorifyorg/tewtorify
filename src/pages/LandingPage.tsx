// ============================================================
// Tewtorify — Landing Page (Minimalist B&W)
// ============================================================

import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  GraduationCap, Shield, Heart, Users, BookOpen,
  ArrowRight, CheckCircle2, UserCheck, ClipboardCheck,
  Search, BadgeCheck, LayoutDashboard, HelpCircle,
} from 'lucide-react';
import { useAuth } from '@/features/auth/AuthContext';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: 'easeOut' as const },
  }),
};

// Hand-drawn SVG Doodles
const DoodleArrow = () => (
  <svg width="40" height="40" viewBox="0 0 100 100" fill="none" className="absolute -left-12 top-2 text-dark opacity-40 -rotate-12" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10 50 C 30 20, 70 20, 90 50" />
    <path d="M70 45 L 90 50 L 85 70" />
  </svg>
);

const DoodleUnderline = () => (
  <svg width="100%" height="20" viewBox="0 0 200 20" fill="none" className="absolute -bottom-4 left-0 text-dark opacity-30" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
    <path d="M5 10 Q 50 20, 100 10 T 195 10" />
  </svg>
);

const DoodleCircle = () => (
  <svg width="140%" height="140%" viewBox="0 0 100 100" fill="none" className="absolute -left-[20%] -top-[20%] text-dark opacity-10" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M50 5 C 80 5, 95 30, 95 50 C 95 80, 70 95, 50 95 C 20 95, 5 70, 5 50 C 5 20, 20 5, 50 5 Z" />
  </svg>
);

export default function LandingPage() {
  const { userProfile } = useAuth();

  const getCtaLink = () => {
    if (!userProfile) return '/signup';
    switch (userProfile.role) {
      case 'admin': return '/admin/dashboard';
      case 'tutor': return '/tutor/dashboard';
      case 'guardian': return '/guardian/dashboard';
      default: return '/';
    }
  };

  return (
    <div className="overflow-hidden bg-canvas selection:bg-dark selection:text-white">
      {/* ============ HERO SECTION ============ */}
      <section className="relative min-h-[90vh] flex items-center justify-center bg-canvas">
        {/* Subtle grid background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>

        <div className="relative mx-auto w-full max-w-[1000px] px-6 py-20 flex flex-col items-center text-center z-10">

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center px-4 py-1.5 rounded-full bg-surface text-dark text-caption font-semibold tracking-wider uppercase border border-border-subtle mb-10"
          >
            <BadgeCheck className="h-4 w-4 mr-2" />
            100% Free Platform
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-[48px] sm:text-[64px] lg:text-[80px] font-extrabold text-heading leading-[1.05] tracking-tight mb-8"
          >
            Find the perfect <br />
            <span className="relative inline-block">
              tutor in Pabna.
              <DoodleUnderline />
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-[20px] text-body max-w-[600px] leading-relaxed mb-12"
          >
            No hidden fees. No commissions. Just admin-verified teachers ready to help you succeed.
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
              className="px-8 py-3.5 rounded-xl bg-white text-foreground font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center gap-2"
            >
              Get Started Free
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/donate"
              className="px-8 py-3.5 rounded-xl border-2 border-dark text-dark font-bold hover:bg-dark hover:text-white transition-all flex items-center gap-2"
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
              { value: 'Verified', label: 'Teachers' },
              { value: 'Manual', label: 'Review' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl font-bold text-white">{stat.value}</div>
                <div className="text-sm text-white/50 mt-1">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ============ WHY TEWTORIFY ============ */}
      <section className="py-24 bg-surface border-y border-border-subtle relative overflow-hidden">
        {/* Decorative corner doodle */}
        <svg width="200" height="200" viewBox="0 0 100 100" fill="none" className="absolute -top-10 -right-10 text-dark opacity-5" stroke="currentColor" strokeWidth="1" strokeLinecap="round">
           <path d="M 10 10 L 90 10 L 90 90 L 10 90 Z" transform="rotate(15 50 50)" />
           <path d="M 20 20 L 80 20 L 80 80 L 20 80 Z" transform="rotate(-10 50 50)" />
        </svg>

    <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="text-center max-w-2xl mx-auto mb-20"
      >
        <motion.h2
          variants={fadeUp}
          custom={0}
          className="text-[40px] font-bold text-heading tracking-tight"
        >
          Why Tewtorify?
        </motion.h2>
        <motion.p
          variants={fadeUp}
          custom={1}
          className="mt-4 text-[18px] text-body leading-relaxed"
        >
          We believe finding a tutor should be entirely free. No middlemen.
        </motion.p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          {
            icon: Shield,
            title: 'Verified Teachers',
            description: 'Every tutor is manually verified by our team. Certificates and NID are strictly checked.',
          },
          {
            icon: ClipboardCheck,
            title: 'Strict Matching',
            description: 'We ensure tutor qualifications perfectly align with the subjects they want to teach.',
          },
          {
            icon: Heart,
            title: 'Donation-Funded',
            description: 'The platform runs on community donations. Zero commission, zero registration fees.',
          },
        ].map((feature, i) => (
          <motion.div
            key={feature.title}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={i + 2}
            className="p-8 rounded-[24px] bg-canvas border border-border-subtle hover:border-dark transition-all duration-300 group"
          >
            <div className="h-14 w-14 rounded-full bg-surface border border-border-subtle flex items-center justify-center mb-6 group-hover:bg-dark group-hover:text-canvas transition-colors text-dark">
              <feature.icon className="h-6 w-6" strokeWidth={1.5} />
            </div>
            <h3 className="text-[20px] font-bold text-heading mb-3">{feature.title}</h3>
            <p className="text-[15px] text-body leading-relaxed">{feature.description}</p>
          </motion.div>
        ))}
      </div>
      </div>
    </section>

    {/* ============ HOW IT WORKS ============ */}
    <section id="how-it-works" className="py-24 bg-canvas">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto mb-20"
        >
          <motion.h2
            variants={fadeUp}
            custom={0}
            className="text-[40px] font-bold text-heading tracking-tight"
          >
            How it works
          </motion.h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
          {/* Connecting line for desktop */}
          <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-[1px] bg-border-subtle border-dashed border-t"></div>

          {[
            {
              step: '1',
              icon: Users,
              title: 'Register',
              description: 'Create an account as a guardian or a tutor in under a minute.',
            },
            {
              step: '2',
              icon: UserCheck,
              title: 'Verify',
              description: 'Admin team verifies tutor documents for the blue tick.',
            },
            {
              step: '3',
              icon: Search,
              title: 'Match',
              description: 'Get matched and start learning at zero cost.',
            },
          ].map((item, i) => (
            <motion.div
              key={item.step}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              custom={i + 2}
              className="relative text-center z-10"
            >
              <div className="h-24 w-24 rounded-full bg-canvas border-2 border-dark text-dark flex items-center justify-center mx-auto mb-8 relative">
                <DoodleCircle />
                <span className="text-[32px] font-bold">{item.step}</span>
              </div>
              <h3 className="text-[24px] font-bold text-heading mb-4">{item.title}</h3>
              <p className="text-[16px] text-body leading-relaxed max-w-xs mx-auto">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

      {/* ============ HOW IT WORKS ============ */}
      <section className="py-20 bg-background border-t border-border/50">
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
              className="text-3xl font-bold text-foreground"
            >
              কিভাবে কাজ করে?
            </motion.h2>
            <motion.p
              variants={fadeUp}
              custom={1}
              className="mt-4 text-muted-foreground"
            >
              Tewtorify এর মাধ্যমে খুব সহজেই শিক্ষক ও শিক্ষার্থীরা যুক্ত হতে পারেন।
            </motion.p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12 max-w-4xl mx-auto">
            {/* Guardian Flow */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              custom={2}
              className="relative"
            >
              <div className="absolute top-8 bottom-8 left-[1.15rem] w-px bg-border"></div>
              <h3 className="text-xl font-bold text-foreground mb-6 flex items-center gap-3">
                <Users className="h-6 w-6 text-primary" />
                অভিভাবকদের জন্য
              </h3>
              <div className="space-y-6">
                {[
                  { title: 'Post a Request', desc: 'আপনার কী ধরনের শিক্ষক প্রয়োজন তা জানিয়ে একটি request পোস্ট করুন।' },
                  { title: 'Wait for Approvals', desc: 'আমাদের টিম আপনার পোস্টটি যাচাই করে approve করবে।' },
                  { title: 'Match & Connect', desc: 'verified শিক্ষকরা আপনার পোস্টে apply করবেন, আপনি পছন্দমতো বেছে নিন।' }
                ].map((step, i) => (
                  <div key={i} className="flex gap-4 relative">
                    <div className="h-10 w-10 shrink-0 rounded-full bg-card border border-primary/20 flex items-center justify-center text-primary font-bold text-sm relative z-10 shadow-sm">
                      {i + 1}
                    </div>
                    <div className="pt-2">
                      <h4 className="font-semibold text-foreground text-sm">{step.title}</h4>
                      <p className="text-sm text-muted-foreground mt-1">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Tutor Flow */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              custom={3}
              className="relative"
            >
              <div className="absolute top-8 bottom-8 left-[1.15rem] w-px bg-border"></div>
              <h3 className="text-xl font-bold text-foreground mb-6 flex items-center gap-3">
                <GraduationCap className="h-6 w-6 text-accent" />
                শিক্ষকদের জন্য
              </h3>
              <div className="space-y-6">
                {[
                  { title: 'Create Profile', desc: 'নিজের যোগ্যতা ও অভিজ্ঞতা দিয়ে প্রোফাইল তৈরি করুন।' },
                  { title: 'Get Verified', desc: 'অ্যাডমিন প্যানেল থেকে আপনার তথ্য যাচাই করে verified ব্যাজ দেওয়া হবে।' },
                  { title: 'Apply to Jobs', desc: 'Open tuition request গুলোতে apply করুন এবং সরাসরি অভিভাবকের সাথে কথা বলুন।' }
                ].map((step, i) => (
                  <div key={i} className="flex gap-4 relative">
                    <div className="h-10 w-10 shrink-0 rounded-full bg-card border border-accent/20 flex items-center justify-center text-accent font-bold text-sm relative z-10 shadow-sm">
                      {i + 1}
                    </div>
                    <div className="pt-2">
                      <h4 className="font-semibold text-foreground text-sm">{step.title}</h4>
                      <p className="text-sm text-muted-foreground mt-1">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ============ FAQ SECTION ============ */}
      <section className="py-20 bg-muted/30 border-t border-border/50">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <motion.h2
              variants={fadeUp}
              custom={0}
              className="text-3xl font-bold text-foreground flex justify-center items-center gap-3"
            >
              <HelpCircle className="h-8 w-8 text-primary" />
              সচরাচর জিজ্ঞাসিত প্রশ্ন (FAQ)
            </motion.h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={1}
            className="space-y-4"
          >
            {[
              {
                q: 'Tewtorify কি আসলেই সম্পূর্ণ ফ্রি?',
                a: 'হ্যাঁ! শিক্ষক বা অভিভাবক কারো থেকেই আমরা কোনো কমিশন বা ফি নিই না। এই প্ল্যাটফর্মটি সম্পূর্ণ community donation এর মাধ্যমে চলে।'
              },
              {
                q: 'শিক্ষকদের Verification কিভাবে হয়?',
                a: 'শিক্ষকরা রেজিস্ট্রেশন করার পর তাদের NID, Student ID এবং অন্যান্য তথ্য আমাদের অ্যাডমিন প্যানেল manually যাচাই করে। এরপরই তাদের Verified ব্যাজ দেওয়া হয়।'
              },
              {
                q: 'আমি কি সরাসরি শিক্ষকের সাথে যোগাযোগ করতে পারব?',
                a: 'হ্যাঁ। যখন কোনো শিক্ষক আপনার টিউশন পোস্টে apply করবেন, আপনি তার প্রোফাইল দেখে সরাসরি তার দেওয়া ফোন নাম্বারে যোগাযোগ করতে পারবেন।'
              },
              {
                q: 'অ্যাকাউন্ট খুলতে কি টাকা লাগে?',
                a: 'না। অ্যাকাউন্ট খোলা থেকে শুরু করে টিউটর খোঁজা বা টিউশনে অ্যাপ্লাই করা—সবকিছুই একদম ফ্রি।'
              }
            ].map((faq, i) => (
              <div key={i} className="p-6 rounded-2xl bg-card border border-border">
                <h4 className="text-lg font-bold text-foreground mb-2">{faq.q}</h4>
                <p className="text-muted-foreground leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ============ DONATE CTA ============ */}
      <section className="py-20 gradient-hero relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/3 w-80 h-80 rounded-full bg-white/5 blur-3xl" />
          <div className="absolute bottom-0 right-1/3 w-60 h-60 rounded-full bg-accent/8 blur-3xl" />
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
              আমাদের সাহায্য করুন
            </motion.h2>
            <motion.p
              variants={fadeUp}
              custom={2}
              className="text-white/60 mb-8 leading-relaxed"
            >
              Tewtorify সম্পূর্ণ community donation-এ চলে। আপনার সাহায্য আমাদের
              platform maintain, শিক্ষক verify, এবং আরও জেলায় expand করতে সাহায্য করবে।
            </motion.p>
            <motion.div
              variants={fadeUp}
              custom={3}
            >
              <Link
                to="/donate"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-white text-foreground font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-[1.02]"
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
