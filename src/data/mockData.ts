import { User, Post, MemoryItem, NotificationItem, AuditLogItem, UIStyleInfo } from '../types';

export const UI_STYLES: UIStyleInfo[] = [
  {
    id: 'skeuomorphism',
    name: 'Skeuomorphism',
    role: 'Physical Memory Elements',
    appliedTo: 'Polaroid cards, washi tape, paper texture, realistic drop shadows, nostalgic scrapbook detail view',
    badgeColor: 'bg-amber-100 text-amber-900 border-amber-300',
    description: 'Realistic textures, tactile washi tapes, and deep physical drop shadows honoring tangible printed memories without cluttering the app.'
  },
  {
    id: 'neomorphism',
    name: 'Neomorphism',
    role: 'Soft Interactive Controls',
    appliedTo: 'Secondary action buttons, tactile filter pills, audio/privacy toggles, modal switches',
    badgeColor: 'bg-slate-700 text-slate-200 border-slate-600',
    description: 'Soft extruded and inset shadows creating tactile, pressable switches with high contrast accessibility.'
  },
  {
    id: 'glassmorphism',
    name: 'Glassmorphism',
    role: 'Floating Translucent Panels',
    appliedTo: 'Header navigation, notification popover, comment drawer, contextual menus',
    badgeColor: 'bg-sky-500/20 text-sky-200 border-sky-400/30',
    description: 'Frosted surfaces, multi-stage backdrop blur, crisp specular borders layered gracefully above photo content.'
  },
  {
    id: 'claymorphism',
    name: 'Claymorphism',
    role: 'Friendly Social Elements',
    appliedTo: 'Reaction emoji badges, upload illustrations, empty states, friendly circle status badges',
    badgeColor: 'bg-indigo-500/20 text-indigo-200 border-indigo-400/40',
    description: 'Inflated 3D rounded forms with inner glows and pillowy depth bringing playful delight to social moments.'
  },
  {
    id: 'minimalism',
    name: 'Minimalism',
    role: 'Main Social Feed Foundation',
    appliedTo: 'Primary feed layout, clean typography, whitespace, captions, post headers, metadata',
    badgeColor: 'bg-zinc-800 text-zinc-200 border-zinc-700',
    description: 'Spacious, distraction-free foundation that puts high-resolution photography and genuine storytelling at center stage.'
  },
  {
    id: 'maximalism',
    name: 'Maximalism',
    role: 'Featured Celebratory Memories',
    appliedTo: 'Birthday milestones, roadtrip banners, party celebration confetti, bold typography & stickers',
    badgeColor: 'bg-fuchsia-500/20 text-fuchsia-200 border-fuchsia-400/40',
    description: 'Vibrant neon gradients, expressive display fonts, retro stickers, and celebratory fanfare for milestone events.'
  },
  {
    id: 'brutalism',
    name: 'Brutalism',
    role: 'Bold Administrative Areas',
    appliedTo: 'Admin security dashboard, invite link generator, membership audit logs, access revocation controls',
    badgeColor: 'bg-yellow-400 text-black border-black font-mono',
    description: 'High-contrast 3px solid black outlines, hard offset drop shadows, and stark monospace tags emphasizing administrative authority.'
  },
  {
    id: 'liquid-glass',
    name: 'Liquid Glass',
    role: 'Premium Floating Interactions',
    appliedTo: 'Floating upload action button, mobile navigation dock, fluid photo viewer controls',
    badgeColor: 'bg-cyan-500/20 text-cyan-200 border-cyan-400/40',
    description: 'Fluid optical refraction, dynamic specular highlights, and organic rounded curves with spring animations.'
  },
  {
    id: 'bento-grid',
    name: 'Bento Grid',
    role: 'Dashboard Highlights',
    appliedTo: 'Dashboard overview cards, storage radar, circle activity metrics, on-this-day cards',
    badgeColor: 'bg-emerald-500/20 text-emerald-200 border-emerald-400/40',
    description: 'Asymmetric yet harmonious modular cards grouping secondary statistics and personal highlights seamlessly.'
  },
  {
    id: 'spatial-ui',
    name: 'Spatial UI',
    role: 'Immersive Memory Experience',
    appliedTo: 'Interactive 3D depth photo viewer, gyroscope/mouse tilt parallax cards, layered Z-axis HUD',
    badgeColor: 'bg-purple-500/20 text-purple-200 border-purple-400/40',
    description: 'True 3D perspective layers where foreground cards, photography, and floating controls exist on separate Z-planes.'
  }
];

// Current user — Building user Mahadin
export const CURRENT_USER: User = {
  id: '591859a2-7629-4fae-85fc-7eb82698b224',
  name: 'Mahadin',
  username: 'mahadin',
  avatar: 'https://ui-avatars.com/api/?name=Mahadin&background=0f172a&color=60a5fa&size=128&bold=true',
  role: 'admin',
  status: 'approved',
  bio: 'Circle founder & administrator. Preserving real moments.',
  mutualCount: 0,
  joinedDate: 'October 2026',
  memoriesCount: 0
};

export const MOCK_FRIENDS: User[] = [];

// Empty feed — no gallery images
export const MOCK_POSTS: Post[] = [];

// Empty memories
export const MOCK_MEMORIES: MemoryItem[] = [];

export const MOCK_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif_01',
    type: 'memory',
    user: CURRENT_USER,
    message: 'Welcome to Memoir! Upload your first photos to start building your private circle vault.',
    timeAgo: 'Just now',
    read: false
  }
];

export const MOCK_AUDIT_LOGS: AuditLogItem[] = [
  {
    id: 'log_01',
    admin: 'mehedi (Admin)',
    action: 'GALLERY_CLEARED',
    targetUser: 'Gallery Vault',
    timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
    status: 'APPROVED',
    details: 'All gallery images removed from Memoir vault. Feed and memories cleared.'
  },
  {
    id: 'log_02',
    admin: 'mehedi (Admin)',
    action: 'SYSTEM_INITIALIZATION',
    targetUser: 'Memoir Circle Vault',
    timestamp: '2026-10-13 16:40:00',
    status: 'APPROVED',
    details: 'Initialized secure circle environment. Zero public exposure. Ready for member invites.'
  }
];
