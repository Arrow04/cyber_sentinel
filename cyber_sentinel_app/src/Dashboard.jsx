import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { Users, Mail, LogOut, Loader2, AlertTriangle, ShieldCheck } from 'lucide-react';
import Logo from './Logo';

export default function Dashboard() {
  const { user, token, logout, isLoading } = useAuth();
  const navigate = useNavigate();
  const [telemetry, setTelemetry] = useState(null);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [activeTab, setActiveTab] = useState('leads'); // 'leads', 'subscribers', or 'blog'
  const [blogForm, setBlogForm] = useState({ title: '', slug: '', excerpt: '', content: '' });
  const [isPublishing, setIsPublishing] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/login');
    }
  }, [user, isLoading, navigate]);

  useEffect(() => {
    if (token) {
      fetchTelemetry();
    }
  }, [token]);

  const fetchTelemetry = async () => {
    try {
      const response = await fetch(`${API_URL}/api/dashboard/telemetry`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) throw new Error('Failed to fetch admin data');
      const data = await response.json();
      setTelemetry(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const handlePublishBlog = async (e) => {
    e.preventDefault();
    setIsPublishing(true);
    setError('');
    setSuccessMsg('');
    try {
      const response = await fetch(`${API_URL}/api/admin/blogs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(blogForm)
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to publish blog');
      setSuccessMsg('Blog post published successfully!');
      setBlogForm({ title: '', slug: '', excerpt: '', content: '' });
    } catch (err) {
      setError(err.message);
    } finally {
      setIsPublishing(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (isLoading || (!user && !error)) {
    return (
      <div className="min-h-screen bg-[#020610] flex items-center justify-center">
        <Loader2 className="animate-spin text-cyan-500" size={48} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020610] text-slate-300 font-sans selection:bg-cyan-500/30">
      <nav className="border-b border-slate-800 bg-[#050b14]">
        <div className="max-w-[92%] mx-auto px-4 lg:px-8 py-4 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-3">
            <Logo className="w-8 h-8 text-white" />
            <span className="text-lg font-bold text-white">Admin Command Center</span>
          </Link>
          <div className="flex items-center gap-6 text-sm">
            <div className="hidden md:flex items-center gap-2 text-slate-400">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              <span>Operator: {user?.email}</span>
            </div>
            <button onClick={handleLogout} className="flex items-center gap-2 text-rose-400 hover:text-rose-300 transition-colors font-medium">
              <LogOut size={16} />
              <span className="hidden sm:inline">Terminate Session</span>
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-[92%] mx-auto px-4 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Lead Database</h1>
            <p className="text-slate-400">Manage incoming client communications and newsletter subscriptions.</p>
          </div>
          <div className="flex bg-slate-900 border border-slate-800 rounded-lg p-1">
            <button 
              onClick={() => {setActiveTab('leads'); setError(''); setSuccessMsg('');}}
              className={`px-4 py-2 rounded-md text-sm font-bold transition-colors ${activeTab === 'leads' ? 'bg-cyan-500/20 text-cyan-400' : 'text-slate-400 hover:text-white'}`}
            >
              Contact Leads ({telemetry?.leads?.length || 0})
            </button>
            <button 
              onClick={() => {setActiveTab('subscribers'); setError(''); setSuccessMsg('');}}
              className={`px-4 py-2 rounded-md text-sm font-bold transition-colors ${activeTab === 'subscribers' ? 'bg-cyan-500/20 text-cyan-400' : 'text-slate-400 hover:text-white'}`}
            >
              Subscribers ({telemetry?.subscribers?.length || 0})
            </button>
            <button 
              onClick={() => {setActiveTab('blog'); setError(''); setSuccessMsg('');}}
              className={`px-4 py-2 rounded-md text-sm font-bold transition-colors ${activeTab === 'blog' ? 'bg-cyan-500/20 text-cyan-400' : 'text-slate-400 hover:text-white'}`}
            >
              Publish Blog
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-rose-500/10 border border-rose-500 text-rose-400 p-4 rounded-xl mb-8 flex items-center gap-3">
            <AlertTriangle size={20} />
            <p>{error}</p>
          </div>
        )}

        {successMsg && (
          <div className="bg-green-500/10 border border-green-500 text-green-400 p-4 rounded-xl mb-8 flex items-center gap-3">
            <ShieldCheck size={20} />
            <p>{successMsg}</p>
          </div>
        )}

        {!telemetry && !error ? (
          <div className="h-64 border border-slate-800 rounded-2xl flex items-center justify-center bg-slate-900/50">
             <Loader2 className="animate-spin text-cyan-500" size={32} />
          </div>
        ) : (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              {activeTab === 'leads' ? (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-950 text-slate-400 text-sm uppercase tracking-wider">
                      <th className="p-4 font-bold border-b border-slate-800">Date</th>
                      <th className="p-4 font-bold border-b border-slate-800">Name</th>
                      <th className="p-4 font-bold border-b border-slate-800">Email</th>
                      <th className="p-4 font-bold border-b border-slate-800 w-1/2">Message</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/50">
                    {telemetry?.leads?.length === 0 ? (
                      <tr>
                        <td colSpan="4" className="p-8 text-center text-slate-500">No leads found in database.</td>
                      </tr>
                    ) : (
                      telemetry?.leads?.map(lead => (
                        <tr key={lead.id} className="hover:bg-slate-800/30 transition-colors">
                          <td className="p-4 text-slate-400 whitespace-nowrap">{new Date(lead.created_at).toLocaleDateString()}</td>
                          <td className="p-4 font-medium text-white">{lead.name}</td>
                          <td className="p-4 text-cyan-400">
                            <a href={`mailto:${lead.email}`}>{lead.email}</a>
                          </td>
                          <td className="p-4 text-slate-300 text-sm">{lead.message}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              ) : activeTab === 'subscribers' ? (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-950 text-slate-400 text-sm uppercase tracking-wider">
                      <th className="p-4 font-bold border-b border-slate-800">Date Subscribed</th>
                      <th className="p-4 font-bold border-b border-slate-800 w-2/3">Email Address</th>
                      <th className="p-4 font-bold border-b border-slate-800 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/50">
                    {telemetry?.subscribers?.length === 0 ? (
                      <tr>
                        <td colSpan="3" className="p-8 text-center text-slate-500">No subscribers found in database.</td>
                      </tr>
                    ) : (
                      telemetry?.subscribers?.map(sub => (
                        <tr key={sub.id} className="hover:bg-slate-800/30 transition-colors">
                          <td className="p-4 text-slate-400 whitespace-nowrap">{new Date(sub.created_at).toLocaleDateString()}</td>
                          <td className="p-4 text-cyan-400">
                            <a href={`mailto:${sub.email}`}>{sub.email}</a>
                          </td>
                          <td className="p-4 text-right">
                            <span className="inline-flex items-center gap-1 bg-green-500/10 text-green-400 px-2 py-1 rounded-md text-xs font-bold">
                              <ShieldCheck size={14} /> Active
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              ) : (
                <div className="p-8">
                  <h2 className="text-xl font-bold text-white mb-6">Create New Blog Post</h2>
                  <form onSubmit={handlePublishBlog} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Title</label>
                        <input 
                          required type="text"
                          value={blogForm.title} onChange={e => setBlogForm({...blogForm, title: e.target.value})}
                          className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-cyan-500 transition-colors"
                          placeholder="e.g. Zero Trust Architecture"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Slug URL</label>
                        <input 
                          required type="text"
                          value={blogForm.slug} onChange={e => setBlogForm({...blogForm, slug: e.target.value})}
                          className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-cyan-400 font-mono focus:border-cyan-500 transition-colors"
                          placeholder="zero-trust-architecture"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Short Excerpt</label>
                      <textarea 
                        required rows="2"
                        value={blogForm.excerpt} onChange={e => setBlogForm({...blogForm, excerpt: e.target.value})}
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-cyan-500 transition-colors"
                        placeholder="A short summary of the blog post..."
                      ></textarea>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 flex items-center justify-between">
                        <span>Markdown Content</span>
                        <span className="text-cyan-500/50 lowercase">supports standard markdown format</span>
                      </label>
                      <textarea 
                        required rows="12"
                        value={blogForm.content} onChange={e => setBlogForm({...blogForm, content: e.target.value})}
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white font-mono focus:border-cyan-500 transition-colors"
                        placeholder="# Heading 1&#10;Write your post content here..."
                      ></textarea>
                    </div>
                    <div className="flex justify-end">
                      <button 
                        type="submit" disabled={isPublishing}
                        className="bg-cyan-500 text-slate-950 font-bold px-8 py-3 rounded-lg hover:bg-cyan-400 transition-colors flex items-center gap-2"
                      >
                        {isPublishing && <Loader2 size={18} className="animate-spin" />}
                        Publish Post
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
