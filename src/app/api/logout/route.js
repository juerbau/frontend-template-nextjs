export async function POST() {
    try {
        const response = await fetch('http://localhost:8000/api/logout', {
            method: 'POST',
            credentials: 'include',
        });

        return new Response(null, {
            status: response.status,
        });
    } catch (e) {
        return Response.json(
            { message: 'Logout failed', error: e.message },
            { status: 500 }
        );
    }
}
