import React, { useState, useEffect } from 'react';
import { X, Calendar, Bell, Repeat, FileText, Trash2, Star, AlertCircle } from 'lucide-react';

export function TaskDetail({ task, onClose, onUpdate, onDelete }) {
    const [title, setTitle] = useState(task.title);
    const [note, setNote] = useState(task.description || '');
    const dateInputRef = React.useRef(null);
    const reminderInputRef = React.useRef(null);

    // Sync state when task changes
    useEffect(() => {
        setTitle(task.title);
        setNote(task.description || '');
    }, [task.id]);



    return (
        <div
            className="glass-panel"
            style={{
                position: 'fixed',
                top: 0,
                right: 0,
                height: '100%',
                width: '350px',
                backgroundColor: 'var(--bg-surface-solid)',
                boxShadow: 'var(--shadow-flyout)',
                zIndex: 20,
                display: 'flex',
                flexDirection: 'column',
                borderLeft: '1px solid var(--border-light)',
                transition: 'transform 0.3s'
            }}
        >
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%', color: 'var(--text-primary)' }}>
                {/* Header */}
                <div style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-light)' }}>
                    <button onClick={onClose} style={{ padding: '0.5rem', marginLeft: '-0.5rem', borderRadius: '0.25rem', border: 'none', background: 'transparent', cursor: 'pointer', display: 'flex' }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-hover)'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                        <X size={20} style={{ color: 'var(--text-secondary)' }} />
                    </button>
                    <button onClick={() => onDelete(task.id)} style={{ padding: '0.5rem', borderRadius: '0.25rem', color: '#ef4444', border: 'none', background: 'transparent', cursor: 'pointer', display: 'flex' }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#fef2f2'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                        <Trash2 size={18} />
                    </button>
                </div>

                <div style={{ padding: '1.5rem', flex: 1, overflowY: 'auto' }}>
                    {/* Title Edit */}
                    <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem' }}>
                        <input
                            className="fluent-input"
                            style={{ fontSize: '1.25rem', fontWeight: 600, backgroundColor: 'transparent', color: 'var(--text-primary)' }}
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            onBlur={() => onUpdate(task.id, { title })}
                        />
                    </div>

                    {/* Quick Actions */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem' }}>

                        {/* Hidden Native Inputs for Pickers */}
                        <input
                            type="date"
                            ref={dateInputRef}
                            style={{ display: 'none' }}
                            onChange={(e) => onUpdate(task.id, { targetDate: e.target.value })}
                        />
                        <input
                            type="datetime-local"
                            ref={reminderInputRef}
                            style={{ display: 'none' }}
                            onChange={(e) => onUpdate(task.id, { reminder: e.target.value })}
                        />

                        <button style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', borderRadius: '0.25rem', border: '1px solid var(--border-light)', background: 'transparent', color: 'var(--text-secondary)', width: '100%', cursor: 'pointer', textAlign: 'left' }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-hover)'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                            <Sun size={18} /> Add to My Day
                        </button>

                        <button
                            onClick={() => dateInputRef.current?.showPicker()}
                            style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', borderRadius: '0.25rem', border: '1px solid var(--border-light)', background: 'transparent', color: 'var(--text-secondary)', width: '100%', cursor: 'pointer', textAlign: 'left' }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-hover)'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                            <Calendar size={18} />
                            {task.targetDate ? new Date(task.targetDate).toLocaleDateString() : 'Add due date'}
                        </button>

                        <button
                            onClick={() => reminderInputRef.current?.showPicker()}
                            style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', borderRadius: '0.25rem', border: '1px solid var(--border-light)', background: 'transparent', color: 'var(--text-secondary)', width: '100%', cursor: 'pointer', textAlign: 'left' }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-hover)'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                            <Bell size={18} />
                            {task.reminder ? new Date(task.reminder).toLocaleString() : 'Remind me'}
                        </button>
                    </div>

                    {/* Priority & Tags Section */}
                    <div style={{ padding: '1rem', borderRadius: '0.25rem', border: '1px solid var(--border-light)', marginBottom: '1.5rem', backgroundColor: 'var(--bg-surface)' }}>
                        <h3 style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '1rem' }}>Tags & Priority</h3>

                        {/* Special Toggles */}
                        <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem' }}>
                            <button
                                onClick={() => onUpdate(task.id, { importance: task.importance > 5 ? 1 : 10 })}
                                style={{
                                    flex: 1, padding: '0.5rem', borderRadius: '4px', fontSize: '0.875rem', fontWeight: 500, cursor: 'pointer',
                                    border: task.importance > 5 ? '1px solid #7c3aed' : '1px solid var(--border-light)',
                                    backgroundColor: task.importance > 5 ? '#f3e8ff' : 'transparent',
                                    color: task.importance > 5 ? '#7c3aed' : 'var(--text-secondary)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px'
                                }}
                            >
                                <Star size={16} fill={task.importance > 5 ? "currentColor" : "none"} /> Important
                            </button>
                            <button
                                onClick={() => onUpdate(task.id, { urgency: task.urgency > 5 ? 1 : 10 })}
                                style={{
                                    flex: 1, padding: '0.5rem', borderRadius: '4px', fontSize: '0.875rem', fontWeight: 500, cursor: 'pointer',
                                    border: task.urgency > 5 ? '1px solid #dc2626' : '1px solid var(--border-light)',
                                    backgroundColor: task.urgency > 5 ? '#fee2e2' : 'transparent',
                                    color: task.urgency > 5 ? '#dc2626' : 'var(--text-secondary)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px'
                                }}
                            >
                                <AlertCircle size={16} /> Urgent
                            </button>
                        </div>

                        {/* Tag List */}
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.75rem' }}>
                            {task.tags?.map((tag, index) => (
                                <span key={index} style={{
                                    display: 'inline-flex', alignItems: 'center', gap: '4px',
                                    padding: '2px 8px', borderRadius: '12px', fontSize: '12px',
                                    backgroundColor: 'var(--bg-hover)', color: 'var(--text-primary)',
                                    border: '1px solid var(--border-light)'
                                }}>
                                    #{tag}
                                    <X
                                        size={12}
                                        style={{ cursor: 'pointer', color: 'var(--text-secondary)' }}
                                        onClick={() => {
                                            const newTags = task.tags.filter(t => t !== tag);
                                            onUpdate(task.id, { tags: newTags });
                                        }}
                                    />
                                </span>
                            ))}
                        </div>

                        {/* Add Tag Input */}
                        <input
                            className="fluent-input"
                            style={{
                                width: '100%', padding: '0.5rem', fontSize: '0.875rem',
                                backgroundColor: 'transparent', borderBottom: '1px solid var(--border-light)',
                                borderRadius: 0
                            }}
                            placeholder="+ Add custom tag (Press Enter)"
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault();
                                    const val = e.target.value.trim();
                                    if (val && !task.tags?.includes(val)) {
                                        const newTags = [...(task.tags || []), val];
                                        onUpdate(task.id, { tags: newTags });
                                        e.target.value = '';
                                    }
                                }
                            }}
                        />
                    </div>

                    {/* Note Section */}
                    <div style={{ marginTop: '1.5rem' }}>
                        <textarea
                            style={{ width: '100%', height: '8rem', padding: '0.75rem', backgroundColor: 'var(--bg-hover)', borderRadius: '0.25rem', border: '1px solid transparent', resize: 'none', fontSize: '0.875rem', color: 'var(--text-primary)', fontFamily: 'inherit' }}
                            placeholder="Add note..."
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            onBlur={() => onUpdate(task.id, { description: note })}
                        />
                    </div>

                    <div style={{ marginTop: '2rem', fontSize: '0.75rem', color: 'var(--text-secondary)', textAlign: 'center' }}>
                        Created {new Date(task.createdAt).toLocaleDateString()}
                    </div>
                </div>
            </div>
        </div>
    );
}

// Icon helper since I missed importing Sun
function Sun({ size, className }) {
    return <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="4" /><path d="M12 2v2" /><path d="M12 20v2" /><path d="m4.93 4.93 1.41 1.41" /><path d="m17.66 17.66 1.41 1.41" /><path d="M2 12h2" /><path d="M20 12h2" /><path d="m6.34 17.66-1.41 1.41" /><path d="m19.07 4.93-1.41 1.41" /></svg>;
}
