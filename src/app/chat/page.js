'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Sidebar from './components/Sidebar';
import MessageList from './components/MessageList';
import ChatInput from './components/ChatInput';
import ConfigModal from './components/ConfigModal';
import Aurora from '@/components/Aurora';
import styles from './Chat.module.css';

export default function ChatPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [conversations, setConversations] = useState([]);
    const [activeConversationId, setActiveConversationId] = useState(null);
    const [messages, setMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isConfigOpen, setIsConfigOpen] = useState(false);

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login');
        }
    }, [status, router]);

    useEffect(() => {
        if (session) {
            fetchConversations();
        }
    }, [session]);

    useEffect(() => {
        if (activeConversationId) {
            fetchMessages(activeConversationId);
        } else {
            setMessages([]);
        }
    }, [activeConversationId]);

    const fetchConversations = async () => {
        try {
            const response = await fetch('/api/conversations');
            if (response.ok) {
                const data = await response.json();
                setConversations(data);
            }
        } catch (error) {
            console.error('Error fetching conversations:', error);
        }
    };

    const fetchMessages = async (conversationId) => {
        try {
            const response = await fetch(`/api/conversations/${conversationId}/messages`);
            if (response.ok) {
                const data = await response.json();
                setMessages(data);
            }
        } catch (error) {
            console.error('Error fetching messages:', error);
        }
    };

    const handleNewChat = async () => {
        try {
            const response = await fetch('/api/conversations', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title: 'New Conversation' }),
            });

            if (response.ok) {
                const newConversation = await response.json();
                setConversations([newConversation, ...conversations]);
                setActiveConversationId(newConversation._id);
                return newConversation;
            }
        } catch (error) {
            console.error('Error creating conversation:', error);
        }
        return null;
    };

    const handleSelectConversation = (conversationId) => {
        setActiveConversationId(conversationId);
    };

    const handleDeleteConversation = async (conversationId) => {
        if (!confirm('Are you sure you want to delete this conversation?')) {
            return;
        }

        try {
            const response = await fetch(`/api/conversations/${conversationId}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                setConversations(conversations.filter(c => c._id !== conversationId));
                if (activeConversationId === conversationId) {
                    setActiveConversationId(null);
                }
            }
        } catch (error) {
            console.error('Error deleting conversation:', error);
        }
    };

    const handleSendMessage = async (content, attachments = []) => {
        let conversationId = activeConversationId;

        if (!conversationId) {
            // Create new conversation if none exists
            const newConversation = await handleNewChat();
            if (newConversation) {
                conversationId = newConversation._id;
            }
        }

        if (conversationId) {
            await sendMessageToConversation(content, conversationId, attachments);
        }
    };

    const sendMessageToConversation = async (content, conversationId, attachments = []) => {
        if (!conversationId) return;

        setIsLoading(true);

        // Optimistically add user message
        const tempUserMessage = {
            _id: `temp-${Date.now()}`,
            role: 'user',
            content,
            attachments: attachments || [],
            createdAt: new Date(),
        };
        setMessages(prev => [...prev, tempUserMessage]);

        try {
            const response = await fetch(`/api/conversations/${conversationId}/messages`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content, attachments }),
            });

            if (response.ok) {
                const data = await response.json();

                // Replace temp message with real messages and ensure no duplicates
                setMessages(prev => {
                    const filtered = prev.filter(m => m._id !== tempUserMessage._id);
                    const newMessages = [data.userMessage, data.aiMessage];

                    // Filter out any messages that might already have been added (e.g. by another fetch)
                    const existingIds = new Set(filtered.map(m => m._id));
                    const uniqueNewMessages = newMessages.filter(m => !existingIds.has(m._id));

                    return [...filtered, ...uniqueNewMessages];
                });

                // Update conversation in list
                setConversations(prev =>
                    prev.map(c =>
                        c._id === conversationId
                            ? { ...c, title: data.conversation.title, updatedAt: data.conversation.updatedAt }
                            : c
                    ).sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
                );
            }
        } catch (error) {
            console.error('Error sending message:', error);
            // Remove temp message on error
            setMessages(prev => prev.filter(m => m._id !== tempUserMessage._id));
        } finally {
            setIsLoading(false);
        }
    };

    if (status === 'loading') {
        return (
            <div className={styles.loading}>
                <div className={styles.spinner}></div>
                <p>Loading...</p>
            </div>
        );
    }

    if (!session) {
        return null;
    }

    const hasMessages = messages.length > 0 || isLoading;

    return (
        <div className={styles.container}>
            {/* Aurora Background */}
            <div className={styles.auroraWrapper}>
                <Aurora
                    colorStops={["#ec4899", "#e48dcd", "#5aace3"]}
                    blend={0.6}
                    amplitude={1.3}
                    speed={0.15}
                />
            </div>

            <button
                className={styles.sidebarToggle}
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                title={isSidebarOpen ? 'Close sidebar' : 'Open sidebar'}
            >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
            </button>

            <div className={`${styles.layout} ${!isSidebarOpen ? styles.sidebarClosed : ''}`}>
                <Sidebar
                    conversations={conversations}
                    activeConversationId={activeConversationId}
                    onSelectConversation={handleSelectConversation}
                    onNewChat={handleNewChat}
                    onDeleteConversation={handleDeleteConversation}
                    onOpenSettings={() => setIsConfigOpen(true)}
                    user={session.user}
                />

                <div className={`${styles.mainContent} ${!hasMessages ? styles.centered : ''}`}>
                    {hasMessages ? (
                        <>
                            <MessageList messages={messages} isLoading={isLoading} />
                            <ChatInput onSendMessage={handleSendMessage} disabled={isLoading} />
                        </>
                    ) : (
                        <div className={styles.centeredChatContainer}>
                            <div className={styles.welcomeHeader}>
                                <h1 className={styles.welcomeTitle}>How can I help you today, {session.user.name?.split(' ')[0]}?</h1>
                            </div>
                            <ChatInput onSendMessage={handleSendMessage} disabled={isLoading} />
                        </div>
                    )}
                </div>
            </div>

            <ConfigModal
                isOpen={isConfigOpen}
                onClose={() => setIsConfigOpen(false)}
                user={session?.user}
            />
        </div>
    );
}
