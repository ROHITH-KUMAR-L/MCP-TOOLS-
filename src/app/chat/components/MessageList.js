'use client';

import { useEffect, useRef } from 'react';
import styles from '../Chat.module.css';

export default function MessageList({ messages, isLoading }) {
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    if (messages.length === 0 && !isLoading) {
        return (
            <div className={styles.emptyMessages}>
                <div className={styles.emptyMessagesContent}>
                    <div className={styles.logoGradient}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                    </div>
                    <h2>Start a Conversation</h2>
                    <p>Send a message to begin chatting with AI</p>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.messageList}>
            {messages.map((message, index) => (
                <div
                    key={message._id || index}
                    className={`${styles.message} ${message.role === 'user' ? styles.userMessage : styles.assistantMessage
                        }`}
                >
                    {message.role === 'user' ? (
                        // User message: just the rounded box, no avatar
                        <div className={styles.userMessageBox}>
                            {message.content}
                            {message.attachments && message.attachments.length > 0 && (
                                <div className={styles.attachmentsList}>
                                    {message.attachments.map((file, idx) => (
                                        <div key={idx} className={styles.messageAttachment} title={file.name}>
                                            <svg className={styles.attachmentIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                                            </svg>
                                            <span className={styles.attachmentName}>{file.name}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ) : (
                        // Assistant message: keep avatar + content
                        <>
                            <div className={styles.messageAvatar}>
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                </svg>
                            </div>
                            <div className={styles.messageContent}>
                                <div className={styles.messageText}>{message.content}</div>
                                {message.attachments && message.attachments.length > 0 && (
                                    <div className={styles.attachmentsList}>
                                        {message.attachments.map((file, idx) => (
                                            <div key={idx} className={styles.messageAttachment} title={file.name}>
                                                <svg className={styles.attachmentIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                                                </svg>
                                                <span className={styles.attachmentName}>{file.name}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </div>
            ))}
            {isLoading && (
                <div className={`${styles.message} ${styles.assistantMessage}`}>
                    <div className={styles.messageAvatar}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                    </div>
                    <div className={styles.messageContent}>
                        <div className={styles.loadingDots}>
                            <span></span>
                            <span></span>
                            <span></span>
                        </div>
                    </div>
                </div>
            )}
            <div ref={messagesEndRef} />
        </div>
    );
}
