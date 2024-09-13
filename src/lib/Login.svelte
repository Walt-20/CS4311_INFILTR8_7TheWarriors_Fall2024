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
        max-width: 400px;
        margin: 50px auto;
        padding: 20px;
        border: 1px solid #ccc;
        border-radius: 10px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        background-color: #616161;
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

    button {
        width: 100%;
        padding: 10px;
        border: none;
        border-radius: 5px;
        background-color: #b9f6ca;
        color: black;
        font-size: 16px;
        cursor: pointer;
    }

    button:hover {
        background-color: #69f0ae;
    }

    .forgot-password {
        display: block;
        margin-top: 10px;
        text-align: right;
        color: #000;
        text-decoration: none;
    }

    .forgot-password:hover {
        text-decoration: underline;
    }
</style>

<form on:submit|preventDefault={login}>
    <div>
        <div>
            <label for="username">Username</label>
            <input type="text" id="username" bind:value={username} />
        </div>

        <div>
            <label for="password">Password</label>
            <input type="text" id="password" bind:value={password} />
        </div>
        <button  on:click={() => navigateTo('/dashboard')}>Login</button>
        <a href="/forgot-password" class="forgot-password">Forgot Password?</a>
    </div>
</form>