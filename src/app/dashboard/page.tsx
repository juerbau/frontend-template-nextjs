// app/dashboard/TodoForm.tsx
"use client";

import { useState } from 'react';
import { getCsrfToken } from '@/utils/csrf';

export default function TodoForm() {
    const [task, setTask] = useState('');
    const [status, setStatus] = useState('Bereit für neue Aufgabe.');

    const handleCreateTodo = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // --- VORBEREITUNG UND CSRF-TOKEN-CHECK ---
        setStatus('Sende Anfrage...');

        // 1. Hole den URL-DECODIERTEN CSRF-Token
        const csrfToken = getCsrfToken();

        if (!csrfToken) {
            setStatus('❌ Fehler: CSRF-Token fehlt. Bitte zuerst einloggen.');
            return;
        }

        try {
            // --- DIREKTER POST-REQUEST AN LARAVEL ---
            const response = await fetch('http://localhost:8000/api/todos', {
                method: 'POST',
                credentials: 'include', // Nötig, um 'laravel_session' mitzusenden
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    // 2. KRITISCH: Senden des dekodierten Tokens im Header
                    'X-XSRF-TOKEN': csrfToken,
                },
                body: JSON.stringify({ task }),
            });

            // Lese die Antwort, um die Statusmeldung zu erhalten
            const data = await response.json();

            if (response.ok) {
                setStatus(`✅ Erfolgreich: ${data.message} | Aufgabe: ${data.task} | User ID: ${data.user_id}`);
                setTask('');
            } else if (response.status === 419 || response.status === 403) {
                // HIER würde der Fehler auftreten, wenn der Token fehlt/falsch ist
                setStatus(`❌ FEHLER ${response.status}: CSRF-Token ungültig oder Session abgelaufen.`);
            } else {
                setStatus(`❌ FEHLER ${response.status}: ${data.message || 'Unbekannter API-Fehler'}`);
            }

        } catch (error) {
            setStatus('❌ Netzwerkfehler: Konnte Laravel-Server nicht erreichen.');
            console.error('Fetch error:', error);
        }
    };


    return (
        <form onSubmit={handleCreateTodo}>
            <h3>CSRF/Sanctum POST Test</h3>
            <p>Testet den direkten Browser-zu-Laravel POST mit dem `X-XSRF-TOKEN` Header.</p>
            <input
                type="text"
                value={task}
                onChange={(e) => setTask(e.target.value)}
                placeholder="Aufgabenbeschreibung eingeben..."
                required
            />
            <button type="submit" disabled={!task}>Aufgabe speichern (POST)</button>
            <p>{status}</p>
        </form>
);
}