<script>
    import {navigateTo} from '../../utils.js';

    let firstName = '';
    let lastName = '';
    let token = '';
    let email = '';
    let password = '';

    const goToLogin = () => {
        navigateTo('../');
    };

    const generateToken = () => {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = (Math.random() * 16) | 0,
                v = c === 'x' ? r : (r & 0x3) | 0x8;
            return v.toString(16);
        });
    };

    const registerUser = async () => {
        token = generateToken()

        try {
            const response = await fetch('http://127.0.0.1:8080/registration', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    firstName,
                    lastName,
                    email,
                    password,
                    token
                }),
            });

            const result = await response.json();

            if (response.ok) {
                alert('New DAC Analyst User Registered!');
                console.log("Success", result)
            } else {
                alert('Unsuccsessful request to register new DAC Analyst');
                console.log("Error", result)
            }
        } catch (error) {
            console.error('Error:', error);
            alert('There was an issue registering your user');
            location.reload();
        }
    };
    
</script>

<style>
    form {
        max-width: 400px;
        margin: 50px auto;
        margin-top: 3%;
        padding: 50px;
        border: 1px solid rgba(83,109,130,255);
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
        margin-top: 8px;
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

    input[type="password"] {
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
        background-color: rgba(38,55,77,255);
        color: white;
        font-size: 16px;
        cursor: pointer;
    }

    .updateButton:hover {
        background-color: rgb(2, 8, 70);
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
        background-color: rgb(177, 2, 2);
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
    
</style>

<h1> INFILTR8 </h1>
<form on:submit|preventDefault={registerUser}>
    <div>
        <h2 class="titleform"> Change Password </h2>
        <div class="register-info">
            <label for="firstName">First Name</label>
            <input type="text" id="firstName" placeholder="First Name" bind:value={firstName} required/>

<<<<<<< HEAD
            <label for="lastName">Last Name</label>
            <input type="text" id="lastName" placeholder="Last Name" bind:value={lastName} required/>

            <label for="email"> DAC Analyst Email</label>
            <input type="text" id="email" placeholder="DAC Analyst Email" bind:value={email} required/>
=======
            <label for="email">Email</label>
            <input type="text" id="email" placeholder="Email" bind:value={email} />
>>>>>>> 438112f5b619340558d85b5f37e25199ba800d0d

            <label for="password">Password</label>
            <input type="password" id="password" placeholder="Password" bind:value={password} required/>
        </div>

        <button class="updateButton" type="submit" > Register Analyst </button>
    </div>
    <input class="returnButton" type="button" value="Back to Login" on:click={goToLogin} /> 

</form>