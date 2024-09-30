<script>
    import user from '../user';
    import {navigateTo} from '../utils.js';

    let username = '';
    let password = '';
    let currentError = null;

    const login = () => {
        fetch('http://127.0.0.1:3030/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: username,
                password: password
            })
        })
        .then((response) => {
            if (response.status < 299) {
                return response.json();
            } 

            if (response.status > 299) {
                currentError = 'Server response error, contact your administrator';
            }
        })
        .then((data) => {
            if (data) {
                user.update(val => val = {...data});
            }
        })
        .catch((error) => {
            currentError = error;
            console.log("Error loggin in: ", error);
        })
    }
</script>

<style>
    form {
        max-width: 600px;
        margin: 50px auto;
        padding: 20px;
        border: 1px solid rgba(83,109,130,255);
        border-radius: 10px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        background-color: rgba(83,109,130,255);
    }

    div {
        margin-bottom: 15px;
    }

    label {
        display: block;
        margin-bottom: 5px;
        font-weight: bold;
    }

    input[type="text"] {
        width: 100%;
        padding: 10px;
        border: 1px solid #ccc;
        border-radius: 5px;
        box-sizing: border-box;
    }

    .login-button {
        width: 100%;
        padding: 10px;
        border: none;
        border-radius: 5px;
        background-color: rgba(38,55,77,255);
        color: white;
        font-size: 16px;
        cursor: pointer;
        margin-top: 3%;
    }

    .register-button {
        display: block;
        margin-top: 15px;
        text-align: center;
        color: #000;
        text-decoration: none;
    }

    button:hover {
        background-color: rgb(2, 8, 70);
    }

    .forgot-password {
        display: block;
        margin-top: 10px;
        text-align: left;
        color: #000;
        text-decoration: none;
    }

    .forgot-password:hover {
        text-decoration: underline;
    }

    .titleform {
        margin-top: 1%;
        text-align: center;
        background-color: rgba(83,109,130,255);
    }
</style>

<form on:submit|preventDefault={login}>
    <div>
        <h2 class="titleform"> Log In </h2>
        <div>
            <label for="username">Username</label>
            <input type="text" id="username" bind:value={username} placeholder="Username"/>
        </div>

        <div>
            <label for="password">Password</label>
            <input type="text" id="password" bind:value={password} placeholder="Password"/>
        </div>
        <a href="/forgot-password" class="forgot-password">Forgot Password?</a>
        <button class='login-button' on:click={() => navigateTo('/dashboard')}>Login</button>
        <div class="register-button">
            Don't have an account? <a href="/registration">Register DAC Analyst</a>
        </div>
    </div>
</form>