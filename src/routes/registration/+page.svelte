<script>
    import { navigateTo } from '../../utils.js';

    let username = '';
    let token = '';
    let password = '';
    let confirmPassword = '';
    let errorMessage = '';

    const goToLogin = () => {
        navigateTo('../');
    };

    const generateToken = () => {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = (Math.random() * 16) | 0,
                v = c === 'x' ? r : (r & 0x3) | 0x8;
            return v.toString(16);
        });
    };

    // Function to validate password based on STIG requirements
    const validatePassword = (password) => {
        const minLength = 15;
        const hasUppercase = /[A-Z]/.test(password);
        const hasLowercase = /[a-z]/.test(password);
        const hasNumber = /\d/.test(password);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

        if (password.length < minLength) {
            return `Password must be at least ${minLength} characters long.`;
        }
        if (!hasUppercase) {
            return 'Password must contain at least one uppercase letter.';
        }
        if (!hasLowercase) {
            return 'Password must contain at least one lowercase letter.';
        }
        if (!hasNumber) {
            return 'Password must contain at least one digit.';
        }
        if (!hasSpecialChar) {
            return 'Password must contain at least one special character.';
        }
        return '';
    };

    const registerUser = async () => {
    errorMessage = '';

    if (password !== confirmPassword) {
        errorMessage = "Passwords do not match. Please try again.";
        return;
    }

    const passwordValidationMessage = validatePassword(password);
    if (passwordValidationMessage) {
        errorMessage = passwordValidationMessage;
        return;
    }

    token = generateToken();

    try {
        const response = await fetch('http://127.0.0.1:8080/registration', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username,
                password,
                token
            }),
        });

        const result = await response.json();

        if (response.ok) {
            alert('New DAC Analyst User Registered!');
            console.log("Success", result);

            alert(`Copy and paste your token in your local machine, your generated token is: ${token}`);

            navigateTo('/login');
        } else {
            errorMessage = result.error || 'Unsuccessful request to register new DAC Analyst';
            console.log("Error", result);
        }
    } catch (error) {
        console.error('Error:', error);
        errorMessage = 'There was an issue registering your user';
        location.reload();
    }
};

</script>

<div class="flex justify-center items-center h-screen bg-white dark:bg-gray-800">
    <form class="max-w-md w-full bg-gray-100 dark:bg-gray-700 shadow-md rounded-lg p-8" on:submit|preventDefault={registerUser}>
        <h2 class="text-2xl font-semibold text-center mb-6 dark:text-white">Registration</h2>

        {#if errorMessage}
            <div class="mb-4 text-red-600">{errorMessage}</div>
        {/if}

        <div class="mb-4">
            <label class="block text-gray-900 dark:text-white" for="username">Username</label>
            <input type="text" id="username" bind:value={username} placeholder="Enter Username" class="mt-1 block w-full p-2 border rounded" required/>
        </div>

        <div class="mb-4">
            <label class="block text-gray-900 dark:text-white" for="password">Password</label>
            <input type="password" id="password" bind:value={password} placeholder="Enter Password" class="mt-1 block w-full p-2 border rounded" required/>
        </div>

        <div class="mb-4">
            <label class="block text-gray-900 dark:text-white" for="confirmPassword">Re-Enter Password</label>
            <input type="password" id="confirmPassword" bind:value={confirmPassword} placeholder="Re-Enter Password" class="mt-1 block w-full p-2 border rounded" required/>
        </div>

        <button class="mt-6 w-full py-2 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 text-center">
            Register Analyst
        </button>

        <button type="button" class="mt-6 w-full py-2 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 text-center" on:click={goToLogin}>
            Back to Login
        </button>
    </form>
</div>
