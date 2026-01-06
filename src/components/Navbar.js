'use client';

import Image from 'next/image';
import Link from 'next/link';
import styles from './Navbar.module.css';

export default function Navbar() {
    return (
        <nav className={styles.navbar}>
            <div className={styles.container}>
                <Link href="/" className={styles.brand}>
                    <div className={styles.logoWrapper}>
                        <Image
                            src="/logo.png"
                            alt="EduNexus Logo"
                            width={50}
                            height={50}
                            className={styles.logo}
                        />
                    </div>
                    <span className={styles.brandName}>EduNexus</span>
                </Link>

                <div className={styles.links}>
                    <Link href="/" className={styles.link}>Home</Link>
                    <Link href="/docs" className={styles.link}>Docs</Link>
                </div>
            </div>
        </nav>
    );
}
