// ============================================================
// Tewtorify — Landing Page (Minimalist B&W)
// ============================================================

import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Shield, Heart, Users, BookOpen,
  ArrowRight, CheckCircle2, UserCheck, ClipboardCheck,
  Search, BadgeCheck,
} from 'lucide-react';

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
            Find the perfect <br/>
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

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row w-full max-w-[400px] sm:max-w-none justify-center items-center gap-4 relative"
          >
            <DoodleArrow />
            <Link
              to="/signup"
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-dark text-canvas font-semibold shadow-xl transition-all hover:scale-105 active:scale-95 text-[16px]"
            >
              Get Started
            </Link>
            <Link
              to="/donate"
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-transparent border-2 border-border-subtle text-dark font-semibold transition-all hover:border-dark text-[16px]"
            >
              Support Us
            </Link>
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

      {/* ============ FOR TUTORS / FOR GUARDIANS ============ */}
      <section className="py-24 bg-surface border-t border-border-subtle">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* For Guardians */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              custom={0}
              className="p-10 lg:p-14 rounded-[32px] bg-canvas border border-border-subtle flex flex-col items-start"
            >
              <div className="h-16 w-16 rounded-full bg-surface border border-border-subtle text-dark flex items-center justify-center mb-8">
                <Users className="h-8 w-8" strokeWidth={1.5} />
              </div>
              <h3 className="text-[32px] font-bold text-heading mb-4">For Guardians</h3>
              <p className="text-[16px] text-body mb-8 leading-relaxed max-w-md">
                Find the right tutor without paying middlemen. Post your needs and let admins match you with verified teachers.
              </p>
              <ul className="space-y-4 mb-10 mt-auto w-full">
                {['Post tuition requirements', 'Get verified tutors', 'Browse public ads', 'Leave reviews'].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-[15px] font-medium text-heading">
                    <CheckCircle2 className="h-5 w-5 text-dark shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                to="/signup"
                className="w-full text-center px-6 py-4 rounded-full bg-dark text-canvas font-semibold transition-transform hover:scale-105"
              >
                Find a Tutor
              </Link>
            </motion.div>

            {/* For Tutors */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              custom={1}
              className="p-10 lg:p-14 rounded-[32px] bg-dark text-canvas flex flex-col items-start relative overflow-hidden"
            >
              {/* Dark doodle */}
              <svg width="300" height="300" viewBox="0 0 100 100" fill="none" className="absolute -right-20 -bottom-20 text-canvas opacity-10" stroke="currentColor" strokeWidth="2">
                <path d="M 10 50 Q 50 10 90 50 T 170 50" />
                <path d="M 10 60 Q 50 20 90 60 T 170 60" />
                <path d="M 10 70 Q 50 30 90 70 T 170 70" />
              </svg>

              <div className="relative z-10 h-16 w-16 rounded-full bg-canvas/10 text-canvas flex items-center justify-center mb-8">
                <BookOpen className="h-8 w-8" strokeWidth={1.5} />
              </div>
              <h3 className="relative z-10 text-[32px] font-bold mb-4 text-canvas">For Tutors</h3>
              <p className="relative z-10 text-[16px] text-canvas/80 mb-8 leading-relaxed max-w-md">
                Get verified, build your reputation, and connect with real students. You keep 100% of your earnings.
              </p>
              <ul className="relative z-10 space-y-4 mb-10 mt-auto w-full">
                {['Get verified blue tick', 'Browse open requests', 'Build your rating', 'Zero commissions'].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-[15px] font-medium">
                    <CheckCircle2 className="h-5 w-5 text-canvas shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                to="/signup"
                className="relative z-10 w-full text-center px-6 py-4 rounded-full bg-canvas text-dark font-semibold transition-transform hover:scale-105"
              >
                Join as Tutor
              </Link>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
