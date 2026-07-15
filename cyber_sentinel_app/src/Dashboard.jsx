import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { Users, Mail, LogOut, Loader2, AlertTriangle, ShieldCheck, Edit2, Trash2, X } from 'lucide-react';
import Logo from './Logo';

export default function Dashboard() {
  const { user, token, logout, isLoading } = useAuth();
  const navigate = useNavigate();
  const [telemetry, setTelemetry] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [activeTab, setActiveTab] = useState('leads'); // 'leads', 'subscribers', or 'blog'
  
  // Blog form
  const [blogForm, setBlogForm] = useState({ title: '', slug: '', excerpt: '', content: '' });
  const [isPublishing, setIsPublishing] = useState(false);

  // Edit Modal State
  const [editModal, setEditModal] = useState({ isOpen: false, type: null, data: null });
  const [isSaving, setIsSaving] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/login');
    }
  }, [user, isLoading, navigate]);

  useEffect(() => {
    if (token) {
      fetchData();
    }
  }, [token]);

  const fetchData = async () => {
    try {
      const response = await fetch(`${API_URL}/api/dashboard/telemetry`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Failed to fetch admin data');
      const data = await response.json();
      setTelemetry(data);

      const blogsRes = await fetch(`${API_URL}/api/blogs`);
      if (blogsRes.ok) {
        const blogsData = await blogsRes.json();
        setBlogs(blogsData);
      }
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
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(blogForm)
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to publish blog');
      setSuccessMsg('Blog post published successfully!');
      setBlogForm({ title: '', slug: '', excerpt: '', content: '' });
      fetchData();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsPublishing(false);
    }
  };

  const handleDelete = async (type, id) => {
    if (!window.confirm(`Are you sure you want to delete this ${type}?`)) return;
    try {
      const response = await fetch(`${API_URL}/api/admin/${type}s/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error(`Failed to delete ${type}`);
      setSuccessMsg(`${type.charAt(0).toUpperCase() + type.slice(1)} deleted successfully.`);
      fetchData();
    } catch (err) {
      setError(err.message);
    }
  };

  const openEditModal = (type, data) => {
    setEditModal({ isOpen: true, type, data: { ...data } });
  };

  const handleEditChange = (field, value) => {
    setEditModal(prev => ({ ...prev, data: { ...prev.data, [field]: value } }));
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const response = await fetch(`${API_URL}/api/admin/${editModal.type}s/${editModal.data.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(editModal.data)
      });
      if (!response.ok) throw new Error(`Failed to update ${editModal.type}`);
      setSuccessMsg(`${editModal.type.charAt(0).toUpperCase() + editModal.type.slice(1)} updated successfully.`);
      setEditModal({ isOpen: false, type: null, data: null });
      fetchData();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSaving(false);
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
      {editModal.isOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-[#050b14] border border-slate-800 rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white capitalize">Edit {editModal.type}</h3>
              <button onClick={() => setEditModal({ isOpen: false, type: null, data: null })} className="text-slate-400 hover:text-white">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleSaveEdit} className="space-y-4">
              {editModal.type === 'lead' && (
                <>
                  <input type="text" value={editModal.data.name} onChange={e => handleEditChange('name', e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white" placeholder="Name" required />
                  <input type="email" value={editModal.data.email} onChange={e => handleEditChange('email', e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white" placeholder="Email" required />
                  <textarea value={editModal.data.message} onChange={e => handleEditChange('message', e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white" placeholder="Message" rows="4" required />
                </>
              )}
              {editModal.type === 'subscriber' && (
                <input type="email" value={editModal.data.email} onChange={e => handleEditChange('email', e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white" placeholder="Email" required />
              )}
              {editModal.type === 'blog' && (
                <>
                  <input type="text" value={editModal.data.title} onChange={e => handleEditChange('title', e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white" placeholder="Title" required />
                  <input type="text" value={editModal.data.slug} onChange={e => handleEditChange('slug', e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white font-mono" placeholder="Slug" required />
                  <textarea value={editModal.data.excerpt} onChange={e => handleEditChange('excerpt', e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white" placeholder="Excerpt" rows="2" required />
                  <textarea value={editModal.data.content} onChange={e => handleEditChange('content', e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white font-mono" placeholder="Content" rows="8" required />
                </>
              )}
              <div className="flex justify-end gap-3 mt-6">
                <button type="button" onClick={() => setEditModal({ isOpen: false, type: null, data: null })} className="px-6 py-2 rounded-lg font-bold text-slate-400 hover:text-white">Cancel</button>
                <button type="submit" disabled={isSaving} className="bg-cyan-500 text-slate-950 font-bold px-6 py-2 rounded-lg hover:bg-cyan-400 flex items-center gap-2">
                  {isSaving && <Loader2 size={16} className="animate-spin" />} Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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
              Manage Blogs
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
                      <th className="p-4 font-bold border-b border-slate-800 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/50">
                    {telemetry?.leads?.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="p-8 text-center text-slate-500">No leads found in database.</td>
                      </tr>
                    ) : (
                      telemetry?.leads?.map(lead => (
                        <tr key={lead.id} className="hover:bg-slate-800/30 transition-colors">
                          <td className="p-4 text-slate-400 whitespace-nowrap">{new Date(lead.created_at).toLocaleDateString()}</td>
                          <td className="p-4 font-medium text-white">{lead.name}</td>
                          <td className="p-4 text-cyan-400"><a href={`mailto:${lead.email}`}>{lead.email}</a></td>
                          <td className="p-4 text-slate-300 text-sm">{lead.message}</td>
                          <td className="p-4 text-right whitespace-nowrap">
                            <button onClick={() => openEditModal('lead', lead)} className="p-2 text-slate-400 hover:text-blue-400 transition-colors" title="Edit"><Edit2 size={16} /></button>
                            <button onClick={() => handleDelete('lead', lead.id)} className="p-2 text-slate-400 hover:text-rose-400 transition-colors" title="Delete"><Trash2 size={16} /></button>
                          </td>
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
                      <th className="p-4 font-bold border-b border-slate-800 w-1/2">Email Address</th>
                      <th className="p-4 font-bold border-b border-slate-800 text-center">Status</th>
                      <th className="p-4 font-bold border-b border-slate-800 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/50">
                    {telemetry?.subscribers?.length === 0 ? (
                      <tr>
                        <td colSpan="4" className="p-8 text-center text-slate-500">No subscribers found in database.</td>
                      </tr>
                    ) : (
                      telemetry?.subscribers?.map(sub => (
                        <tr key={sub.id} className="hover:bg-slate-800/30 transition-colors">
                          <td className="p-4 text-slate-400 whitespace-nowrap">{new Date(sub.created_at).toLocaleDateString()}</td>
                          <td className="p-4 text-cyan-400"><a href={`mailto:${sub.email}`}>{sub.email}</a></td>
                          <td className="p-4 text-center"><span className="inline-flex items-center gap-1 bg-green-500/10 text-green-400 px-2 py-1 rounded-md text-xs font-bold"><ShieldCheck size={14} /> Active</span></td>
                          <td className="p-4 text-right whitespace-nowrap">
                            <button onClick={() => openEditModal('subscriber', sub)} className="p-2 text-slate-400 hover:text-blue-400 transition-colors" title="Edit"><Edit2 size={16} /></button>
                            <button onClick={() => handleDelete('subscriber', sub.id)} className="p-2 text-slate-400 hover:text-rose-400 transition-colors" title="Delete"><Trash2 size={16} /></button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              ) : (
                <div className="p-8">
                  {/* Blog List Section */}
                  <div className="mb-12">
                    <h2 className="text-xl font-bold text-white mb-6 flex justify-between items-center">
                      <span>Existing Blogs</span>
                      <span className="text-sm font-normal text-slate-400 bg-slate-900 px-3 py-1 rounded-full">{blogs.length} Published</span>
                    </h2>
                    <div className="space-y-4">
                      {blogs.length === 0 ? (
                        <p className="text-slate-500 text-center py-8 border border-dashed border-slate-800 rounded-xl">No blogs published yet.</p>
                      ) : (
                        blogs.map(blog => (
                          <div key={blog.id} className="flex flex-col sm:flex-row sm:items-center justify-between bg-slate-950 border border-slate-800 p-5 rounded-xl gap-4 hover:border-slate-700 transition-colors">
                            <div>
                              <h3 className="text-white font-bold text-lg mb-1">{blog.title}</h3>
                              <p className="text-slate-400 text-sm font-mono mb-2">/{blog.slug}</p>
                              <p className="text-slate-500 text-sm line-clamp-1">{blog.excerpt}</p>
                            </div>
                            <div className="flex gap-2 sm:shrink-0">
                              <button onClick={async () => {
                                try {
                                  const res = await fetch(`${API_URL}/api/blogs/${blog.slug}`);
                                  const fullBlog = await res.json();
                                  openEditModal('blog', fullBlog);
                                } catch(e) {
                                  setError("Could not load blog content for editing.");
                                }
                              }} className="px-4 py-2 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 rounded-lg text-sm font-bold flex items-center gap-2 transition-colors"><Edit2 size={16}/> Edit</button>
                              <button onClick={() => handleDelete('blog', blog.id)} className="px-4 py-2 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 rounded-lg text-sm font-bold flex items-center gap-2 transition-colors"><Trash2 size={16}/> Delete</button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  <hr className="border-slate-800 mb-12" />

                  {/* Create Blog Section */}
                  <h2 className="text-xl font-bold text-white mb-6">Create New Blog Post</h2>
                  <form onSubmit={handlePublishBlog} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Title</label>
                        <input required type="text" value={blogForm.title} onChange={e => setBlogForm({...blogForm, title: e.target.value})} className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-cyan-500 transition-colors" placeholder="e.g. Zero Trust Architecture" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Slug URL</label>
                        <input required type="text" value={blogForm.slug} onChange={e => setBlogForm({...blogForm, slug: e.target.value})} className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-cyan-400 font-mono focus:border-cyan-500 transition-colors" placeholder="zero-trust-architecture" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Short Excerpt</label>
                      <textarea required rows="2" value={blogForm.excerpt} onChange={e => setBlogForm({...blogForm, excerpt: e.target.value})} className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-cyan-500 transition-colors" placeholder="A short summary of the blog post..." />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 flex items-center justify-between">
                        <span>Markdown Content</span>
                        <span className="text-cyan-500/50 lowercase">supports standard markdown format</span>
                      </label>
                      <textarea required rows="12" value={blogForm.content} onChange={e => setBlogForm({...blogForm, content: e.target.value})} className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white font-mono focus:border-cyan-500 transition-colors" placeholder="# Heading 1&#10;Write your post content here..." />
                    </div>
                    <div className="flex justify-end">
                      <button type="submit" disabled={isPublishing} className="bg-cyan-500 text-slate-950 font-bold px-8 py-3 rounded-lg hover:bg-cyan-400 transition-colors flex items-center gap-2">
                        {isPublishing && <Loader2 size={18} className="animate-spin" />} Publish Post
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
