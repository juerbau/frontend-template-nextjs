"use client";

//import { useState } from "react";
import {LoginButton} from "@/app/components/LoginButton";
import {GetUserButton} from "@/app/components/GetUserButton";
import {LogoutButton} from "@/app/components/LogoutButton";
import Link from "next/link";

export default function Page() {
    // const [me, setMe] = useState<any>(null);
    //
    // async function getCsrf() {
    //     await fetch("/api/csrf", {
    //         method: "GET",
    //         credentials: 'include'
    //     });
    //     console.log("CSRF geholt");
    //     console.log(document.cookie);
    // }
    //
    // async function login() {
    //     const res = await fetch('/api/login', {
    //         method: 'POST',
    //         headers: {
    //             'Content-Type': 'application/json'
    //         },
    //         body: JSON.stringify({
    //             email: 'test@example.com',
    //             password: 'password'
    //         }),
    //     });
    //
    //     const data = await res.json();
    //     console.log('Login Response:', data);
    // }
    //
    // async function loadMe() {
    //     const res = await fetch("/api/me", { method: "GET" });
    //     const data = await res.json();
    //     console.log("ME:", data);
    //     setMe(data);
    // }
    //
    // async function logout() {
    //     const res = await fetch('http://localhost:8000/api/logout', {
    //         method: 'POST',
    //         credentials: 'include',
    //         headers: {
    //             'Accept': 'application/json',
    //         },
    //     });
    //
    //     if (!res.ok) {
    //         console.error('Logout failed:', res.status);
    //         return;
    //     }
    //
    //     console.log('Logged out');
    //
    // }

    return (
        <div>
            <h1>Zugang mittels API-Token</h1>
            <p><Link href='/login'>login</Link></p>
            <p><Link href='login-api'>API Login</Link></p>
            {/*<div>*/}^
            {/*    <button onClick={getCsrf}>Get CSRF</button>*/}
            {/*</div>*/}
            {/*<div>*/}
            {/*    <button onClick={login}>Login</button>*/}
            {/*</div>*/}
            {/*<div>*/}
            {/*    <button onClick={loadMe}>/api/me</button>*/}
            {/*</div>*/}
            {/*<div>*/}
            {/*    <button onClick={logout}>Logout</button>*/}
            {/*</div>*/}

            {/*{me && (*/}
            {/*    <pre>{JSON.stringify(me, null, 2)}</pre>*/}
            {/*)}*/}
        </div>
    );
}
