'use client';

export function LogoutButton() {
    async function handleLogout() {

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

        const csrfToken = getDecodedCsrfToken();

        try {

            console.log('4️⃣ Logout');
            const logoutRes = await fetch('http://localhost:8000/logout', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Accept': 'application/json',
                    'X-XSRF-TOKEN': csrfToken
                },
            });

            if (!logoutRes.ok) {
                console.error('❌ Logout fehlgeschlagen', logoutRes.status);
                return;
            }

            console.log('✅ Logout erfolgreich');
        } catch (e) {
            console.error('🔥 Fehler im Logout:', e);
        }
    }

    return (
        <button onClick={handleLogout}>
            Logout
        </button>
    );
}
