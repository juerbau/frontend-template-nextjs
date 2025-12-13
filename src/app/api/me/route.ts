export async function GET() {
    const res = await fetch("http://localhost:8000/api/me", {
        method: "GET",
        credentials: "include",
        headers: { Accept: "application/json" }
    });

    const data = await res.json();
    return new Response(JSON.stringify(data), { status: res.status });
}
