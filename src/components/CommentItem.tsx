'use client';

import { useState } from 'react';
import { CommentNode } from '@/lib/mockComments';

export default function CommentItem({ comment }: { comment: CommentNode }) {
  const [showSpoiler, setShowSpoiler] = useState(false);
  const [isReplying, setIsReplying] = useState(false);
  const [replyText, setReplyText] = useState('');

  const handleReplySubmit = () => {
    // Burada ileride API'ye asıl yanıt gönderme mantığı olacak
    alert(`Yanıt eklendi (Mock): ${replyText}`);
    setReplyText('');
    setIsReplying(false);
  };

  return (
    <div className="w-full">
      {/* Ana Yorum Bloğu */}
      <div className="flex gap-4 p-4 hover:bg-slate-800/30 transition-colors rounded-xl">
        {/* Avatar */}
        <div className="flex-shrink-0">
          <img 
            src={comment.user.avatar_url} 
            alt={comment.user.name} 
            className="w-10 h-10 rounded-full border border-slate-700 bg-slate-800"
          />
        </div>

        {/* Yorum İçeriği ve Gövde */}
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-2 mb-1">
            <span className="font-semibold text-slate-200 text-sm">{comment.user.name}</span>
            <span className="text-xs text-slate-500">{comment.createdAt}</span>
          </div>

          <div className="relative mb-3">
            {comment.isSpoiler && !showSpoiler ? (
              <div 
                className="relative cursor-pointer rounded-lg overflow-hidden group h-12 flex items-center justify-center bg-slate-800/50 border border-slate-700"
                onClick={() => setShowSpoiler(true)}
              >
                {/* Blur efekt arka planda */}
                <div className="absolute inset-0 blur-md pointer-events-none text-slate-400 p-2 overflow-hidden opacity-50">
                  {comment.content}
                </div>
                {/* Üstünde net metin */}
                <div className="relative z-10 font-bold text-red-400 group-hover:text-red-300 transition-colors flex items-center gap-2 text-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/><line x1="3" y1="3" x2="21" y2="21"/></svg>
                  Spoiler - Görmek İçin Tıklayın
                </div>
              </div>
            ) : (
              <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">
                {comment.content}
              </p>
            )}
          </div>

          {/* Alt Aksiyonlar */}
          <div className="flex items-center gap-4 mt-2">
            <button 
              onClick={() => setIsReplying(!isReplying)}
              className="text-xs font-semibold text-slate-400 hover:text-indigo-400 transition-colors flex items-center gap-1"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 17 4 12 9 7"/><path d="M20 18v-2a4 4 0 0 0-4-4H4"/></svg>
              Yanıtla
            </button>
            
            {comment.isSpoiler && showSpoiler && (
              <button 
                onClick={() => setShowSpoiler(false)}
                className="text-xs font-semibold text-slate-500 hover:text-red-400 transition-colors"
              >
                Gizle
              </button>
            )}
          </div>

          {/* Yanıtlama Alanı */}
          {isReplying && (
            <div className="mt-4 flex gap-3 animate-in fade-in slide-in-from-top-2 duration-200">
              <input 
                type="text" 
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Yanıtınızı yazın..." 
                className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder:text-slate-600"
              />
              <button 
                onClick={handleReplySubmit}
                className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Gönder
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Recursive Render for Replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="ml-5 pl-4 sm:ml-9 border-l-2 border-slate-800 flex flex-col gap-2 mt-2">
          {comment.replies.map((reply) => (
            <CommentItem key={reply.id} comment={reply} />
          ))}
        </div>
      )}
    </div>
  );
}
