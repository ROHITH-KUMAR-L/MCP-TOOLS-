import { motion } from 'framer-motion';
import clsx from 'clsx';
import styles from './Card.module.css';

export default function Card({ children, className, ...props }) {
    return (
        <motion.div
            className={clsx(styles.card, className)}
            whileHover={{ y: -5 }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            {...props}
        >
            {children}
        </motion.div>
    );
}
