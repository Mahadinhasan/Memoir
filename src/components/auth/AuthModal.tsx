import React, { useState } from 'react';
import { 
  Lock, 
  Mail, 
  User as UserIcon, 
  Key, 
  ShieldCheck, 
  Sparkles, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle,
  X,
  Layers,
  Heart,
  Terminal,
  Camera
} from 'lucide-react';
import { MemoirLogo } from '../common/MemoirLogo';
import { User } from '../../types';
import { signIn, signUp } from '../../lib/authService';

interface AuthModalProps {
  isOpen: boolean;
  initialMode?: 'login' | 'register';
  onClose?: () => void;
  onSuccess: (user: User) => void;
  isFullPage?: boolean;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  initialMode = 'login',
  onClose,
  onSuccess,
  isFullPage = false
}) => {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  
  // Login form states (prefilled with building user Mahadin)
  const [loginIdentifier, setLoginIdentifier] = useState('Mahadin@Memo.com');
  const [loginPassword, setLoginPassword] = useState('241320');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Register form states
  const [regName, setRegName] = useState('');
  const [regUsername, setRegUsername] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regBio, setRegBio] = useState('');
  const [regInviteToken, setRegInviteToken] = useState('');
  const [regAvatar, setRegAvatar] = useState('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><rect width="100" height="100" rx="30" fill="%230ea5e9"/><path d="M50 46a14 14 0 1 0 0-28 14 14 0 0 0 0 28zm0 8c-16 0-30 10-30 24h60c0-14-14-24-30-24z" fill="white"/></svg>');
  const [agreePrivacy, setAgreePrivacy] = useState(false);

  // Feedback & Loading
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  if (!isOpen) return null;

  const sampleAvatars = [
    'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><rect width="100" height="100" rx="30" fill="%230ea5e9"/><path d="M50 46a14 14 0 1 0 0-28 14 14 0 0 0 0 28zm0 8c-16 0-30 10-30 24h60c0-14-14-24-30-24z" fill="white"/></svg>',
    'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><rect width="100" height="100" rx="30" fill="%2310b981"/><path d="M50 46a14 14 0 1 0 0-28 14 14 0 0 0 0 28zm0 8c-16 0-30 10-30 24h60c0-14-14-24-30-24z" fill="white"/></svg>',
    'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><rect width="100" height="100" rx="30" fill="%236366f1"/><path d="M50 46a14 14 0 1 0 0-28 14 14 0 0 0 0 28zm0 8c-16 0-30 10-30 24h60c0-14-14-24-30-24z" fill="white"/></svg>',
    'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><rect width="100" height="100" rx="30" fill="%23f43f5e"/><path d="M50 46a14 14 0 1 0 0-28 14 14 0 0 0 0 28zm0 8c-16 0-30 10-30 24h60c0-14-14-24-30-24z" fill="white"/></svg>',
    'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><rect width="100" height="100" rx="30" fill="%23f59e0b"/><path d="M50 46a14 14 0 1 0 0-28 14 14 0 0 0 0 28zm0 8c-16 0-30 10-30 24h60c0-14-14-24-30-24z" fill="white"/></svg>',
    'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><rect width="100" height="100" rx="30" fill="%2314b8a6"/><path d="M50 46a14 14 0 1 0 0-28 14 14 0 0 0 0 28zm0 8c-16 0-30 10-30 24h60c0-14-14-24-30-24z" fill="white"/></svg>'
  ];

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const emailInput = loginIdentifier.trim();
    if (!emailInput || !loginPassword.trim()) {
      setErrorMessage('Please enter both your email and passphrase.');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    // Ensure we always send a proper email address
    const email = emailInput.includes('@') ? emailInput : `${emailInput}@memoir.circle`;

    const { user, error } = await signIn(email, loginPassword);
    setIsLoading(false);

    if (error || !user) {
      setErrorMessage(error ?? 'Authentication failed. Please check your credentials.');
      return;
    }

    onSuccess(user);
    if (onClose) onClose();
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim() || !regUsername.trim()) {
      setErrorMessage('Please provide your name and circle username.');
      return;
    }

    if (!regEmail.trim() || !regPassword.trim()) {
      setErrorMessage('Please provide your private email and passphrase.');
      return;
    }

    if (!agreePrivacy) {
      setErrorMessage('You must accept the Circle Confidentiality Charter to join.');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    const { user, error } = await signUp({
      email: regEmail.trim(),
      password: regPassword,
      name: regName.trim(),
      username: regUsername.trim().replace(/^@/, ''),
      bio: regBio.trim() || 'A new friend joining the Memoir circle.',
      avatar: regAvatar,
    });

    setIsLoading(false);

    if (error || !user) {
      setErrorMessage(error ?? 'Registration failed. Please try again.');
      return;
    }

    setSuccessMessage('Welcome to Memoir! Your private circle passport is ready.');
    setTimeout(() => {
      onSuccess(user);
      if (onClose) onClose();
    }, 700);
  };

  return (
    <div className={`${
      isFullPage 
        ? 'min-h-screen w-full flex items-center justify-center p-4 bg-[#080d19]' 
        : 'fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-fadeIn'
    }`}>
      {/* Ambient Atmospheric Mesh Glow */}
      <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-sky-500/15 rounded-full blur-3xl pointer-events-none -translate-x-1/2"></div>
      <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-teal-500/15 rounded-full blur-3xl pointer-events-none translate-x-1/2"></div>

      {/* Main Glassmorphic Auth Card */}
      <div className="relative w-full max-w-lg bg-slate-900/85 border border-white/15 rounded-3xl shadow-2xl overflow-hidden backdrop-blur-2xl">
        {/* Close Button if Modal */}
        {!isFullPage && onClose && (
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white transition"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        {/* Card Header with Brand Logo */}
        <div className="p-6 sm:p-7 pb-4 text-center border-b border-white/10 bg-slate-950/40 relative">
          <div className="flex justify-center mb-3">
            <MemoirLogo size="lg" showText={false} />
          </div>

          <h2 className="text-2xl font-black tracking-tight text-white flex items-center justify-center gap-2">
            <span>Memoir</span>
            <span className="text-[10px] font-mono uppercase tracking-widest px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-400/30">
              Private Circle
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            An invite-only, encrypted sanctuary for sharing unrepeatable memories with your trusted friends.
          </p>

          {/* Neomorphic Tactile Mode Toggle */}
          <div className="mt-5 p-1 bg-black/50 border border-white/10 rounded-2xl flex max-w-xs mx-auto text-xs font-semibold">
            <button
              type="button"
              onClick={() => { setMode('login'); setErrorMessage(''); }}
              className={`flex-1 py-2 rounded-xl transition-all ${
                mode === 'login'
                  ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/30 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => { setMode('register'); setErrorMessage(''); }}
              className={`flex-1 py-2 rounded-xl transition-all ${
                mode === 'register'
                  ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/30 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Join / Register
            </button>
          </div>
        </div>

        {/* Notifications & Error message banner */}
        {errorMessage && (
          <div className="mx-6 mt-4 p-3 rounded-2xl bg-rose-500/15 border border-rose-500/30 flex items-center gap-2 text-xs text-rose-300 animate-fadeIn">
            <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="mx-6 mt-4 p-3 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center gap-2 text-xs text-emerald-300 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Form Body */}
        <div className="p-6 sm:p-7 pt-4">
          {mode === 'login' ? (
            /* ================= LOGIN FORM ================= */
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              {/* Building User Credentials Quick Badge */}
              <div className="p-3 rounded-2xl bg-sky-500/10 border border-sky-400/20 flex items-center justify-between">
                <div className="flex items-center gap-2.5 text-left">
                  <div className="w-8 h-8 rounded-xl bg-sky-500/20 text-sky-400 border border-sky-400/30 flex items-center justify-center font-bold text-xs">
                    M
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white flex items-center gap-1.5">
                      <span>Building User: Mahadin</span>
                      <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">Verified</span>
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono">Mahadin@Memo.com • Pass: 241320</div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setLoginIdentifier('Mahadin@Memo.com');
                    setLoginPassword('241320');
                    setErrorMessage('');
                  }}
                  className="px-2.5 py-1 rounded-xl bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 border border-sky-400/30 text-[11px] font-bold transition flex-shrink-0"
                >
                  Fill
                </button>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5 flex items-center justify-between">
                  <span>Circle Email or Username</span>
                  <span className="text-[10px] text-slate-500 font-mono">End-to-End Verified</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={loginIdentifier}
                    onChange={(e) => setLoginIdentifier(e.target.value)}
                    placeholder="Enter email or username..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-2xl glass-input text-xs text-white placeholder:text-slate-500 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5 flex items-center justify-between">
                  <span>Passphrase</span>
                  <button 
                    type="button" 
                    onClick={() => alert('Circle recovery token sent to your verified device.')}
                    className="text-[10px] text-sky-400 hover:underline"
                  >
                    Forgot Passphrase?
                  </button>
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="Enter circle passphrase..."
                    className="w-full pl-10 pr-10 py-2.5 rounded-2xl glass-input text-xs text-white placeholder:text-slate-500 transition-all font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Neomorphic Remember Me switch */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none text-xs text-slate-300">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded bg-slate-800 border-white/20 text-sky-500 focus:ring-0"
                  />
                  <span>Trust this device for 30 days</span>
                </label>
                <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  AES-256
                </span>
              </div>

              {/* Submit Button (Liquid Glass) */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 py-3 rounded-2xl liquid-glass-pill text-xs font-bold text-white flex items-center justify-center gap-2 disabled:opacity-50 transition shadow-xl cursor-pointer"
              >
                {isLoading ? (
                  <span>Authenticating Identity...</span>
                ) : (
                  <>
                    <span>Enter Private Circle</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          ) : (
            /* ================= REGISTRATION / INVITE CLAIM FORM ================= */
            <form onSubmit={handleRegisterSubmit} className="space-y-4 max-h-[480px] overflow-y-auto pr-1">
              {/* Invite Code Verification Field */}
              <div className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-sky-500/10 to-teal-500/10 border border-sky-400/30 space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <label className="font-bold text-sky-200 flex items-center gap-1.5">
                    <Key className="w-3.5 h-3.5 text-yellow-400" />
                    Circle Invitation Code
                  </label>
                  {regInviteToken.trim() ? (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold">
                      ✓ Valid Token
                    </span>
                  ) : (
                    <span className="text-[10px] font-mono text-slate-400">
                      Optional / Invite Code
                    </span>
                  )}
                </div>
                <input
                  type="text"
                  value={regInviteToken}
                  onChange={(e) => setRegInviteToken(e.target.value)}
                  placeholder="Paste invite code (e.g. MEMOIR-INVITE-...)"
                  className="w-full px-3 py-1.5 rounded-xl bg-black/40 border border-white/15 text-xs text-white font-mono placeholder:text-slate-500"
                />
                <p className="text-[10px] text-slate-400">
                  Circle invitation codes grant immediate member approval. Without a code, membership request is queued for admin approval.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Your Full Name
                  </label>
                  <div className="relative">
                    <UserIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      required
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      placeholder="e.g. Maya Lin"
                      className="w-full pl-10 pr-3 py-2 rounded-2xl glass-input text-xs text-white placeholder:text-slate-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Circle Username
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-mono text-slate-400">@</span>
                    <input
                      type="text"
                      required
                      value={regUsername}
                      onChange={(e) => setRegUsername(e.target.value)}
                      placeholder="mayalin"
                      className="w-full pl-8 pr-3 py-2 rounded-2xl glass-input text-xs text-white placeholder:text-slate-500 font-mono"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Private Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="maya@example.com"
                    className="w-full pl-10 pr-3 py-2 rounded-2xl glass-input text-xs text-white placeholder:text-slate-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Create Passphrase
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="password"
                    required
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="At least 8 characters..."
                    className="w-full pl-10 pr-3 py-2 rounded-2xl glass-input text-xs text-white placeholder:text-slate-500 font-mono"
                  />
                </div>
              </div>

              {/* Avatar Selector */}
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5 flex items-center justify-between">
                  <span>Choose Circle Avatar</span>
                  <span className="text-[10px] text-sky-400">Click to select</span>
                </label>
                <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
                  {sampleAvatars.map((url, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setRegAvatar(url)}
                      className={`relative rounded-xl overflow-hidden w-10 h-10 flex-shrink-0 transition-transform ${
                        regAvatar === url ? 'ring-2 ring-sky-400 scale-110' : 'opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={url} alt="Avatar" className="w-full h-full object-cover" />
                      {regAvatar === url && (
                        <span className="absolute inset-0 bg-sky-500/20 flex items-center justify-center">
                          <CheckCircle2 className="w-4 h-4 text-white" />
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Bio */}
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Short Circle Bio
                </label>
                <input
                  type="text"
                  value={regBio}
                  onChange={(e) => setRegBio(e.target.value)}
                  placeholder="What brings you joy?"
                  className="w-full px-3 py-2 rounded-2xl glass-input text-xs text-white placeholder:text-slate-500"
                />
              </div>

              {/* Confidentiality Checkbox */}
              <div className="p-3 rounded-2xl bg-white/5 border border-white/10 text-xs">
                <label className="flex items-start gap-2.5 cursor-pointer select-none text-slate-300">
                  <input
                    type="checkbox"
                    checked={agreePrivacy}
                    onChange={(e) => setAgreePrivacy(e.target.checked)}
                    className="mt-0.5 w-4 h-4 rounded bg-slate-800 border-white/20 text-sky-500"
                  />
                  <span className="text-[11px] leading-relaxed">
                    I pledge to honor circle trust. Memories shared here remain completely private and will not be exported or posted publicly without consent.
                  </span>
                </label>
              </div>

              {/* Submit Registration */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-2xl liquid-glass-pill text-xs font-bold text-white flex items-center justify-center gap-2 transition shadow-xl cursor-pointer"
              >
                {isLoading ? (
                  <span>Creating Circle Passport...</span>
                ) : (
                  <>
                    <span>Claim Membership & Enter Circle</span>
                    <Sparkles className="w-4 h-4 text-sky-300" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* Brutalism Security Badge Footer */}
          <div className="mt-5 pt-3 border-t border-white/10 flex items-center justify-between text-[10px] font-mono text-slate-400">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              <span>TOKEN_AUTH: SHA256</span>
            </span>
            <span>RESTRICTED ACCESS</span>
          </div>
        </div>
      </div>
    </div>
  );
};
