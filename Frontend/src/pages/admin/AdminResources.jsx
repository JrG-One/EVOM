import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
    BookOpen,
    Trash2,
    Plus,
    Edit2,
    Save,
    X,
    Link as LinkIcon,
    Image as ImageIcon
} from 'lucide-react';
import { toast } from 'react-hot-toast';

const AdminResources = () => {
    const [resources, setResources] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(null); // ID of resource being edited
    const [formData, setFormData] = useState({ title: '', description: '', thumbnail: '', link: '' });
    const [showAddForm, setShowAddForm] = useState(false);

    const fetchResources = async () => {
        setLoading(true);
        try {
            const response = await axios.get('http://localhost:3000/api/admin/resources', { withCredentials: true });
            setResources(response.data);
        } catch (error) {
            toast.error("Failed to fetch resources");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchResources();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEditing) {
                await axios.put(`http://localhost:3000/api/admin/resources/${isEditing}`, formData, { withCredentials: true });
                toast.success("Resource updated");
            } else {
                await axios.post('http://localhost:3000/api/admin/resources', formData, { withCredentials: true });
                toast.success("Resource added");
            }
            setFormData({ title: '', description: '', thumbnail: '', link: '' });
            setIsEditing(null);
            setShowAddForm(false);
            fetchResources();
        } catch (error) {
            toast.error("Operation failed");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this resource?")) return;
        try {
            await axios.delete(`http://localhost:3000/api/admin/resources/${id}`, { withCredentials: true });
            toast.success("Resource deleted");
            fetchResources();
        } catch (error) {
            toast.error("Failed to delete");
        }
    };

    const startEdit = (res) => {
        setIsEditing(res.id);
        setFormData({ title: res.title, description: res.description, thumbnail: res.thumbnail, link: res.link });
        setShowAddForm(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-1000">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black tracking-tight mb-2">Resource Management</h1>
                    <p className="text-gray-400">Manage scholarship links and educational content.</p>
                </div>
                {!showAddForm && (
                    <button
                        onClick={() => { setShowAddForm(true); setIsEditing(null); }}
                        className="flex items-center gap-2 px-6 py-3 bg-gradient-to-tr from-purple-600 to-blue-600 rounded-2xl font-bold hover:scale-105 transition-all shadow-lg"
                    >
                        <Plus className="w-5 h-5" /> Add New
                    </button>
                )}
            </div>

            {showAddForm && (
                <div className="p-8 rounded-[2.5rem] bg-[#0A0A0F]/60 border border-purple-500/20 backdrop-blur-xl animate-in slide-in-from-top-4 duration-500">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold">{isEditing ? 'Edit Resource' : 'Add New Resource'}</h2>
                        <button onClick={() => setShowAddForm(false)} className="p-2 hover:bg-white/5 rounded-full"><X className="w-5 h-5" /></button>
                    </div>
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-gray-500 ml-1">Title</label>
                            <input
                                required
                                className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                                placeholder="Scholarship Title..."
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-gray-500 ml-1">Destination Link</label>
                            <div className="relative">
                                <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                <input
                                    required
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                                    placeholder="https://..."
                                    value={formData.link}
                                    onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="md:col-span-2 space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-gray-500 ml-1">Description</label>
                            <textarea
                                required
                                rows="3"
                                className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                                placeholder="Briefly describe what this resource is about..."
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            ></textarea>
                        </div>
                        <div className="md:col-span-2 space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-gray-500 ml-1">Thumbnail URL</label>
                            <div className="relative">
                                <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                <input
                                    required
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                                    placeholder="Image link / CDN URL..."
                                    value={formData.thumbnail}
                                    onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="md:col-span-2 flex justify-end gap-4 mt-2">
                            <button
                                type="button"
                                onClick={() => setShowAddForm(false)}
                                className="px-8 py-4 font-bold text-gray-500 hover:text-white transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="flex items-center gap-2 px-10 py-4 bg-purple-600 rounded-2xl font-bold hover:bg-purple-500 shadow-xl shadow-purple-900/20 active:scale-95 transition-all"
                            >
                                <Save className="w-5 h-5" /> {isEditing ? 'Update Resource' : 'Publish Resource'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 pb-10">
                {loading ? (
                    Array(3).fill(0).map((_, i) => (
                        <div key={i} className="h-[200px] rounded-[2rem] bg-white/5 animate-pulse" />
                    ))
                ) : resources.map((res) => (
                    <div key={res.id} className="group relative overflow-hidden rounded-[2.5rem] bg-[#0A0A0F]/60 border border-white/5 hover:border-purple-500/30 transition-all duration-500 backdrop-blur-xl">
                        <div className="aspect-video overflow-hidden">
                            <img src={res.thumbnail} alt={res.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-60 group-hover:opacity-100" />
                        </div>
                        <div className="p-6">
                            <h3 className="text-xl font-black mb-2 line-clamp-1">{res.title}</h3>
                            <p className="text-gray-500 text-sm line-clamp-2 mb-6 font-medium leading-relaxed">{res.description}</p>

                            <div className="flex items-center justify-between">
                                <a href={res.link} target="_blank" rel="noreferrer" className="text-xs font-black uppercase tracking-widest text-purple-500 hover:text-purple-400 underline underline-offset-4">Visit Link</a>
                                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => startEdit(res)} className="p-2 bg-white/5 rounded-xl hover:bg-white/10 text-blue-400 transition-all"><Edit2 className="w-4 h-4" /></button>
                                    <button onClick={() => handleDelete(res.id)} className="p-2 bg-white/5 rounded-xl hover:bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all"><Trash2 className="w-4 h-4" /></button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminResources;
