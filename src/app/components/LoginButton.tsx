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
                console.log(match);
                console.log(match[2]);
                return decodeURIComponent(match[2]);
            }
            return '';
        }

        try {
            console.log('1️⃣ CSRF holen');
            await fetch('http://localhost:8000/sanctum/csrf-cookie', {
                credentials: 'include',
            });
            //console.log(document.cookie);

            console.log('2️⃣ Login');
            const csrfToken = getDecodedCsrfToken();
            console.log(csrfToken);

            if (!csrfToken) {
                console.error('Kein XSRF-Token gefunden');
            } else {
                console.log('XSRF-Token gefunden');
            }

            const loginRes = await fetch('http://localhost:8000/login', {
                method: 'POST',
                credentials: 'include',

                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-XSRF-TOKEN': csrfToken
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
