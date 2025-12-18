'use client'

import {LoginButton} from "@/app/components/LoginButton";
import {GetUserButton} from "@/app/components/GetUserButton";
import {LogoutButton} from "@/app/components/LogoutButton";

export default function ApiLogin() {

    return (
        <>
            <div><LoginButton/></div>
            <div><GetUserButton/></div>
            <div><LogoutButton/></div>
        </>

    )
}