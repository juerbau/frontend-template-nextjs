'use client';

export function GetUserButton() {
    async function handleGetUser() {
        try {

            console.log('3️⃣ User holen');
            const userRes = await fetch('http://localhost:8000/user', {
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
