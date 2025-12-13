'use client';

export function LoginButton() {
    async function handleLogin() {

        function getDecodedCsrfToken() {
            const name = 'XSRF-TOKEN';
            // Sucht das Cookie 'XSRF-TOKEN' im document.cookie String
            const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));

            if (match) {
                // match[2] enthält den kodierten Wert (z.B. mit %2F)
                // **DIES IST DER ENTSCHEIDENDE SCHRITT:**
                return decodeURIComponent(match[2]);
            }
            return '';
        }

        try {
            console.log('1️⃣ CSRF holen');
            await fetch('http://localhost:8000/sanctum/csrf-cookie', {
                credentials: 'include',
            });
            console.log(document.cookie);

            const csrfToken = getDecodedCsrfToken();

            console.log('2️⃣ Login');

            const xsrfToken = csrfToken;

            if (!xsrfToken) {
                console.error('Kein XSRF-Token gefunden');
            } else {
                console.log(xsrfToken);
            }

            const loginRes = await fetch('http://localhost:8000/login', {
                method: 'POST',
                credentials: 'include',

                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-XSRF-TOKEN': xsrfToken
                },

                body: JSON.stringify({
                    email: 'test@example.com',
                    password: 'password',
                }),
            });

            if (!loginRes.ok) {
                console.error('❌ Login fehlgeschlagen', loginRes.status);
                return;
            }
            console.log('Login erfolgreich');

        } catch (e) {
            console.error('🔥 Fehler im Login', e);
        }
    }

    return (
        <button onClick={handleLogin}>
            Login
        </button>
    );
}
