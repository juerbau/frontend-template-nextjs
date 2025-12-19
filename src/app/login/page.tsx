// app/login/page.tsx
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {getCsrfToken} from "@/utils/csrf";
import Link from "next/link";


// Wir rufen den internen Next.js Route Handler an: /login
const NEXTJS_LOGIN_ENDPOINT = '/http/login';
const NEXTJS_LOGOUT_ENDPOINT = '/http/logout';


export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();
    const [loginStatus, setLoginStatus] = useState(false);

    /**
     * Behandelt die Formularübermittlung
     */
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        // 1. Zuerst das CSRF-Cookie bei Laravel anfordern
        // Dies ist der kritische Initial-Aufruf, um die Session zu initialisieren.
        try {
            await fetch('http://localhost:8000/sanctum/csrf-cookie', { credentials: 'include' });
            console.log('✅ CSRF-Cookie erfolgreich angefordert und Session initialisiert.');
        } catch (csrfError) {
            setError('Fehler bei der Initialisierung der Session.');
            console.error(csrfError);
            return;
        }

        // 2. Anmeldedaten an den Next.js Login-Handler senden (Proxy)
        try {
            const response = await fetch(NEXTJS_LOGIN_ENDPOINT, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    // Wichtig: Wir brauchen hier KEINEN X-XSRF-TOKEN, da der Aufruf Server-zu-Server geht
                    // (vom Next.js Route Handler an Laravel).
                },
                // Die Cookies (Session) werden im Route Handler automatisch weitergeleitet.
                body: JSON.stringify({ email, password }),
            });

            if (response.ok) {
                // Erfolg: Die Cookies wurden im Route Handler gesetzt.
                console.log('✅ Login erfolgreich. Session-Cookies gesetzt.');
                setLoginStatus(true);
                // Zum Dashboard oder einer anderen geschützten Seite navigieren
                //router.push('/dashboard');

            } else {
                // Fehlerbehandlung
                const data = await response.json();

                if (response.status === 422 && data.errors) {
                    // Laravel Validierungsfehler
                    setError(Object.values(data.errors).flat().join(' '));
                } else if (response.status === 401) {
                    setError('E-Mail oder Passwort ist falsch.');
                } else {
                    setError('Login fehlgeschlagen. Bitte versuchen Sie es später erneut.');
                }
            }
        } catch (loginError) {
            setError('Netzwerk- oder Serverfehler beim Login.');
            console.error(loginError);
        }
    };


    async function handleLogout() {
        try {
            const response = await fetch(NEXTJS_LOGOUT_ENDPOINT, {
                method: 'POST',
                // Keine Body, keine Header nötig – nur der POST-Aufruf genügt.
            });

            if (response.ok) {
                console.log('✅ Logout erfolgreich. Session gelöscht.');
                setLoginStatus(false);
                // Zur Login-Seite navigieren
                //router.push('/login');
            } else {
                console.error('❌ Logout fehlgeschlagen.');
            }

        } catch (e) {
            console.error('Netzwerkfehler beim Logout:', e);
        }
    }

    async function handleGetUser() {

        const csrfToken = getCsrfToken();

        if (!csrfToken) {
            console.log('❌ Fehler: CSRF-Token fehlt. Bitte zuerst einloggen.');
            return;
        }

        try {

            console.log('3️⃣ User holen');
            const userRes = await fetch('http://localhost:8000/api/user', {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    // 2. KRITISCH: Senden des dekodierten Tokens im Header
                    'X-XSRF-TOKEN': csrfToken
                },
            });

            if (!userRes.ok) {
                console.error('❌ User nicht authentifiziert', userRes.status);
                return;
            }

            const user = await userRes.json();
            console.log('✅ User:', user.name);


        } catch (e) {
            console.error('🔥 Fehler in GetUser', e);
        }
    }

    return (
        <div style={{ padding: '20px', maxWidth: '400px', margin: '50px auto', border: '1px solid #ccc' }}>
            {loginStatus && (
                <>
                <button type='button' onClick={handleGetUser}>GetUser</button>
                <button type='button' onClick={handleLogout}>Logout</button>
            </>
            )}
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                {error && <p style={{ color: 'red' }}>{error}</p>}

                <div>
                    <label htmlFor="email">E-Mail:</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>

                <div style={{ marginTop: '10px' }}>
                    <label htmlFor="password">Passwort:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                {loginStatus && <div><Link href='/dashboard'>Dashboard</Link></div>}

                <button type="submit" style={{ marginTop: '20px' }}>Einloggen</button>
            </form>
        </div>
    );
}