import React from 'react';
import { CheckCircle, ArrowRight, Clock, Tag } from 'lucide-react';

export function TaskCard({ task, onComplete, onPush, onEdit }) {
    const priorityColor = task.urgency > 7 ? 'text-rose-500' : (task.urgency > 4 ? 'text-yellow-500' : 'text-blue-500');
    const importanceColor = task.importance > 7 ? 'border-l-4 border-l-violet-500' : 'border-l-4 border-l-gray-700';

    return (
        <div className={`glass-panel p-4 flex flex-col gap-3 hover:translate-y-[-2px] transition-transform ${importanceColor}`}>
            <div className="flex-between">
                <h3 className="text-lg font-semibold truncate" title={task.title}>{task.title}</h3>
                <button className="btn-icon hover:text-green-400" onClick={() => onComplete(task.id)} title="Complete">
                    <CheckCircle size={20} />
                </button>
            </div>

            {task.description && (
                <p className="text-sm text-muted line-clamp-2">{task.description}</p>
            )}

            <div className="flex gap-2 flex-wrap">
                {task.tags?.map(tag => (
                    <span key={tag} className="text-xs px-2 py-1 rounded-full bg-slate-700 text-sky-300 flex items-center gap-1">
                        <Tag size={10} /> {tag}
                    </span>
                ))}
            </div>

            <div className="flex-between mt-auto pt-2 border-t border-slate-700/50">
                <div className="flex gap-3 text-xs text-muted">
                    <span className={`${priorityColor} flex items-center gap-1`}>
                        Priority: {task.urgency}
                    </span>
                    <span className="flex items-center gap-1">
                        <Clock size={12} /> {new Date(task.targetDate || Date.now()).toLocaleDateString()}
                    </span>
                </div>

                <div className="flex gap-2">
                    <button className="btn-icon hover:text-orange-400" onClick={() => onPush(task.id)} title="Push to tomorrow">
                        <ArrowRight size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
}
