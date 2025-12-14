// app/api/logout/route.ts

import { NextResponse } from 'next/server';

const LARAVEL_BASE_URL = 'http://localhost:8000';

/**
 * Route Handler für POST /api/logout (interner Next.js Endpunkt)
 * Leitet die Logout-Anfrage an den Laravel-Backend-Endpunkt /logout weiter.
 */
export async function POST(request: Request) {
    try {
        // ... (fetch-Aufruf an Laravel) ...
        const response = await fetch(`${LARAVEL_BASE_URL}/logout`, {
            method: 'POST',
        });

        // Fehlerprüfung von Laravel
        if (!response.ok) {
            console.error('Laravel Logout Fehler:', response.status);
            return NextResponse.json({ message: 'Logout fehlgeschlagen.' }, { status: response.status });
        }

        // --- HIER BEGINNT DER NEUE, EXPLIZITE LÖSCHMECHANISMUS ---

        // 1. Erstellen der Basis-Antwort
        const nextResponse = NextResponse.json({ message: 'Logout erfolgreich.' }, { status: 200 });

        // 2. Session-Cookie manuell löschen (KRITISCH: Path: '/')
        // Der Cookie muss mit den Attributen gelöscht werden, unter denen er gesetzt wurde.
        nextResponse.cookies.set('laravel_session', '', {
            maxAge: 0, // Lässt das Cookie sofort ablaufen
            path: '/', // MUSS exakt den Pfad / verwenden
            httpOnly: true, // Muss mit der ursprünglichen Einstellung übereinstimmen (empfohlen)
            secure: process.env.NODE_ENV === 'production', // MUSS mit der ursprünglichen Einstellung übereinstimmen
        });

        // 3. XSRF-TOKEN manuell löschen (zur Sicherheit)
        nextResponse.cookies.delete('XSRF-TOKEN');

        // 4. Andere Set-Cookie-Header von Laravel weiterleiten (optional, fängt Reste ab)
        const setCookieHeaders = response.headers.getSetCookie();
        setCookieHeaders.forEach(cookie => {
            // Nur weiterleiten, wenn wir sie nicht schon manuell behandelt haben
            if (!cookie.includes('laravel_session=') && !cookie.includes('XSRF-TOKEN=')) {
                nextResponse.headers.append('Set-Cookie', cookie);
            }
        });

        return nextResponse;
    } catch (error) {
        console.error('Fehler bei der Proxy-Anfrage an Laravel Logout:', error);
        return NextResponse.json({ message: 'Interner Serverfehler beim Logout.' }, { status: 500 });
    }
}