'use client';


const NEXTJS_LOGIN_URL = '/http/api/login-api';

export function LoginButton() {
    async function handleLogin() {

        try {
            console.log('Login gestartet');

            const response = await fetch(NEXTJS_LOGIN_URL, {
                method: 'POST',
                //credentials: 'include', // Notwendig, damit der Browser den 'Set-Cookie' Header akzeptiert
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({
                    email: 'test@example.com',
                    password: 'password',
                }),
            });

            if (!response.ok) {
                console.error('❌ Login fehlgeschlagen', response.status);
                return;
            }

            console.log('Login erfolgreich');
            const data = await response.json()
            console.log(data.user.name);

            return data;

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
