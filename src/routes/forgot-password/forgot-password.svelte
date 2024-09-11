<script>
    import user from '../user';
    import {navigateTo} from '../utils.js';

    let username = '';
    let password = '';
    let currentError = null;

    const updatePassword = () => {
        // TO BE UPDTED WHEN DATABASE IS INTEGRATED
    }
</script>

<style>
    body {
        background-color: gray;
    }

    form {
        max-width: 400px;
        margin: 50px auto;
        margin-top: 3%;
        padding: 20px;
        border: 1px solid #ccc;
        border-radius: 10px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        background-color: #fff;
    }

    div {
        margin-bottom: 15px;
        background-color: white;
    }

    label {
        display: block;
        margin-bottom: 5px;
        font-weight: bold;
        background-color: white;
    }

    input[type="text"] {
        width: 100%;
        padding: 10px;
        border: 1px solid #ccc;
        border-radius: 5px;
        box-sizing: border-box;
        background-color: white;
    }

    button {
        width: 100%;
        padding: 10px;
        border: none;
        border-radius: 5px;
        background-color: #007BFF;
        color: white;
        font-size: 16px;
        cursor: pointer;
    }

    button:hover {
        background-color: #0056b3;
    }

    .forgot-password {
        display: block;
        margin-top: 10px;
        text-align: right;
        color: #007BFF;
        text-decoration: none;
    }

    .forgot-password:hover {
        text-decoration: underline;
    }
    h1 {
        text-align: center;
        margin-top: 5%;
        color: #39FF14;
    }
    .titleform {
        text-align: center;
        background-color: white;
    }
    .login-background {
        background-color: white;
    }
</style>

<h1> INFILTR8 </h1>
<form on:submit|preventDefault={updatePassword}>
    <div>
        <h2 class="titleform"> Change Password </h2>
        <div class="login-background">
            <label for="username">Username</label>
            <input type="text" id="username" placeholder="Username" bind:value={username} required/>
        </div>

        <div class="login-background">
            <label for="password">Password</label>
            <input type="text" id="password" placeholder="Password" bind:value={password} required/>
        </div>
        <button type="submit" > Update Password </button>
    </div>
</form>