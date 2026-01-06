'use client';

import { motion } from 'framer-motion';
import { Shield, Cpu, Zap, Globe, Database, Layers } from 'lucide-react';
import Card from './ui/Card';
import styles from './Features.module.css';

const features = [
    {
        icon: <Cpu size={32} />,
        title: 'MCP Powered',
        description: 'Built on the Model Context Protocol for standardized, secure AI interactions across your entire toolset.'
    },
    {
        icon: <Zap size={32} />,
        title: 'n8n Orchestration',
        description: 'Seamlessly automate complex workflows connecting Google Drive, Gmail, and GitHub with ease.'
    },
    {
        icon: <Shield size={32} />,
        title: 'Privacy First',
        description: 'Your data stays yours. AI agents operate within your authenticated environment without external access.'
    },
    {
        icon: <Globe size={32} />,
        title: 'Unified Interface',
        description: 'Access all your digital tools—from PDFs to system utilities—in one beautiful, consolidated dashboard.'
    },
    {
        icon: <Database size={32} />,
        title: 'Smart Context',
        description: 'AI understands your files and emails to provide relevant, context-aware assistance.'
    },
    {
        icon: <Layers size={32} />,
        title: 'Multi-Agent System',
        description: 'Deploy specialized agents for coding, research, and management tasks simultaneously.'
    }
];

export default function Features() {
    return (
        <section className={styles.features}>
            <div className={styles.container}>
                <motion.div
                    className={styles.header}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <h2 className={styles.title}>Supercharge Your Workflow</h2>
                    <p className={styles.subtitle}>
                        Everything you need to automate your digital life, securely and intelligently.
                    </p>
                </motion.div>

                <div className={styles.grid}>
                    {features.map((feature, index) => (
                        <Card key={index} className={styles.featureCard}>
                            <div className={styles.iconWrapper}>{feature.icon}</div>
                            <h3 className={styles.featureTitle}>{feature.title}</h3>
                            <p className={styles.featureDescription}>{feature.description}</p>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
}
