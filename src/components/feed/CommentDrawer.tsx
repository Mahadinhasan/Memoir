import React, { useState } from 'react';
import { X, Send, Heart, Sparkles, MessageSquare } from 'lucide-react';
import { Post, User } from '../../types';

interface CommentDrawerProps {
  post: Post | null;
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
  onAddComment: (postId: string, text: string) => void;
}

export const CommentDrawer: React.FC<CommentDrawerProps> = ({
  post,
  isOpen,
  onClose,
  currentUser,
  onAddComment
}) => {
  const [commentText, setCommentText] = useState('');

  if (!isOpen || !post) return null;

  const quickReactions = ['❤️ Love this', '✨ Magical', '🥹 Unforgettable', '🔥 Incredible shot', '🎉 Best circle!'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    onAddComment(post.id, commentText.trim());
    setCommentText('');
  };

  const handleQuickReaction = (reaction: string) => {
    onAddComment(post.id, reaction);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-md h-full glass-panel border-l border-white/15 flex flex-col shadow-2xl animate-slideLeft">
        {/* Top Header */}
        <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between bg-slate-900/80">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-sky-400" />
            <span className="font-bold text-sm text-white">Circle Comments</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/10 text-slate-300">
              {post.comments.length}
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Post Summary Thumbnail */}
        <div className="p-4 bg-white/5 border-b border-white/10 flex items-center gap-3">
          <img 
            src={post.photos[0]} 
            alt="Thumbnail" 
            className="w-12 h-12 rounded-xl object-cover border border-white/15 flex-shrink-0"
          />
          <div className="flex-1 min-w-0">
            <div className="text-xs font-semibold text-white truncate">
              {post.author.name}
            </div>
            <p className="text-[11px] text-slate-300 truncate">
              {post.caption}
            </p>
          </div>
        </div>

        {/* Quick Claymorphic Reaction Pills */}
        <div className="px-4 py-2.5 bg-slate-950/40 border-b border-white/5">
          <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold mb-1.5 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-sky-400" />
            Claymorphic Social Reactions:
          </div>
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            {quickReactions.map((r, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleQuickReaction(r)}
                className="clay-badge px-2.5 py-1 text-[11px] bg-slate-800/90 text-slate-200 hover:text-white whitespace-nowrap border border-white/10 transition"
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        {/* Comments List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
          {post.comments.length === 0 ? (
            <div className="h-48 flex flex-col items-center justify-center text-center p-6 text-slate-400">
              <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-3 text-slate-500">
                <MessageSquare className="w-6 h-6" />
              </div>
              <p className="text-sm font-medium text-slate-300">No comments yet</p>
              <p className="text-xs text-slate-500 mt-0.5">Be the first in your circle to leave a note on this memory.</p>
            </div>
          ) : (
            post.comments.map((comment) => (
              <div key={comment.id} className="flex items-start gap-3 p-2.5 rounded-2xl bg-white/5 hover:bg-white/10 transition">
                <img 
                  src={comment.author.avatar} 
                  alt={comment.author.name} 
                  className="w-8 h-8 rounded-xl object-cover border border-white/20 flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-white">
                      {comment.author.name}
                    </span>
                    <span className="text-[10px] text-slate-500">
                      {comment.createdAt}
                    </span>
                  </div>
                  <p className="text-xs text-slate-200 mt-1 leading-relaxed">
                    {comment.text}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Add Comment Input Form */}
        <form onSubmit={handleSubmit} className="p-4 border-t border-white/10 bg-slate-900/90">
          <div className="flex items-center gap-2">
            <img 
              src={currentUser.avatar} 
              alt={currentUser.name} 
              className="w-7 h-7 rounded-xl object-cover border border-sky-400/30"
            />
            <input
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Leave a note for this circle memory..."
              className="flex-1 px-3.5 py-2 rounded-2xl glass-input text-xs text-white placeholder:text-slate-500"
            />
            <button
              type="submit"
              disabled={!commentText.trim()}
              className="p-2 rounded-xl bg-sky-500 text-white disabled:opacity-40 transition shadow-md shadow-sky-500/20"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
