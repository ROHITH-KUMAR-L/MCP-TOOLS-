import styles from './Footer.module.css';

export default function Footer() {
    return (
        <footer className={styles.footer}>
            <div className={styles.container}>
                <div className={styles.grid}>
                    <div className={styles.brand}>
                        <h3 className={styles.logo}>AI Platform</h3>
                        <p className={styles.description}>
                            Empowering your digital life with secure, personalized AI agents.
                        </p>
                    </div>

                    <div className={styles.links}>
                        <h4 className={styles.linkTitle}>Product</h4>
                        <a href="#" className={styles.link}>Features</a>
                        <a href="#" className={styles.link}>Integrations</a>
                        <a href="#" className={styles.link}>Pricing</a>
                    </div>

                    <div className={styles.links}>
                        <h4 className={styles.linkTitle}>Resources</h4>
                        <a href="#" className={styles.link}>Documentation</a>
                        <a href="#" className={styles.link}>API</a>
                        <a href="#" className={styles.link}>Community</a>
                    </div>

                    <div className={styles.links}>
                        <h4 className={styles.linkTitle}>Company</h4>
                        <a href="#" className={styles.link}>About</a>
                        <a href="#" className={styles.link}>Blog</a>
                        <a href="#" className={styles.link}>Careers</a>
                    </div>
                </div>

                <div className={styles.bottom}>
                    <p>&copy; {new Date().getFullYear()} AI Platform. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}
