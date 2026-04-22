import React, { useState } from 'react';
import { X, Calendar } from 'lucide-react';

export function PushModal({ onClose, onConfirm }) {
    const [reason, setReason] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onConfirm(reason);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-enter">
            <div className="glass-panel p-6 w-full max-w-sm relative bg-slate-900">
                <button onClick={onClose} className="absolute top-4 right-4 text-muted hover:text-white">
                    <X size={24} />
                </button>

                <h2 className="mb-4 text-xl flex items-center gap-2">
                    <Calendar className="text-orange-400" />
                    Push to Tomorrow
                </h2>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div>
                        <label className="block text-sm text-muted mb-2">Why are you pushing this task?</label>
                        <textarea
                            autoFocus
                            className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white focus:outline-none focus:border-orange-500 h-24"
                            placeholder="e.g. Ran out of time, priority shift..."
                            value={reason}
                            onChange={e => setReason(e.target.value)}
                            required
                        />
                    </div>

                    <div className="flex justify-end gap-2 mt-2">
                        <button type="button" onClick={onClose} className="btn">Cancel</button>
                        <button type="submit" className="btn hover:bg-orange-500 hover:text-white border-orange-500/50">
                            Confirm Push
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
