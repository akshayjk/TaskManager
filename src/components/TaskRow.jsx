import React from 'react';
import { Check, Star, AlertCircle } from 'lucide-react';

export function TaskRow({ task, onComplete, onSelect, onToggleImportance, selected }) {
    const isCompleted = task.status === 'completed';

    return (
        <div
            className={`task-row ${selected ? 'selected' : ''}`}
            style={{ backgroundColor: selected ? 'var(--bg-selected)' : 'var(--bg-surface)', cursor: 'pointer' }}
            onClick={() => onSelect(task)}
        >
            <div
                className={`task-checkbox ${isCompleted ? 'completed' : ''}`}
                onClick={(e) => {
                    e.stopPropagation();
                    onComplete(task.id);
                }}
            >
                {isCompleted && <Check size={14} strokeWidth={3} />}
            </div>

            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', textDecoration: isCompleted ? 'line-through' : 'none', color: isCompleted ? 'var(--text-placeholder)' : 'var(--text-primary)' }}>
                <span className="font-normal" style={{ fontSize: '0.9rem' }}>{task.title}</span>
                <div style={{ display: 'flex', gap: '8px', fontSize: '0.75rem', color: 'var(--text-secondary)', alignItems: 'center' }}>
                    {task.tags?.map(t => <span key={t}>#{t}</span>)}

                    {/* Urgency Indicators */}
                    {task.urgency > 7 && (
                        <span style={{ display: 'flex', alignItems: 'center', gap: '3px', padding: '2px 6px', borderRadius: '4px', fontSize: '10px', backgroundColor: '#fee2e2', color: '#dc2626', fontWeight: 500 }}>
                            <AlertCircle size={10} /> Urgent
                        </span>
                    )}
                </div>
            </div>

            <div
                style={{ padding: '0.5rem', borderRadius: '0.25rem', cursor: 'pointer', color: task.importance > 7 ? '#2563eb' : 'var(--text-placeholder)' }}
                onClick={(e) => {
                    e.stopPropagation();
                    onToggleImportance(task.id);
                }}
                onMouseEnter={(e) => { if (task.importance <= 7) e.currentTarget.style.color = '#3b82f6' }}
                onMouseLeave={(e) => { if (task.importance <= 7) e.currentTarget.style.color = 'var(--text-placeholder)' }}
            >
                <Star size={18} fill={task.importance > 7 ? "currentColor" : "none"} />
            </div>
        </div>
    );
}
