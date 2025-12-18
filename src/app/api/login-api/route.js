import { NextResponse } from 'next/server';

const LARAVEL_LOGIN_URL = 'http://localhost:8000/api/login-api';

export async function POST(req) {


    try {
        // WICHTIG: Den Body im App Router muss man erst auslesen!
        const body = await req.json();

        // 3. Request an Laravel
        const laravelResponse = await fetch(LARAVEL_LOGIN_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify(body), // Hier die ausgelesenen Daten senden
        });

        // 4. Laravel Fehler abfangen
        if (!laravelResponse.ok) {
            const errorData = await laravelResponse.json();
            console.error('Laravel Fehler Details:', errorData);
            return NextResponse.json(
                { message: 'Login bei Laravel fehlgeschlagen', errors: errorData.errors },
                { status: laravelResponse.status }
            );
        }

        // 5. Token und User von Laravel holen
        const { token, user } = await laravelResponse.json();

        // 6. Die Antwort für das Frontend vorbereiten
        const nextResponse = NextResponse.json(
            { user, message: 'Login erfolgreich' },
            { status: 200 }
        );

        // 7. Cookie setzen (HttpOnly!)
        nextResponse.cookies.set('api_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            path: '/',
            maxAge: 60 * 60 * 24 * 7,
        });

        return nextResponse;

    } catch (error) {
        console.error('Next.js Proxy Error:', error);
        return NextResponse.json({ message: 'Server Fehler im Proxy' }, { status: 500 });
    }
}