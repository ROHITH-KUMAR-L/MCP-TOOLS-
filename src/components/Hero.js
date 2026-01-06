'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Button from './ui/Button';
import Aurora from './Aurora';
import styles from './Hero.module.css';

const logos = [
    {
        name: 'Google Drive',
        svg: (
            <svg viewBox="0 0 87.3 78" xmlns="http://www.w3.org/2000/svg">
                <path d="m6.6 66.85 25.3-43.8 25.3 43.8z" fill="#0066da" opacity=".3" />
                <path d="m6.6 66.85 25.3-43.8 25.3 43.8z" fill="#00ac47" />
                <path d="m43.65 23.05-25.3 43.8h-18.35l25.3-43.8z" fill="#ea4335" />
                <path d="m43.65 23.05 25.3 43.8h-18.35l-25.3-43.8z" fill="#0066da" />
                <path d="m43.65 23.05-25.3 43.8h50.6l-25.3-43.8z" fill="#ffba00" />
                <path d="m6.6 66.85h50.6l11.75-20.35h-74.1z" fill="#00ac47" />
                <path d="m31.9 23.05h25.3l-12.65-21.9h-25.3z" fill="#0066da" />
                <path d="m6.6 66.85 12.65 21.9h50.6l-12.65-21.9z" fill="#2684fc" />
                <path d="m57.2 23.05 25.3 43.8 11.75-20.35-25.3-43.8z" fill="#ffba00" />
                <path d="m82.5 66.85-25.3-43.8-12.65 21.9 25.3 43.8z" fill="#00ac47" />
            </svg>
        )
    },
    {
        name: 'Slack',
        svg: (
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312zM18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.52V8.834zM17.688 8.834a2.528 2.528 0 0 1-2.522 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.522 2.522v6.312zM15.165 18.956a2.528 2.528 0 0 1 2.522 2.52A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.52h2.52zM15.165 17.688a2.527 2.527 0 0 1-2.52-2.522 2.527 2.527 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z" fill="#fff" />
            </svg>
        )
    },
    {
        name: 'Firecrawl',
        svg: (
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="#f97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.1.2-2.2.6-3.3.7 3.7 4.4 4.5 4.4 4.5z" />
            </svg>
        )
    },
    {
        name: 'Google Sheets',
        svg: (
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z" fill="#34a853" />
            </svg>
        )
    },
    {
        name: 'GitHub',
        svg: (
            <svg viewBox="0 0 98 96" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" clipRule="evenodd" d="M48.854 0C21.839 0 0 22 0 49.217c0 21.756 13.993 40.172 33.405 46.69 2.427.49 3.316-1.059 3.316-2.362 0-1.141-.08-5.052-.08-9.127-13.59 2.934-16.42-5.867-16.42-5.867-2.184-5.704-5.42-7.17-5.42-7.17-4.448-3.015.324-3.015.324-3.015 4.934.326 7.523 5.052 7.523 5.052 4.367 7.496 11.404 5.378 14.235 4.074.404-3.178 1.699-5.378 3.074-6.6-10.839-1.141-22.243-5.378-22.243-24.283 0-5.378 1.94-9.778 5.014-13.2-.485-1.222-2.184-6.275.486-13.038 0 0 4.125-1.304 13.426 5.052a46.97 46.97 0 0 1 12.214-1.63c4.125 0 8.33.571 12.213 1.63 9.302-6.356 13.427-5.052 13.427-5.052 2.67 6.763.97 11.816.485 13.038 3.155 3.422 5.015 7.822 5.015 13.2 0 18.905-11.404 23.06-22.324 24.283 1.78 1.548 3.316 4.481 3.316 9.126 0 6.6-.08 11.897-.08 13.526 0 1.304.89 2.853 3.316 2.364 19.412-6.52 33.405-24.935 33.405-46.691C97.707 22 75.788 0 48.854 0z" fill="#24292f" />
            </svg>
        )
    },
    {
        name: 'Gmail',
        svg: (
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M24 5.4v13.2h-3.6v-9.6l-8.4 6-8.4-6v9.6h-3.6v-13.2l12 9z" fill="#ea4335" />
                <path d="M24 5.4l-12 9-12-9h3.6l8.4 6 8.4-6z" fill="#c5221f" />
            </svg>
        )
    },
];

export default function Hero() {
    return (
        <section className={styles.hero}>
            <div className={styles.auroraWrapper}>
                <Aurora
                    colorStops={["#0def55", "#b19eef", "#5227ff"]}
                    blend={0.5}
                    amplitude={1}
                    speed={0.5}
                />
            </div>
            <div className={styles.content}>
                <motion.h1
                    className={styles.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    Your Personalized <br />
                    <span className={styles.gradientText}>AI Workforce</span>
                </motion.h1>

                <motion.p
                    className={styles.subtitle}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                >
                    Securely orchestrate Google Drive, GitHub, and more with your own AI agents.
                    Built on MCP for privacy and power.
                </motion.p>

                <motion.div
                    className={styles.actions}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
                >
                    <Link href="/signup">
                        <Button variant="primary">Get Started</Button>
                    </Link>
                </motion.div>

                {/* Integration Section */}
                <motion.div
                    className={styles.integrationSection}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
                >
                    <h2 className={styles.integrationTitle}>Connect Your Ecosystem</h2>
                    <p className={styles.integrationSubtitle}>
                        Seamlessly integrate with the tools you use every day.
                    </p>

                    <div className={styles.logoCarousel}>
                        <div className={styles.marqueeWrapper}>
                            <div className={styles.marquee}>
                                {[...logos, ...logos].map((tool, index) => (
                                    <div key={index} className={styles.logoItem} title={tool.name}>
                                        <div className={styles.logoWrapper}>
                                            {tool.svg}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
