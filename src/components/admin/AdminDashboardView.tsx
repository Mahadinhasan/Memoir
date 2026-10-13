import React, { useState } from 'react';
import { 
  ShieldAlert, 
  UserCheck, 
  UserX, 
  Key, 
  Copy, 
  Check, 
  Terminal, 
  AlertTriangle, 
  HardDrive,
  Lock,
  Layers,
  RefreshCw
} from 'lucide-react';
import { User, AuditLogItem } from '../../types';
import { MOCK_AUDIT_LOGS } from '../../data/mockData';

interface AdminDashboardViewProps {
  currentUser: User;
  friends: User[];
  onApproveMember?: (userId: string) => void;
  onRejectMember?: (userId: string) => void;
}

export const AdminDashboardView: React.FC<AdminDashboardViewProps> = ({
  currentUser,
  friends,
  onApproveMember,
  onRejectMember
}) => {
  const [copiedToken, setCopiedToken] = useState(false);
  const [inviteToken, setInviteToken] = useState('MEMOIR-INVITE-7X99-TOKEN-2026');
  const [userStatuses, setUserStatuses] = useState<Record<string, boolean>>({
    usr_elena: true,
    usr_julian: true,
    usr_aria: true,
    usr_mateo: true,
    usr_sophie: true,
  });

  const handleGenerateNewInvite = () => {
    const randomHex = Math.random().toString(36).substring(2, 8).toUpperCase();
    setInviteToken(`MEMOIR-INVITE-${randomHex}-SECURE-48H`);
    setCopiedToken(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(`https://memoir.circle/join?token=${inviteToken}`);
    setCopiedToken(true);
    setTimeout(() => setCopiedToken(false), 2500);
  };

  const toggleUserAccess = (id: string) => {
    setUserStatuses(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const pendingMembers = friends.filter(f => f.status === 'pending');

  return (
    <div className="space-y-8 animate-fadeIn pb-12 font-sans">
      {/* Brutalism Master Banner */}
      <div className="brutal-card p-6 bg-yellow-400 text-black border-4 border-black">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="brutal-tag bg-black text-yellow-300">
                STYLE 7: BRUTALISM
              </span>
              <span className="font-mono text-xs font-bold uppercase tracking-wider">
                [SECURITY LAYER 01 // ROOT_AUTH]
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight font-mono">
              ADMIN CONTROL & CIRCLE AUDIT
            </h1>
            <p className="text-xs sm:text-sm font-bold font-mono text-black/80 mt-1 max-w-2xl">
              Strict gatekeeping for private circle members. Zero public access, non-indexed storage endpoints, cryptographic invite tokens.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto">
            <span className="brutal-tag bg-white text-black text-xs font-bold">
              ROOT: {currentUser.username}
            </span>
            <span className="brutal-tag bg-emerald-300 text-black text-xs font-bold">
              SYSTEM ONLINE
            </span>
          </div>
        </div>
      </div>

      {/* Grid: 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Invite Generator & Pending Approvals (Col 1-7) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Cryptographic Invite Link Generator */}
          <div className="brutal-card p-5 bg-white">
            <div className="flex items-center justify-between pb-3 border-b-2 border-black">
              <div className="flex items-center gap-2 font-mono font-bold text-sm uppercase">
                <Key className="w-4 h-4 text-black" />
                <span>Single-Use Cryptographic Invite Token</span>
              </div>
              <span className="brutal-tag bg-yellow-200">
                TTL: 48 HOURS
              </span>
            </div>

            <div className="mt-4">
              <p className="text-xs font-mono text-black/80 mb-2">
                Share this private link with a trusted friend. Once redeemed, this token burns automatically.
              </p>

              <div className="p-3 bg-slate-100 border-2 border-black font-mono text-xs flex items-center justify-between gap-2 overflow-x-auto">
                <span className="font-bold text-black select-all truncate">
                  https://memoir.circle/join?token={inviteToken}
                </span>
                <button
                  onClick={handleCopy}
                  className="brutal-btn px-3 py-1 text-xs flex items-center gap-1 flex-shrink-0"
                >
                  {copiedToken ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedToken ? 'COPIED' : 'COPY'}</span>
                </button>
              </div>

              <div className="mt-3 flex justify-end">
                <button
                  onClick={handleGenerateNewInvite}
                  className="text-xs font-mono font-bold text-black hover:underline flex items-center gap-1"
                >
                  <RefreshCw className="w-3 h-3" />
                  Regenerate New Token
                </button>
              </div>
            </div>
          </div>

          {/* Pending Membership Verification */}
          <div className="brutal-card p-5 bg-white">
            <div className="flex items-center justify-between pb-3 border-b-2 border-black">
              <div className="flex items-center gap-2 font-mono font-bold text-sm uppercase">
                <UserCheck className="w-4 h-4 text-black" />
                <span>Pending Membership Requests ({pendingMembers.length})</span>
              </div>
              <span className="brutal-tag bg-amber-300">
                GATEWAY QUEUE
              </span>
            </div>

            <div className="mt-4 divide-y-2 divide-black">
              {pendingMembers.length === 0 ? (
                <div className="py-4 text-center font-mono text-xs text-black/60">
                  NO PENDING MEMBERSHIP REQUESTS AT THIS TIME.
                </div>
              ) : (
                pendingMembers.map((member) => (
                  <div key={member.id} className="py-3 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <img 
                        src={member.avatar} 
                        alt={member.name} 
                        className="w-10 h-10 border-2 border-black object-cover" 
                      />
                      <div>
                        <div className="font-mono font-bold text-sm text-black">
                          {member.name} (@{member.username})
                        </div>
                        <div className="text-[11px] font-mono text-black/70">
                          {member.bio}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => alert(`Approved ${member.name} into circle!`)}
                        className="brutal-btn bg-emerald-400 text-black px-3 py-1.5 text-xs flex items-center gap-1"
                      >
                        <UserCheck className="w-3.5 h-3.5" />
                        APPROVE
                      </button>
                      <button 
                        onClick={() => alert(`Rejected request from ${member.name}.`)}
                        className="brutal-btn bg-rose-400 text-black px-3 py-1.5 text-xs flex items-center gap-1"
                      >
                        <UserX className="w-3.5 h-3.5" />
                        REJECT
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Active Members & Neomorphic Access Revocation Toggles */}
          <div className="brutal-card p-5 bg-white">
            <div className="flex items-center justify-between pb-3 border-b-2 border-black">
              <div className="flex items-center gap-2 font-mono font-bold text-sm uppercase">
                <Lock className="w-4 h-4 text-black" />
                <span>Access Suspension Controls (Neomorphic Switches)</span>
              </div>
            </div>

            <div className="mt-4 space-y-2.5">
              {friends.filter(f => f.status === 'approved').map((f) => {
                const isActive = userStatuses[f.id] ?? true;

                return (
                  <div key={f.id} className="p-3 border-2 border-black flex items-center justify-between bg-slate-50">
                    <div className="flex items-center gap-2.5">
                      <img src={f.avatar} alt={f.name} className="w-8 h-8 border border-black object-cover" />
                      <div>
                        <span className="font-mono font-bold text-xs block text-black">{f.name}</span>
                        <span className="text-[10px] font-mono text-black/60">Role: {f.role}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className={`text-[10px] font-mono font-bold px-2 py-0.5 border border-black ${
                        isActive ? 'bg-emerald-300 text-black' : 'bg-rose-300 text-black'
                      }`}>
                        {isActive ? 'ACCESS: ACTIVE' : 'ACCESS: SUSPENDED'}
                      </span>

                      {/* Tactile Neomorphic Toggle Switch */}
                      <button
                        type="button"
                        onClick={() => toggleUserAccess(f.id)}
                        className={`w-12 h-6 rounded-full transition-colors relative p-0.5 border border-black ${
                          isActive ? 'bg-black' : 'bg-slate-300'
                        }`}
                      >
                        <div className={`w-4 h-4 rounded-full bg-yellow-400 transition-transform ${
                          isActive ? 'translate-x-6' : 'translate-x-0'
                        }`} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Immutable Security Audit Log (Col 8-12) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="brutal-card p-5 bg-black text-white border-4 border-black">
            <div className="flex items-center justify-between pb-3 border-b-2 border-white/20">
              <div className="flex items-center gap-2 font-mono font-bold text-xs uppercase text-yellow-300">
                <Terminal className="w-4 h-4" />
                <span>Security Audit Log Trail</span>
              </div>
              <span className="font-mono text-[10px] text-emerald-400 animate-pulse">
                ● LIVE
              </span>
            </div>

            <div className="mt-4 space-y-3 font-mono text-xs max-h-[580px] overflow-y-auto pr-1">
              {MOCK_AUDIT_LOGS.map((log) => (
                <div key={log.id} className="p-3 bg-zinc-900 border border-zinc-700 space-y-1">
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-yellow-400 font-bold">{log.action}</span>
                    <span className="text-zinc-400">{log.timestamp}</span>
                  </div>
                  <div className="text-zinc-200 text-xs">
                    Target: <strong className="text-white">{log.targetUser}</strong>
                  </div>
                  <p className="text-[11px] text-zinc-400 leading-snug">
                    {log.details}
                  </p>
                  <div className="pt-1 flex items-center justify-between text-[10px]">
                    <span className="text-zinc-500">By {log.admin}</span>
                    <span className={`px-1.5 py-0.2 rounded font-bold ${
                      log.status === 'APPROVED' ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/30' : 'bg-rose-950 text-rose-300 border border-rose-500/30'
                    }`}>
                      {log.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-3 border-t border-zinc-800 text-[10px] font-mono text-zinc-400 flex items-center justify-between">
              <span>SHA-256 Checksums: VERIFIED</span>
              <span>Total Audit Entries: 42</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
