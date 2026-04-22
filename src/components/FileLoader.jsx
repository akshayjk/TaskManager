import React from 'react';
import { FolderOpen } from 'lucide-react';

export function FileLoader({ onOpenFile }) {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-transparent">
            <div className="glass-panel p-8 max-w-md w-full text-center animate-enter">
                <h1 className="mb-4">AgentManager</h1>
                <p className="text-muted mb-8">
                    Personal Task Orchestration System.
                    <br />
                    Select your local data file to begin.
                </p>

                <button className="btn btn-primary w-full justify-center text-lg py-3" onClick={onOpenFile}>
                    <FolderOpen size={24} />
                    Open Data File
                </button>

                <div className="mt-6 text-sm text-muted">
                    <p>Securely reads/writes directly to your disk.</p>
                    <p>No cloud upload.</p>
                </div>
            </div>
        </div>
    );
}
