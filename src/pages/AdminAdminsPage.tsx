// ============================================================
// Tewtorify — Admin Manage Admins Page
// ============================================================

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users, ShieldCheck, Plus, Trash2, Loader2, X,
  Search, AlertTriangle, Crown,
} from 'lucide-react';
import { useAuth } from '@/features/auth/AuthContext';
import {
  getAllAdmins,
  getAllUsers,
  promoteToAdmin,
  demoteAdmin,
  getAdminRecord,
} from '@/lib/firestore';
import { timeAgo } from '@/lib/utils';
import type { AdminRecord, User } from '@/types';

export default function AdminAdminsPage() {
  const { user } = useAuth();
  const [admins, setAdmins] = useState<(AdminRecord & { name?: string; email?: string })[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [currentAdminRole, setCurrentAdminRole] = useState<string>('admin');

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    setLoading(true);
    try {
      const [adminRecords, users] = await Promise.all([
        getAllAdmins(),
        getAllUsers(),
      ]);

      // Merge admin records with user names
      const adminsWithNames = adminRecords.map((admin) => {
        const userData = users.find((u) => u.uid === admin.uid);
        return {
          ...admin,
          name: userData?.name || 'Unknown',
          email: userData?.email || 'N/A',
        };
      });

      setAdmins(adminsWithNames);
      setAllUsers(users);

      // Get current user's admin role
      if (user) {
        const myRecord = await getAdminRecord(user.uid);
        if (myRecord) setCurrentAdminRole(myRecord.role);
      }
    } catch (err) {
      console.error('Error fetching admins:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePromote = async (uid: string) => {
    if (!user) return;
    setActionLoading(uid);
    try {
      await promoteToAdmin(uid, user.uid);
      setShowAddModal(false);
      setSearchQuery('');
      await fetchAdmins();
    } catch (err) {
      console.error('Error promoting admin:', err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleDemote = async (uid: string) => {
    if (!user || uid === user.uid) return;
    setActionLoading(uid);
    try {
      await demoteAdmin(uid);
      await fetchAdmins();
    } catch (err) {
      console.error('Error demoting admin:', err);
    } finally {
      setActionLoading(null);
    }
  };

  // Filter non-admin users for the add modal
  const promotableUsers = allUsers.filter(
    (u) =>
      !admins.some((a) => a.uid === u.uid) &&
      (searchQuery
        ? u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          u.email.toLowerCase().includes(searchQuery.toLowerCase())
        : true)
  );

  const isSuperAdmin = currentAdminRole === 'super_admin';

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Manage Admins</h1>
              <p className="text-sm text-muted-foreground mt-1">
                {isSuperAdmin
                  ? 'Add or remove platform administrators'
                  : 'View platform administrators (super_admin required to modify)'}
              </p>
            </div>
            {isSuperAdmin && (
              <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg gradient-primary text-white text-sm font-semibold shadow-md hover:shadow-lg transition-all"
              >
                <Plus className="h-4 w-4" />
                Add Admin
              </button>
            )}
          </div>
        </motion.div>

        {/* Admin List */}
        <div className="mt-8 space-y-3">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : admins.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-muted-foreground">No admins configured yet.</p>
            </div>
          ) : (
            admins.map((admin, i) => (
              <motion.div
                key={admin.uid}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center justify-between p-4 rounded-xl bg-card border border-border"
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full gradient-primary flex items-center justify-center text-white font-semibold text-sm">
                    {admin.name?.[0]?.toUpperCase() || 'A'}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-foreground">{admin.name}</span>
                      {admin.role === 'super_admin' && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 text-xs font-medium">
                          <Crown className="h-3 w-3" />
                          Super Admin
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">{admin.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground hidden sm:block">
                    Added {timeAgo(admin.promotedAt)}
                  </span>
                  {isSuperAdmin && admin.uid !== user?.uid && admin.role !== 'super_admin' && (
                    <button
                      onClick={() => handleDemote(admin.uid)}
                      disabled={actionLoading === admin.uid}
                      className="p-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                    >
                      {actionLoading === admin.uid ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </button>
                  )}
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>

      {/* Add Admin Modal */}
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
              className="w-full max-w-md rounded-2xl bg-card border border-border shadow-2xl p-6 max-h-[80vh] flex flex-col"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-foreground">Add Admin</h3>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="p-1.5 rounded-lg hover:bg-muted transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search by name or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-10 pl-9 pr-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              <div className="flex-1 overflow-y-auto space-y-2">
                {promotableUsers.length === 0 ? (
                  <p className="text-center text-sm text-muted-foreground py-8">
                    No users found
                  </p>
                ) : (
                  promotableUsers.slice(0, 20).map((u) => (
                    <div
                      key={u.uid}
                      className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                    >
                      <div>
                        <p className="text-sm font-medium text-foreground">{u.name}</p>
                        <p className="text-xs text-muted-foreground">{u.email} • {u.role}</p>
                      </div>
                      <button
                        onClick={() => handlePromote(u.uid)}
                        disabled={actionLoading === u.uid}
                        className="px-3 py-1.5 rounded-lg gradient-primary text-white text-xs font-semibold disabled:opacity-50"
                      >
                        {actionLoading === u.uid ? (
                          <Loader2 className="h-3 w-3 animate-spin" />
                        ) : (
                          'Promote'
                        )}
                      </button>
                    </div>
                  ))
                )}
              </div>

              <div className="mt-4 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs text-amber-600">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="h-3.5 w-3.5 mt-0.5 shrink-0" />
                  <span>Promoting a user gives them full admin access to verify tutors, manage matches, and view all data.</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
