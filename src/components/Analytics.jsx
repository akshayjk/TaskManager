import React from 'react';
import { CheckCircle2, AlertCircle, Clock, ArrowRight, BarChart2, Star } from 'lucide-react';

export function Analytics({ tasks }) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(today.getDate() - 7);

    // Helper to check if date is today
    const isToday = (dateString) => {
        if (!dateString) return false;
        const d = new Date(dateString);
        return d.setHours(0, 0, 0, 0) === today.getTime();
    };

    // Helper to check if date is within last week
    const isThisWeek = (dateString) => {
        if (!dateString) return false;
        const d = new Date(dateString);
        return d >= oneWeekAgo && d <= new Date();
    };

    const stats = {
        doneToday: tasks.filter(t => t.status === 'completed' && isToday(t.completedAt)).length,
        doneWeek: tasks.filter(t => t.status === 'completed' && isThisWeek(t.completedAt)).length,
        pendingTotal: tasks.filter(t => t.status !== 'completed').length,
        pushed: tasks.filter(t => t.pushHistory?.length > 0).length,
        urgentPending: tasks.filter(t => t.status !== 'completed' && t.urgency > 5).length,
        importantPending: tasks.filter(t => t.status !== 'completed' && t.importance > 5).length
    };

    // Chart Data Calculation
    const chartData = [];
    for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dayStr = d.toLocaleDateString('en-US', { weekday: 'short' });
        const count = tasks.filter(t => t.status === 'completed' && new Date(t.completedAt).toDateString() === d.toDateString()).length;
        chartData.push({ day: dayStr, count });
    }
    const maxCount = Math.max(...chartData.map(d => d.count), 1); // Avoid div by zero

    const StatCard = ({ title, value, icon: Icon, bgStyle, subtitle }) => (
        <div className="card-base" style={{ padding: '1rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', height: '100%', transition: 'box-shadow 0.2s', cursor: 'default' }}>
            <div style={{ padding: '0.5rem', borderRadius: '50%', marginBottom: '0.5rem', backgroundColor: bgStyle?.backgroundColor, color: bgStyle?.color }}>
                <Icon size={24} />
            </div>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--text-primary)', marginBottom: '0.125rem' }}>{value}</h3>
            <p style={{ fontSize: '0.75rem', fontWeight: 500, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{title}</p>
            {subtitle && <p style={{ fontSize: '0.75rem', color: 'var(--text-placeholder)', marginTop: '0.25rem' }}>{subtitle}</p>}
        </div>
    );

    return (
        <div className="main-content-overlay" style={{ overflowY: 'auto', height: '100%', paddingLeft: '24px', paddingRight: '24px' }}>
            <header className="py-6">
                <h2 className="text-2xl font-bold text-brand-primary flex items-center gap-2">
                    <BarChart2 size={24} /> Performance Analytics
                </h2>
                <p className="text-sm text-gray-500 mt-1">Track your productivity and task health.</p>
            </header>

            {/* Weekly Activity Chart */}
            <div className="card-base" style={{ marginBottom: '2rem' }}>
                <h3 className="text-lg font-semibold" style={{ color: 'var(--text-primary)', marginBottom: '1.5rem' }}>Weekly Activity</h3>
                <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: '160px', gap: '8px' }}>
                    {chartData.map((d, i) => (
                        <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, gap: '8px' }} className="group">
                            <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--brand-primary)', opacity: 0, transition: 'opacity 0.2s' }} className="group-hover:opacity-100">{d.count}</span>
                            <div
                                style={{ width: '100%', backgroundColor: '#dbeafe', borderTopLeftRadius: '6px', borderTopRightRadius: '6px', position: 'relative', height: `${(d.count / maxCount) * 100}%`, minHeight: '4px' }}
                            >
                                <div
                                    style={{ position: 'absolute', bottom: 0, width: '100%', backgroundColor: 'var(--brand-primary)', borderTopLeftRadius: '6px', borderTopRightRadius: '6px', transition: 'height 0.5s', height: `${(d.count / maxCount) * 100}%` }}
                                />
                            </div>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{d.day}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', paddingBottom: '2rem' }}>
                <StatCard
                    title="Done Today"
                    value={stats.doneToday}
                    icon={CheckCircle2}
                    bgStyle={{ backgroundColor: '#dcfce7', color: '#16a34a' }}
                />
                <StatCard
                    title="Done This Week"
                    value={stats.doneWeek}
                    icon={Clock}
                    bgStyle={{ backgroundColor: '#dbeafe', color: '#2563eb' }}
                    subtitle="Last 7 Days"
                />
                <StatCard
                    title="Total Pending"
                    value={stats.pendingTotal}
                    icon={AlertCircle}
                    bgStyle={{ backgroundColor: '#f3f4f6', color: '#4b5563' }}
                />
                <StatCard
                    title="Urgent & Pending"
                    value={stats.urgentPending}
                    icon={AlertCircle}
                    bgStyle={{ backgroundColor: '#fee2e2', color: '#dc2626' }}
                    subtitle="Urgency > 5"
                />
                <StatCard
                    title="Important & Pending"
                    value={stats.importantPending}
                    icon={Star}
                    bgStyle={{ backgroundColor: '#f3e8ff', color: '#7c3aed' }}
                    subtitle="Importance > 5"
                />
                <StatCard
                    title="Pushed Tasks"
                    value={stats.pushed}
                    icon={ArrowRight}
                    bgStyle={{ backgroundColor: '#ffedd5', color: '#ea580c' }}
                    subtitle="Rescheduled at least once"
                />
            </div>
        </div>
    );
}
