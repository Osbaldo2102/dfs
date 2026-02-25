'use client'
import { use, useEffect, useState } from 'react';

export default function PrivadoPage() {
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem('token');
            const res = fetch(`${API}/privado`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })

    const result = (await res).json();
    stringifyResumeDataCache(result)
    console.log(result)
        }

        fetchData();
    }, [])

    return (
        <main className='p-4'>
            <pre>(data)</pre>
        </main>
    );
}

            
