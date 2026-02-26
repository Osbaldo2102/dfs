'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getToken } from '@/lib/auth';

export default function AuthGuard({ children }) {
    const router = useRouter();
    const [ready, setReady] = React.useState(false);

    useEffect(() => {
        const token = getToken();
        if (!token) {
            router.replace('/login');
            return;
        }
        setReady(true);
    }, [router]);

    if (!ready) return <p className='p-4'>Verificando sesion...</p>;}