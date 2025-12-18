// utils/csrf.ts

/*try {
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

} catch (e) {
    console.error('🔥 Fehler', e);
}*/

/**
 * Liest den XSRF-TOKEN-Cookie aus dem Browser-Speicher (document.cookie),
 * dekodiert ihn (da er URL-encoded ist) und gibt den sauberen String zurück.
 * * Diese Funktion muss in einem Client Component oder einem Client Module aufgerufen werden.
 * * @returns {string | null} Der dekodierte CSRF-Token oder null, falls nicht gefunden oder Fehler auftritt.
 */
export function getCsrfToken(): string | null {
    // Stellen Sie sicher, dass wir uns im Browser-Kontext befinden,
    // da 'document' auf dem Server nicht existiert (wichtig für Next.js).
    if (typeof document === 'undefined') {
        console.warn("getCsrfToken() wurde außerhalb des Browser-Kontexts aufgerufen.");
        return null;
    }

    // Zugriff auf alle Cookies des aktuellen Dokuments
    const cookieString: string = document.cookie;

    // Regulärer Ausdruck, um den Wert des XSRF-TOKENs zu finden.
    // Es wird der Wert nach 'XSRF-TOKEN=' bis zum nächsten Semikolon oder Stringende erfasst.
    const match: RegExpMatchArray | null = cookieString.match(/XSRF-TOKEN=([^;]+)/);

    if (match && match[1]) {
        // match[1] ist der URL-kodierte Wert
        try {
            // Dekodierung des Tokens, um URL-Zeichen (%3D, etc.) zu entfernen,
            // da Laravel den dekodierten Wert im Header erwartet.
            return decodeURIComponent(match[1]);
        } catch (e) {
            console.error("Fehler beim Dekodieren des CSRF-Tokens:", e);
            return null;
        }
    }

    return null;
}