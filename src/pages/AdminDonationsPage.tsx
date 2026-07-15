// ============================================================
// Tewtorify — Admin Donation Ledger Page
// ============================================================

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart, Plus, Loader2, X, Calendar, DollarSign,
} from 'lucide-react';
import { useAuth } from '@/features/auth/AuthContext';
import { getAllDonations, createDonation } from '@/lib/firestore';
import { formatBDT, formatDate } from '@/lib/utils';
import { Timestamp } from 'firebase/firestore';
import type { Donation } from '@/types';

export default function AdminDonationsPage() {
  const { user } = useAuth();
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [addLoading, setAddLoading] = useState(false);
  const [form, setForm] = useState({ donorName: '', amount: '', date: '', note: '' });

  useEffect(() => {
    fetchDonations();
  }, []);

  const fetchDonations = async () => {
    try {
      const data = await getAllDonations();
      setDonations(data);
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    if (!user || !form.amount || !form.date) return;
    setAddLoading(true);
    try {
      await createDonation({
        donorName: form.donorName || 'Anonymous',
        amount: Number(form.amount),
        date: Timestamp.fromDate(new Date(form.date)),
        note: form.note || undefined,
        enteredBy: user.uid,
      });
      setShowAddModal(false);
      setForm({ donorName: '', amount: '', date: '', note: '' });
      await fetchDonations();
    } catch (err) {
      console.error('Error adding donation:', err);
    } finally {
      setAddLoading(false);
    }
  };

  const totalAmount = donations.reduce((sum, d) => sum + (d.amount || 0), 0);

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Donation Ledger</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Track platform donations • Total: <strong className="text-foreground">{formatBDT(totalAmount)}</strong>
              </p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg gradient-primary text-white text-sm font-semibold shadow-md"
            >
              <Plus className="h-4 w-4" />
              Add Donation
            </button>
          </div>
        </motion.div>

        {/* Donations List */}
        <div className="mt-8 space-y-3">
          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : donations.length === 0 ? (
            <div className="text-center py-20">
              <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-foreground font-medium">No donations recorded yet</p>
              <p className="text-sm text-muted-foreground mt-1">Add your first donation record</p>
            </div>
          ) : (
            donations.map((d, i) => (
              <motion.div
                key={d.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                className="flex items-center justify-between p-4 rounded-xl bg-card border border-border"
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-destructive/10 text-destructive flex items-center justify-center">
                    <Heart className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{d.donorName || 'Anonymous'}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{formatDate(d.date)}</span>
                      {d.note && <span>• {d.note}</span>}
                    </div>
                  </div>
                </div>
                <span className="text-lg font-bold text-foreground">{formatBDT(d.amount)}</span>
              </motion.div>
            ))
          )}
        </div>
      </div>

      {/* Add Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
            onClick={() => setShowAddModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md rounded-2xl bg-card border border-border shadow-2xl p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-foreground">Add Donation</h3>
                <button onClick={() => setShowAddModal(false)} className="p-1.5 rounded-lg hover:bg-muted">
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Donor Name</label>
                  <input
                    type="text"
                    placeholder="Leave empty for anonymous"
                    value={form.donorName}
                    onChange={(e) => setForm({ ...form, donorName: e.target.value })}
                    className="w-full h-11 px-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Amount (BDT) *</label>
                  <input
                    type="number"
                    min={1}
                    placeholder="e.g., 5000"
                    value={form.amount}
                    onChange={(e) => setForm({ ...form, amount: e.target.value })}
                    className="w-full h-11 px-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Date *</label>
                  <input
                    type="date"
                    value={form.date}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                    className="w-full h-11 px-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Note</label>
                  <input
                    type="text"
                    placeholder="Optional note"
                    value={form.note}
                    onChange={(e) => setForm({ ...form, note: e.target.value })}
                    className="w-full h-11 px-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-lg border border-border text-sm font-medium hover:bg-muted"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAdd}
                  disabled={addLoading || !form.amount || !form.date}
                  className="flex items-center gap-2 px-5 py-2 rounded-lg gradient-primary text-white text-sm font-semibold disabled:opacity-50"
                >
                  {addLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                  Add Donation
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
