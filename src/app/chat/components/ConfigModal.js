'use client';

import { useState, useEffect } from 'react';
import styles from '../Chat.module.css';

export default function ConfigModal({ isOpen, onClose, user }) {
    const [activeTab, setActiveTab] = useState('tokens');
    const [settings, setSettings] = useState({
        huggingfaceToken: '',
        githubToken: '',
        googleDriveConnected: false,
        googleSheetsConnected: false,
    });
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (isOpen) {
            fetchSettings();
        }
    }, [isOpen]);

    const fetchSettings = async () => {
        try {
            const response = await fetch('/api/settings');
            if (response.ok) {
                const data = await response.json();
                setSettings({
                    huggingfaceToken: data.huggingfaceToken || '',
                    githubToken: data.githubToken || '',
                    googleDriveConnected: data.googleDriveConnected || false,
                    googleSheetsConnected: data.googleSheetsConnected || false,
                });
            }
        } catch (error) {
            console.error('Error fetching settings:', error);
        }
    };

    const handleSave = async () => {
        setIsSaving(true);
        setMessage('');

        try {
            const response = await fetch('/api/settings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(settings),
            });

            if (response.ok) {
                setMessage('Settings updated');
                setTimeout(() => setMessage(''), 3000);
            } else {
                setMessage('Update failed');
            }
        } catch (error) {
            console.error('Error saving settings:', error);
            setMessage('Update failed');
        } finally {
            setIsSaving(false);
        }
    };

    const handleConnectDrive = () => {
        if (settings.googleDriveConnected) {
            if (confirm('Disconnect Google Drive?')) {
                setSettings({ ...settings, googleDriveConnected: false });
            }
            return;
        }
        alert('Google Drive OAuth integration coming soon!');
    };

    const handleConnectSheets = () => {
        if (settings.googleSheetsConnected) {
            if (confirm('Disconnect Google Sheets?')) {
                setSettings({ ...settings, googleSheetsConnected: false });
            }
            return;
        }
        alert('Google Sheets OAuth integration coming soon!');
    };

    if (!isOpen) return null;

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                <div className={styles.modalHeader}>
                    <h2>Settings</h2>
                    <button onClick={onClose} className={styles.modalCloseButton} aria-label="Close">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className={styles.modalTabsContainer}>
                    <div className={styles.modalTabs}>
                        <button
                            className={`${styles.modalTab} ${activeTab === 'tokens' ? styles.modalTabActive : ''}`}
                            onClick={() => setActiveTab('tokens')}
                        >
                            Developer
                        </button>
                        <button
                            className={`${styles.modalTab} ${activeTab === 'integrations' ? styles.modalTabActive : ''}`}
                            onClick={() => setActiveTab('integrations')}
                        >
                            Integrations
                        </button>
                    </div>
                </div>

                <div className={styles.modalBody}>
                    {activeTab === 'tokens' && (
                        <div className={styles.settingsSection}>
                            <div className={styles.settingsGroup}>
                                <label className={styles.settingsLabel}>
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                    HuggingFace API
                                </label>
                                <input
                                    type="password"
                                    className={styles.settingsInput}
                                    placeholder="hf_xxxxxxxxxxxxxxxxxxxx"
                                    value={settings.huggingfaceToken}
                                    onChange={(e) => setSettings({ ...settings, huggingfaceToken: e.target.value })}
                                />
                                <span className={styles.settingsHint}>Required for advanced LLM reasoning and custom model integration.</span>
                            </div>

                            <div className={styles.settingsGroup}>
                                <label className={styles.settingsLabel}>
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                                    </svg>
                                    GitHub Token
                                </label>
                                <input
                                    type="password"
                                    className={styles.settingsInput}
                                    placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                                    value={settings.githubToken}
                                    onChange={(e) => setSettings({ ...settings, githubToken: e.target.value })}
                                />
                                <span className={styles.settingsHint}>Enables repository analysis and automated code commits.</span>
                            </div>
                        </div>
                    )}

                    {activeTab === 'integrations' && (
                        <div className={styles.settingsSection}>
                            <div className={styles.integrationCard}>
                                <div className={styles.integrationInfo}>
                                    <div className={styles.integrationIcon}>
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3>Google Drive</h3>
                                        <p>Sync documents and knowledge base.</p>
                                    </div>
                                </div>
                                <button
                                    className={`${styles.integrationButton} ${settings.googleDriveConnected ? styles.integrationConnected : ''}`}
                                    onClick={handleConnectDrive}
                                >
                                    {settings.googleDriveConnected ? 'Connected' : 'Connect'}
                                </button>
                            </div>

                            <div className={styles.integrationCard}>
                                <div className={styles.integrationInfo}>
                                    <div className={styles.integrationIcon}>
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3>Google Sheets</h3>
                                        <p>Automate data entry and reporting.</p>
                                    </div>
                                </div>
                                <button
                                    className={`${styles.integrationButton} ${settings.googleSheetsConnected ? styles.integrationConnected : ''}`}
                                    onClick={handleConnectSheets}
                                >
                                    {settings.googleSheetsConnected ? 'Connected' : 'Connect'}
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                <div className={styles.modalFooter}>
                    {message && (
                        <div className={styles.saveMessage}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" style={{ width: 14, height: 14 }}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                            {message}
                        </div>
                    )}
                    <button onClick={onClose} className={styles.modalCancelButton}>
                        Cancel
                    </button>
                    <button onClick={handleSave} disabled={isSaving} className={styles.modalSaveButton}>
                        {isSaving ? 'Processing...' : 'Save Settings'}
                    </button>
                </div>
            </div>
        </div>
    );
}
