import { motion } from 'framer-motion';
import clsx from 'clsx';
import styles from './Button.module.css';

export default function Button({
    children,
    variant = 'primary',
    className,
    ...props
}) {
    return (
        <motion.button
            className={clsx(styles.button, styles[variant], className)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            {...props}
        >
            {children}
        </motion.button>
    );
}
