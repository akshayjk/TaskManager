import React from 'react';
import { Sun, Moon, Image as ImageIcon, Sliders, Database } from 'lucide-react';

export function Settings({ opacity, setOpacity, isDarkMode, setIsDarkMode, settings, onUpdateSettings }) {
    const [dbPath, setDbPath] = React.useState('');

    React.useEffect(() => {
        async function fetchPath() {
            try {
                const path = await window.electronAPI.getDatabasePath();
                setDbPath(path);
            } catch (err) {
                console.error('Failed to get DB path:', err);
            }
        }
        fetchPath();
    }, []);

    const handleSwitchDatabase = async () => {
        try {
            const result = await window.electronAPI.switchDatabase();
            if (result.success) {
                setDbPath(result.path);
                // Reload data to reflect new DB content
                window.location.reload();
            }
        } catch (err) {
            console.error('Failed to switch database:', err);
        }
    };

    return (
        <div className="main-content-overlay overflow-y-auto" style={{ height: '100%' }}>
            <header className="py-8">
                <h2 className="text-3xl font-bold text-brand-primary flex items-center gap-3">
                    <Sliders /> Settings
                </h2>
                <p className="text-[var(--text-secondary)] mt-2">Manage your application preferences and data.</p>
            </header>

            <div style={{ maxWidth: '42rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', paddingBottom: '3rem' }}>

                {/* Database Location Section */}
                <section className="card-base" style={{ padding: '1.5rem' }}>
                    <h3 className="text-lg font-semibold" style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-primary)' }}>
                        <Database size={20} /> Database Location
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                            Your tasks are stored in a local SQLite database file. You can move this file to a synced folder (e.g., Dropbox, OneDrive) to access your data across devices.
                        </p>
                        <div style={{ backgroundColor: 'var(--bg-hover)', padding: '1rem', borderRadius: '4px', border: '1px solid var(--border-light)' }}>
                            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.25rem', textTransform: 'uppercase' }}>
                                Current File Path
                            </label>
                            <code style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-primary)', wordBreak: 'break-all', fontFamily: 'monospace', backgroundColor: 'var(--bg-secondary)', padding: '0.5rem', borderRadius: '4px' }}>
                                {dbPath || 'Loading...'}
                            </code>
                        </div>
                        <button
                            onClick={handleSwitchDatabase}
                            className="bg-brand-primary text-white font-medium hover:bg-brand-hover focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2"
                            style={{ alignSelf: 'flex-start', padding: '0.625rem 1.25rem', borderRadius: '6px', border: 'none', cursor: 'pointer', transition: 'background-color 0.2s' }}
                        >
                            Switch Database File...
                        </button>
                    </div>
                </section>

                {/* Appearance Section */}
                <section className="card-base" style={{ padding: '1.5rem' }}>
                    <h3 className="text-lg font-semibold" style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-primary)' }}>
                        <Sun size={20} /> Appearance
                    </h3>

                    {/* Theme Toggle */}
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                            App Theme
                        </label>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <button
                                onClick={() => setIsDarkMode(false)}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', borderRadius: '4px', border: '1px solid', transition: 'all 0.2s', cursor: 'pointer',
                                    backgroundColor: !isDarkMode ? '#eff6ff' : 'transparent',
                                    borderColor: !isDarkMode ? '#bfdbfe' : 'var(--border-light)',
                                    color: !isDarkMode ? '#2563eb' : 'var(--text-secondary)'
                                }}
                            >
                                <Sun size={18} /> Light
                            </button>
                            <button
                                onClick={() => setIsDarkMode(true)}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', borderRadius: '4px', border: '1px solid', transition: 'all 0.2s', cursor: 'pointer',
                                    backgroundColor: isDarkMode ? '#334155' : 'transparent',
                                    borderColor: isDarkMode ? '#475569' : 'var(--border-light)',
                                    color: isDarkMode ? 'white' : 'var(--text-secondary)'
                                }}
                            >
                                <Moon size={18} /> Dark
                            </button>
                        </div>
                    </div>

                    <hr style={{ borderTop: '1px solid var(--border-light)', margin: '0 0 1.5rem 0' }} />

                    {/* Transparency Slider */}
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                            Glass Opacity
                            <span style={{ marginLeft: '0.5rem', fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 400 }}>
                                ({Math.round(opacity * 100)}%)
                            </span>
                        </label>
                        <input
                            type="range"
                            min="0" max="100"
                            value={opacity * 100}
                            style={{ width: '100%', height: '4px', backgroundColor: '#e5e7eb', borderRadius: '8px', appearance: 'none', cursor: 'pointer' }}
                            onChange={(e) => setOpacity(parseInt(e.target.value) / 100)}
                        />
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                            Adjust the transparency of the application panels to see more of the background image.
                        </p>
                    </div>

                    <hr style={{ borderTop: '1px solid var(--border-light)', margin: '0 0 1.5rem 0' }} />

                    {/* Background Info */}
                    <div>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                            <ImageIcon size={16} /> Custom Background
                        </label>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            <div style={{ backgroundColor: 'var(--bg-hover)', padding: '0.75rem', borderRadius: '4px', border: '1px solid var(--border-light)' }}>
                                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: '1.5', marginBottom: '0.75rem' }}>
                                    Select an image to use as your personalized background. It will be saved with your data.
                                </p>
                                <input
                                    type="file"
                                    accept="image/*"
                                    style={{ width: '100%', fontSize: '0.875rem', color: 'var(--text-secondary)' }}
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                            const reader = new FileReader();
                                            reader.onloadend = () => {
                                                onUpdateSettings({ backgroundImage: reader.result });
                                            };
                                            reader.readAsDataURL(file);
                                        }
                                    }}
                                />
                            </div>
                            {settings?.backgroundImage && (
                                <button
                                    onClick={() => onUpdateSettings({ backgroundImage: null })}
                                    style={{ fontSize: '0.75rem', color: '#ef4444', textDecoration: 'underline', border: 'none', background: 'none', cursor: 'pointer', alignSelf: 'flex-start', padding: 0 }}
                                >
                                    Reset to Default
                                </button>
                            )}
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}
