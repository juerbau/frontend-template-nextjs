'use client';

export function TestButton() {
    async function handleTest() {
        try {
            console.log('1️⃣ CSRF holen');
            await fetch('http://localhost:8000/sanctum/csrf-cookie', {
                credentials: 'include',
            });

            console.log('2️⃣ Login');
            const loginRes = await fetch('http://localhost:8000/api/login', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
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

            console.log('3️⃣ User holen');
            const userRes = await fetch('http://localhost:8000/api/user', {
                credentials: 'include',
                headers: {
                    'Accept': 'application/json',
                },
            });

            if (!userRes.ok) {
                console.error('❌ User nicht authentifiziert', userRes.status);
                return;
            }

            const user = await userRes.json();
            console.log('✅ User:', user);


            console.log('4️⃣ Logout');
            const logoutRes = await fetch('http://localhost:8000/api/logout', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Accept': 'application/json',
                },
            });

            if (!logoutRes.ok) {
                console.error('❌ Logout fehlgeschlagen', logoutRes.status);
                return;
            }

            console.log('✅ Logout erfolgreich');
        } catch (e) {
            console.error('🔥 Fehler im Test-Flow:', e);
        }
    }

    return (
        <button onClick={handleTest}>
            Test
        </button>
    );
}
