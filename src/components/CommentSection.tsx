'use client';

import { useState } from 'react';
import { CommentNode, mockComments as initialComments } from '@/lib/mockComments';
import CommentItem from '@/components/CommentItem';

export default function CommentSection() {
  const [comments, setComments] = useState<CommentNode[]>(initialComments);
  const [newComment, setNewComment] = useState('');
  const [isSpoiler, setIsSpoiler] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    // Geçici olarak mock verinin başına ekliyoruz, veritabanı bağlanınca API post edilecek
    const newEntry: CommentNode = {
      id: `c-${Date.now()}`,
      user: {
        id: "me",
        name: "Ben",
        avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Me",
      },
      content: newComment,
      isSpoiler: isSpoiler,
      createdAt: "şimdi",
      replies: []
    };

    setComments([newEntry, ...comments]);
    setNewComment('');
    setIsSpoiler(false);
  };

  return (
    <div className="w-full mt-10 max-w-4xl mx-auto">
      <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 mb-8 shadow-xl">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-400"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
          Bir Şeyler Söyle
        </h3>
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <textarea 
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Teorilerini ve düşüncelerini buraya yaz..."
            className="w-full bg-slate-900 border border-slate-700 rounded-xl p-4 text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all min-h-[100px] resize-y"
          />
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <label className="flex items-center gap-2 cursor-pointer group">
              <input 
                type="checkbox" 
                checked={isSpoiler}
                onChange={(e) => setIsSpoiler(e.target.checked)}
                className="w-4 h-4 rounded bg-slate-900 border-slate-700 text-indigo-600 focus:ring-indigo-500 focus:ring-offset-slate-900"
              />
              <span className="text-sm font-medium text-slate-400 group-hover:text-slate-300 transition-colors flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={isSpoiler ? "text-red-400" : ""}><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/><line x1="3" y1="3" x2="21" y2="21"/></svg>
                Spoiler İçerir
              </span>
            </label>
            
            <button 
              type="submit"
              disabled={!newComment.trim()}
              className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-2.5 rounded-lg font-medium transition-all shadow-lg shadow-indigo-600/20 active:scale-95"
            >
              Yorum Yap
            </button>
          </div>
        </form>
      </div>

      <div className="space-y-6">
        {comments.map((comment) => (
          <CommentItem key={comment.id} comment={comment} />
        ))}
      </div>
    </div>
  );
}
