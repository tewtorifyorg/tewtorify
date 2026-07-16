// ============================================================
// Tewtorify — Landing Page
// Professional BD-focused design, no AI jargon
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
    <div className="overflow-hidden">
      {/* ============ HERO SECTION ============ */}
      <section className="relative min-h-screen flex items-center gradient-hero overflow-hidden">
        {/* Subtle background decoration */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-80 h-80 rounded-full bg-white/5 blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full bg-accent/8 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24 pt-32">
          <div className="text-center max-w-3xl mx-auto">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/15 text-white/90 text-sm font-medium mb-8"
            >
              <BadgeCheck className="h-3.5 w-3.5" />
              সম্পূর্ণ বিনামূল্যে — Completely Free
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight"
            >
              পাবনার বিশ্বস্ত{' '}
              <span className="bg-gradient-to-r from-amber-300 to-amber-200 bg-clip-text text-transparent">
                টিউশন প্ল্যাটফর্ম
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-6 text-lg text-white/65 leading-relaxed max-w-2xl mx-auto"
            >
              মিডিয়ার অতিরিক্ত চার্জে বিরক্ত? Tewtorify তে প্রতিটি শিক্ষক আমাদের টিম 
              manually verify করে। কোনো ফি নেই, কোনো কমিশন নেই — শুধু মানসম্মত শিক্ষা।
            </motion.p>

            {/* English subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.25 }}
              className="mt-3 text-sm text-white/45 max-w-xl mx-auto"
            >
              Community-driven platform connecting verified tutors with students in Pabna. Zero fees for everyone.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link
                to={getCtaLink()}
                className="px-8 py-3.5 rounded-xl bg-white text-foreground font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center gap-2"
              >
                {userProfile ? 'Go to Dashboard' : 'Get Started Free'}
                {userProfile ? <LayoutDashboard className="h-4 w-4" /> : <ArrowRight className="h-4 w-4" />}
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
        </div>
      </section>

      {/* ============ WHY TEWTORIFY ============ */}
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
              কেন Tewtorify?
            </motion.h2>
            <motion.p
              variants={fadeUp}
              custom={1}
              className="mt-4 text-muted-foreground leading-relaxed"
            >
              পাবনায় মিডিয়া শিক্ষক ও অভিভাবক উভয়ের কাছ থেকে অতিরিক্ত ফি নেয়।
              আমরা বিশ্বাস করি টিউটর খোঁজা সম্পূর্ণ ফ্রি হওয়া উচিত।
            </motion.p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: Shield,
                title: 'Manually Verified Teachers',
                description: 'প্রতিটি শিক্ষক আমাদের admin team manually verify করে। Certificate, NID, ও academic background পরীক্ষা করা হয়।',
                titleBn: 'প্রতিটি শিক্ষক যাচাইকৃত',
                color: 'text-primary',
                bg: 'bg-primary/8',
              },
              {
                icon: ClipboardCheck,
                title: 'Strict Subject Matching',
                description: 'Science background ছাড়া Science পড়ানো যাবে না। আমরা নিশ্চিত করি শিক্ষকের qualification subject-এর সাথে মিলে।',
                titleBn: 'সঠিক বিষয়ে সঠিক শিক্ষক',
                color: 'text-accent',
                bg: 'bg-accent/8',
              },
              {
                icon: Heart,
                title: 'Donation-Funded',
                description: 'পুরো প্ল্যাটফর্ম community donation-এ চলে। কোনো registration fee নেই, কোনো commission নেই — কখনোই না।',
                titleBn: 'সম্পূর্ণ বিনামূল্যে',
                color: 'text-destructive',
                bg: 'bg-destructive/8',
              },
            ].map((feature, i) => (
              <motion.div
                key={feature.title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i + 2}
                className="p-6 rounded-2xl bg-card border border-border hover:border-primary/20 hover:shadow-md transition-all duration-300 group"
              >
                <div className={`h-12 w-12 rounded-xl ${feature.bg} ${feature.color} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}>
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-1">{feature.title}</h3>
                <p className="text-xs text-primary font-medium mb-2">{feature.titleBn}</p>
                <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ HOW IT WORKS ============ */}
      <section id="how-it-works" className="py-20 gradient-warm">
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
              কিভাবে কাজ করে?
            </motion.h2>
            <motion.p
              variants={fadeUp}
              custom={1}
              className="mt-4 text-muted-foreground"
            >
              তিনটি সহজ ধাপে সঠিক শিক্ষক খুঁজে নিন
            </motion.p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                icon: Users,
                title: 'Register Free',
                titleBn: 'ফ্রি রেজিস্ট্রেশন করুন',
                description: 'Guardian হিসেবে (শিক্ষক খুঁজতে) অথবা Tutor হিসেবে (শেখাতে) account তৈরি করুন। এক মিনিটেরও কম সময় লাগবে।',
              },
              {
                step: '02',
                icon: UserCheck,
                title: 'Admin Verifies',
                titleBn: 'Admin যাচাই করেন',
                description: 'আমাদের admin team প্রতিটি শিক্ষকের পরিচয়, certificate ও academic background manually যাচাই করে। যাচাই হলে blue tick পাবেন।',
              },
              {
                step: '03',
                icon: Search,
                title: 'Get Matched',
                titleBn: 'শিক্ষক পান',
                description: 'আপনার প্রয়োজন অনুযায়ী verified শিক্ষকদের সাথে match করা হবে। Admin contact share করবেন এবং পড়ানো শুরু — শূন্য খরচে।',
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
                <div className="h-14 w-14 rounded-2xl gradient-primary text-white flex items-center justify-center mx-auto mb-5 shadow-md">
                  <item.icon className="h-7 w-7" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-1">{item.title}</h3>
                <p className="text-xs text-primary font-medium mb-2">{item.titleBn}</p>
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
              <div className="h-12 w-12 rounded-xl bg-primary/8 text-primary flex items-center justify-center mb-6">
                <Users className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">অভিভাবক ও শিক্ষার্থীদের জন্য</h3>
              <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                কোনো middleman-কে টাকা না দিয়ে সঠিক শিক্ষক খুঁজুন। শুধু আপনার প্রয়োজন জানান, 
                আমাদের verified শিক্ষকদের মধ্য থেকে admin match করে দেবেন।
              </p>
              <ul className="space-y-3">
                {[
                  'টিউশনের প্রয়োজন post করুন',
                  'Admin-verified শিক্ষক পান',
                  'Public tuition ads browse করুন',
                  'শিক্ষকদের review দিন',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-foreground">
                    <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                to={getCtaLink()}
                className="inline-flex items-center gap-2 mt-6 px-5 py-2.5 rounded-lg gradient-primary text-white text-sm font-semibold shadow-sm hover:shadow-md transition-all"
              >
                {userProfile ? 'Dashboard' : 'শিক্ষক খুঁজুন'}
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
              <div className="h-12 w-12 rounded-xl bg-accent/8 text-accent flex items-center justify-center mb-6">
                <BookOpen className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">শিক্ষকদের জন্য</h3>
              <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                Verified হন, আপনার reputation তৈরি করুন, এবং সত্যিকারের শিক্ষার্থীদের সাথে 
                connect হন। কোনো commission নেই — আপনি 100% রাখবেন।
              </p>
              <ul className="space-y-3">
                {[
                  'Admin-verified হয়ে blue tick পান',
                  'Open tuition requests browse করুন',
                  'Rating ও review তৈরি করুন',
                  'কোনো ফি বা commission নেই',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-foreground">
                    <CheckCircle2 className="h-4 w-4 text-accent shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                to={getCtaLink()}
                className="inline-flex items-center gap-2 mt-6 px-5 py-2.5 rounded-lg gradient-accent text-accent-foreground text-sm font-semibold shadow-sm hover:shadow-md transition-all"
              >
                {userProfile ? 'Dashboard' : 'শিক্ষক হিসেবে যোগ দিন'}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </motion.div>
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
