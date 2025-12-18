'use client';

import {getCsrfToken} from "@/utils/csrf";

export function GetUserButton() {
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
        <button onClick={handleGetUser}>
            GetUser
        </button>
    );
}
