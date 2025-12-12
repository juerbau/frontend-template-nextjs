// src/components/TestButton.tsx
'use client';

import api from '@/utils/api';
import { isAxiosError } from 'axios';

// --- 1. Funktion zum Starten des vollständigen Tests ---
async function runFullTest() {
    console.log('--- STARTE DREISTUFIGEN AUTH-TEST ---');
    try {
        // SCHRITT 1: CSRF-Cookie holen
        console.log('1. Hole CSRF-Cookie...');
        // await api.get('/sanctum/csrf-cookie');
        await api.get('/sanctum/csrf-cookie');
        console.log('1. Erfolgreich: XSRF-TOKEN Cookie gesetzt.');
        console.log(document.cookie);

        // SCHRITT 2: Login durchführen
        console.log('2. Versuche Login (POST /api/login)...');

        // **WICHTIG:** Ganzen Pfad '/api/login' verwenden, da baseURL nur 'http://localhost:8000' ist.
        const loginResponse = await api.post('/api/login', {
            email: 'test@example.com',
            password: 'password'
        });

        console.log('2. Erfolgreich: Login-Status:', loginResponse.status);
        console.log('   Prüfe jetzt das "laravel_session" Cookie!');

        // SCHRITT 3: Geschützte Route testen
        console.log('3. Teste geschützte Route (/api/user)...');
        const userResponse = await api.get('/api/user');

        console.log('3. Erfolgreich: Autorisierung bestätigt!');
        console.log('   Benutzerdaten:', userResponse.data);

        alert('SUCCESS! Der gesamte Sanctum-Stack funktioniert. CORS, Login und Session sind intakt.');

    } catch (error) {
        if (isAxiosError(error)) {
            console.error('❌ TEST FEHLGESCHLAGEN. Status:', error.response?.status, 'Daten:', error.response?.data);
            alert(`❌ FEHLER bei Status ${error.response?.status}. Login oder Autorisierung fehlgeschlagen.`);
        } else {
            console.error('❌ UNBEKANNTER FEHLER:', error);
            alert('❌ Ein unbekannter Netzwerkfehler ist aufgetreten.');
        }
    }
}


export default function TestButton() {
    return (
        <button
            type="button"
            onClick={runFullTest} // Ruft die neue All-in-One Funktion auf
            style={{ padding: '10px', background: 'green', color: 'white', border: 'none', cursor: 'pointer' }}
        >
            Sanctum-Test (3 Schritte)
        </button>
    );
}