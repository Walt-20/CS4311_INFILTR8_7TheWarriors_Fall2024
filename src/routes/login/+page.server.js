// fetch('http://127.0.0.1:8080/login', {
//     method: 'POST',
//     headers: {
//         'Content-Type': 'application/json',
//     },
//     body: JSON.stringify({
//         username: username,
//         password: password,
//     }),
// })

import { redirect,fail, error } from "@sveltejs/kit"
import {addLog } from "$lib/logStore";

export const actions = {
	login: async ({ cookies, request }) => {
        console.log("pinged")
        const data = await request.formData();
        console.log(data)
		const username = data.get('username');
		const password = data.get('password');
        console.log(username)
        console.log(password)
        let success = false;
        let errorMessage = "";
        try{
            const response = await fetch('http://127.0.0.1:8080/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: username,
                    password: password,
                }),
            })
            if (response.status === 200) {
                console.log("Successfully logged in")
                addLog(`User "${username}" logged in successfully.`);
                cookies.set("auth", username, {
                    path: "/",
                    httpOnly: true,
                    sameSite: "strict",
                    secure: process.env.NODE_ENV === "production",
                    maxAge: 60 * 60 , // 1 hour
                })
                success = true;
            } else if (response.status === 401) {
                errorMessage = 'Invalid username or password';
                addLog(`Failed login attempt for user "${username}". Error: ${errorMessage}`);
            } else {
                errorMessage = 'Server response error, contact your administrator';
                addLog(`Failed login attempt for user "${username}". Error: ${errorMessage}`);
            }
        } catch(error) {
            console.log(error)
            errorMessage = 'An error occurred, please try again.';
            addLog(`Error logging in for user "${username}". Details: ${errorMessage}`);
        };

        if (success){
            throw redirect(303,'/dashboard');
        } else {
            return fail(400,{
                message: errorMessage,
            })
        }
	},
}