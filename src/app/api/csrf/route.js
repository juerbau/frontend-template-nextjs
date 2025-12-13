import { NextResponse } from 'next/server';

export async function GET() {
    const response = await fetch(
        'http://localhost:8000/sanctum/csrf-cookie',
        {
            method: 'GET',
            credentials: 'include',
        }
    );

    // Cookies an den Browser weiterreichen
    const headers = new Headers();
    response.headers.forEach((value, key) => {
        if (key.toLowerCase() === 'set-cookie') {
            headers.append('set-cookie', value);
        }
    });

    return new NextResponse(null, {
        status: 204,
        headers,
    });
}
