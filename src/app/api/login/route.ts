// app/login/route.ts

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

// Die Basis-URL Ihres Laravel-Backends
const LARAVEL_BASE_URL = 'http://localhost:8000';

/**
 * Route Handler für POST /login (interner Next.js Endpunkt)
 * Leitet die Login-Anfrage an den Laravel-Backend-Endpunkt /login weiter.
 */
export async function POST(request: Request) {
    // 1. Anmeldedaten aus dem eingehenden Request des Frontends auslesen
    const credentials = await request.json();

    try {
        // 2. Server-zu-Server-Anfrage an Laravel senden
        // Wir verwenden KEINE CORS-Optionen, da es Server-zu-Server ist.
        const response = await fetch(`${LARAVEL_BASE_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                // Da der Login-Aufruf vom Next.js Server kommt,
                // müssen wir hier KEINEN X-XSRF-TOKEN senden, da es kein Browser-POST ist.
            },
            body: JSON.stringify(credentials),
        });

        // 3. Antwort von Laravel verarbeiten

        // Wenn Laravel einen Fehler (z.B. 422 Validierungsfehler oder 401 Unbefugt) zurückgibt,
        // leiten wir diesen Status direkt an das Frontend weiter.
        if (!response.ok) {
            const errorData = await response.json();
            return NextResponse.json(errorData, { status: response.status });
        }

        // 4. KRITISCH: Cookies von Laravel extrahieren und an den Browser des Benutzers weitergeben

        // Next.js kann die 'Set-Cookie'-Header von der Laravel-Antwort lesen.
        const setCookieHeaders = response.headers.getSetCookie();

        // Erstellen Sie die Antwort, die an das Frontend gesendet wird
        const nextResponse = NextResponse.json({ message: 'Login erfolgreich.' }, { status: 200 });

        // Fügen Sie jeden Cookie einzeln in die Next.js-Antwort ein,
        // damit der Browser sie speichert.
        setCookieHeaders.forEach(cookie => {
            // Die cookies().set() Methode ist die sicherste Art, Cookies im App Router zu setzen
            // ABER: Da wir die exakten Header-Strings beibehalten wollen (mit HttpOnly, Secure, etc.),
            // leiten wir den Set-Cookie-Header direkt über die Response weiter:
            nextResponse.headers.append('Set-Cookie', cookie);
        });

        return nextResponse;

    } catch (error) {
        console.error('Fehler bei der Proxy-Anfrage an Laravel Login:', error);
        return NextResponse.json({ message: 'Interner Serverfehler.' }, { status: 500 });
    }
}