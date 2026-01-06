import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Features from '@/components/Features';
import { delay } from '@/lib/delay';

export default async function Home() {
    await delay(2000);
    return (
        <>
            <Navbar />
            <main>
                <Hero />
                <Features />
            </main>
        </>
    );
}
