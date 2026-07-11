import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ChevronLeft, Calendar, Loader2 } from 'lucide-react';

export default function BlogPost() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`${API_URL}/api/blogs/${slug}`);
        if (!response.ok) throw new Error('Post not found');
        const data = await response.json();
        setPost(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#020610] flex items-center justify-center">
        <Loader2 className="animate-spin text-cyan-500" size={48} />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-[#020610] flex flex-col items-center justify-center text-slate-300">
        <h1 className="text-4xl font-bold text-white mb-4">404 - Post Not Found</h1>
        <p className="mb-8 text-slate-400">The transmission you are looking for has been heavily encrypted or deleted.</p>
        <Link to="/" className="text-cyan-400 hover:text-cyan-300 flex items-center gap-2">
          <ChevronLeft size={20} /> Return to Base
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020610] text-slate-300 font-sans selection:bg-cyan-500/30 pb-20">
      <div className="max-w-3xl mx-auto px-4 pt-20">
        <Link to="/#blogs" className="text-cyan-500 hover:text-cyan-400 font-bold flex items-center gap-2 mb-12 w-fit transition-colors">
          <ChevronLeft size={20} /> Back to Communications
        </Link>
        
        <header className="mb-12 border-b border-slate-800 pb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">{post.title}</h1>
          <div className="flex items-center gap-2 text-slate-500 text-sm">
            <Calendar size={16} />
            <time>{new Date(post.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</time>
          </div>
        </header>

        <article className="prose prose-invert prose-cyan max-w-none 
          prose-headings:font-bold prose-h1:text-3xl prose-h2:text-2xl 
          prose-p:text-slate-300 prose-p:leading-relaxed
          prose-a:text-cyan-400 prose-a:no-underline hover:prose-a:underline
          prose-strong:text-white prose-code:text-cyan-300 prose-code:bg-cyan-500/10 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded
          prose-pre:bg-slate-900 prose-pre:border prose-pre:border-slate-800
          prose-blockquote:border-l-cyan-500 prose-blockquote:bg-cyan-500/5 prose-blockquote:py-1 prose-blockquote:px-4 prose-blockquote:rounded-r
          prose-li:marker:text-cyan-500">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {post.content}
          </ReactMarkdown>
        </article>
      </div>
    </div>
  );
}
