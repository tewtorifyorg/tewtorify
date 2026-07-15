// ============================================================
// Tewtorify — Donate Page
// ============================================================

import { motion } from 'framer-motion';
import { Heart, Copy, CheckCircle2, Phone, CreditCard, Building2 } from 'lucide-react';
import { useState } from 'react';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.5 },
  }),
};

const paymentMethods = [
  {
    name: 'bKash',
    number: '01XXXXXXXXX',
    type: 'Personal',
    icon: Phone,
    color: 'bg-pink-500/10 text-pink-600',
    instructions: 'Send Money → Personal → Enter Number → Amount → Reference: "Tewtorify"',
  },
  {
    name: 'Nagad',
    number: '01XXXXXXXXX',
    type: 'Personal',
    icon: Phone,
    color: 'bg-orange-500/10 text-orange-600',
    instructions: 'Send Money → Enter Number → Amount → Reference: "Tewtorify"',
  },
  {
    name: 'Rocket',
    number: '01XXXXXXXXX-1',
    type: 'Personal',
    icon: CreditCard,
    color: 'bg-purple-500/10 text-purple-600',
    instructions: 'Send Money → Enter Number → Amount → Reference: "Tewtorify"',
  },
];

export default function DonatePage() {
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const handleCopy = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        {/* Hero */}
        <motion.div
          initial="hidden"
          animate="visible"
          className="text-center mb-12"
        >
          <motion.div
            variants={fadeUp}
            custom={0}
            className="h-16 w-16 rounded-2xl gradient-primary text-white flex items-center justify-center mx-auto mb-6 shadow-lg"
          >
            <Heart className="h-8 w-8" />
          </motion.div>
          <motion.h1
            variants={fadeUp}
            custom={1}
            className="text-3xl sm:text-4xl font-bold text-foreground"
          >
            Support Tewtorify
          </motion.h1>
          <motion.p
            variants={fadeUp}
            custom={2}
            className="mt-4 text-muted-foreground leading-relaxed max-w-xl mx-auto"
          >
            Tewtorify is 100% free for everyone — no registration fees, no commissions.
            Your donation helps us maintain the platform, verify tutors, and expand to more districts.
          </motion.p>
        </motion.div>

        {/* Impact */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-3 gap-4 mb-10"
        >
          {[
            { amount: '৳500', impact: 'Covers server costs for 1 month' },
            { amount: '৳1,000', impact: 'Supports 10 tutor verifications' },
            { amount: '৳5,000', impact: 'Keeps the platform running for 3 months' },
          ].map((item) => (
            <div key={item.amount} className="text-center p-4 rounded-xl bg-card border border-border">
              <p className="text-xl font-bold text-primary">{item.amount}</p>
              <p className="text-xs text-muted-foreground mt-1">{item.impact}</p>
            </div>
          ))}
        </motion.div>

        {/* Payment Methods */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-xl font-bold text-foreground mb-6 text-center">
            How to Donate
          </h2>
          <div className="space-y-4">
            {paymentMethods.map((method, i) => (
              <motion.div
                key={method.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + i * 0.1 }}
                className="rounded-xl bg-card border border-border p-5"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`h-10 w-10 rounded-lg ${method.color} flex items-center justify-center`}>
                      <method.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{method.name}</h3>
                      <p className="text-xs text-muted-foreground">{method.type} Number</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleCopy(method.number, i)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-muted hover:bg-muted/80 text-sm transition-colors"
                  >
                    {copiedIdx === i ? (
                      <>
                        <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
                        <span className="text-green-600 font-medium">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5 text-muted-foreground" />
                        <span className="text-foreground font-medium">{method.number}</span>
                      </>
                    )}
                  </button>
                </div>
                <p className="text-xs text-muted-foreground bg-muted/50 p-2.5 rounded-lg">
                  {method.instructions}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-10 p-5 rounded-xl bg-primary/5 border border-primary/10 text-center"
        >
          <p className="text-sm text-muted-foreground">
            After donating, you can optionally inform us via{' '}
            <a
              href="https://facebook.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline font-medium"
            >
              our Facebook page
            </a>{' '}
            so we can add your name to our donors list (or keep it anonymous).
          </p>
          <p className="text-sm font-medium text-foreground mt-2">
            Every taka counts. Thank you for supporting education in Pabna! 💚
          </p>
        </motion.div>
      </div>
    </div>
  );
}
