import React, { useState } from 'react';
import { X } from 'lucide-react';

export function TaskForm({ onClose, onSubmit }) {
    const [data, setData] = useState({
        title: '',
        description: '',
        urgency: 5,
        importance: 5,
        tags: '',
        targetDate: new Date().toISOString().split('T')[0]
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({
            ...data,
            tags: data.tags.split(',').map(t => t.trim()).filter(Boolean)
        });
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-enter">
            <div className="glass-panel p-6 w-full max-w-lg relative bg-slate-900">
                <button onClick={onClose} className="absolute top-4 right-4 text-muted hover:text-white">
                    <X size={24} />
                </button>

                <h2 className="mb-6">New Task</h2>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div>
                        <label className="block text-sm text-muted mb-1">Title</label>
                        <input
                            autoFocus
                            className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white focus:outline-none focus:border-sky-500"
                            value={data.title}
                            onChange={e => setData({ ...data, title: e.target.value })}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm text-muted mb-1">Description</label>
                        <textarea
                            className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white focus:outline-none focus:border-sky-500 h-24"
                            value={data.description}
                            onChange={e => setData({ ...data, description: e.target.value })}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm text-muted mb-1">Urgency (1-10)</label>
                            <input
                                type="number" min="1" max="10"
                                className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white"
                                value={data.urgency}
                                onChange={e => setData({ ...data, urgency: parseInt(e.target.value) })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-muted mb-1">Importance (1-10)</label>
                            <input
                                type="number" min="1" max="10"
                                className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white"
                                value={data.importance}
                                onChange={e => setData({ ...data, importance: parseInt(e.target.value) })}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm text-muted mb-1">Tags (comma separated)</label>
                        <input
                            className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white"
                            placeholder="work, feature, bug"
                            value={data.tags}
                            onChange={e => setData({ ...data, tags: e.target.value })}
                        />
                    </div>

                    <button type="submit" className="btn btn-primary mt-4 justify-center">
                        Create Task
                    </button>
                </form>
            </div>
        </div>
    );
}
