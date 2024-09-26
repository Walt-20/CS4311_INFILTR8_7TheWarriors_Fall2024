<script>
    import {navigateTo} from '../../utils.js';

    let username = '';
    let password = '';
    let currentError = null;

    const updatePassword = () => {
        // TO BE UPDTED WHEN DATABASE IS INTEGRATED
        navigateTo('/')
    }
    

</script>

<style>
    form {
        max-width: 400px;
        margin: 50px auto;
        margin-top: 3%;
        padding: 50px;
        border: 1px solid rgb(77, 76, 76);
        border-radius: 10px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        background-color: rgba(83,109,130,255);
    }

    div {
        margin-bottom: 15px;
        background-color: rgba(83,109,130,255);
    }

    label {
        display: block;
        margin-bottom: 5px;
        font-weight: bold;
        background-color: rgba(83,109,130,255);
    }

    input[type="text"] {
        width: 100%;
        padding: 10px;
        border: 1px solid #ccc;
        border-radius: 5px;
        box-sizing: border-box;
        background-color: white;
    }

    .updateButton {
        margin-top: 3%;
        width: 100%;
        padding: 10px;
        border: none;
        border-radius: 5px;
        background-color: white;
        color: black;
        font-size: 16px;
        cursor: pointer;
    }

    .updateButton:hover {
        background-color: #FFA500;
    }

    .returnButton {
        margin-top: 3%;
        width: 50%;
        padding: 10px;
        margin-left: 25%;
        border: none;
        border-radius: 5px;
        background-color: white;
        font-size: 12px;
    }

    .returnButton:hover {
        background-color: #FFA500;
    }

    h1 {
        text-align: center;
        margin-top: 3%;
        color: rgba(156,178,190,255);
    }
    .titleform {
        margin-top: 1%;
        text-align: center;
        background-color: rgba(83,109,130,255);
    }
    .login-background {
        background-color: rgba(83,109,130,255);
    }
</style>

<h1> INFILTR8 </h1>
<form on:submit|preventDefault={updatePassword}>
    <div>
        <h2 class="titleform"> Change Password </h2>
        <div class="login-background">
            <label for="username">Username</label>
            <input type="text" id="username" placeholder="Username" bind:value={username} />
        </div>

        <div class="login-background">
            <label for="password">Password</label>
            <input type="text" id="password" placeholder="Password" bind:value={password} />
        </div>
        <button class="updateButton" type="submit" > Update Password </button>
    </div>
    <input class="returnButton" type="button" value="Back to Login" on:click={updatePassword} /> 

</form>