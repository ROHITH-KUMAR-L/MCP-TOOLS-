'use client';

import { useState, useRef, useEffect } from 'react';
import styles from '../Chat.module.css';

export default function ChatInput({ onSendMessage, disabled }) {
    const [message, setMessage] = useState('');
    const [attachments, setAttachments] = useState([]);
    const textareaRef = useRef(null);
    const fileInputRef = useRef(null);
    const [isConverting, setIsConverting] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        if ((message.trim() || attachments.length > 0) && !disabled && !isConverting) {
            onSendMessage(message.trim(), attachments);
            setMessage('');
            setAttachments([]);
            if (textareaRef.current) {
                textareaRef.current.style.height = 'auto';
            }
        }
    };

    const handleFileChange = async (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;

        setIsConverting(true);
        const newAttachments = [...attachments];

        for (const file of files) {
            try {
                const base64 = await convertToBase64(file);
                newAttachments.push({
                    name: file.name,
                    mimeType: file.type,
                    data: base64,
                });
            } catch (error) {
                console.error('Error converting file:', error);
            }
        }

        setAttachments(newAttachments);
        setIsConverting(false);
        // Reset file input
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const convertToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                // Remove the "data:*/*;base64," prefix
                const base64 = reader.result.split(',')[1];
                resolve(base64);
            };
            reader.onerror = (error) => reject(error);
        });
    };

    const removeAttachment = (index) => {
        setAttachments(prev => prev.filter((_, i) => i !== index));
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
        }
    };

    const handleChange = (e) => {
        setMessage(e.target.value);
        // Auto-resize textarea
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
        }
    };

    return (
        <div className={styles.chatInputContainer}>
            {attachments.length > 0 && (
                <div className={styles.attachmentPreview}>
                    {attachments.map((file, index) => (
                        <div key={index} className={styles.attachmentChip}>
                            <svg className={styles.attachmentIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                            </svg>
                            <span className={styles.attachmentName} title={file.name}>{file.name}</span>
                            <button
                                type="button"
                                onClick={() => removeAttachment(index)}
                                className={styles.removeAttachment}
                                title="Remove file"
                            >
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    ))}
                </div>
            )}
            <form onSubmit={handleSubmit} className={styles.chatInputForm}>
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className={styles.fileInputHidden}
                    multiple
                />
                <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className={styles.attachButton}
                    disabled={disabled || isConverting}
                    title="Attach files"
                >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                    </svg>
                </button>
                <textarea
                    ref={textareaRef}
                    value={message}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    placeholder={isConverting ? "Processing files..." : "Send a message..."}
                    className={styles.chatInput}
                    disabled={disabled || isConverting}
                    rows={1}
                />
                <button
                    type="submit"
                    disabled={disabled || (!message.trim() && attachments.length === 0) || isConverting}
                    className={styles.sendButton}
                    title="Send message"
                >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                </button>
            </form>
            <div className={styles.inputHint}>
                Press <kbd>Enter</kbd> to send, <kbd>Shift + Enter</kbd> for new line
            </div>
        </div>
    );
}
