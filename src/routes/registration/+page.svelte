<script>
    import {navigateTo} from '../../utils.js';

    let firstName = '';
    let lastName = '';
    let username = '';
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


<div class="flex justify-center items-center h-screen bg-white dark:bg-gray-800">
    <form class="max-w-md w-full bg-gray-100 dark:bg-gray-700 shadow-md rounded-lg p-8" on:submit|preventDefault={token}>
        <h2 class="text-2xl font-semibold text-center mb-6 dark:text-white">Registration</h2>
        
        <div class="mb-4">
            <label class="block text-gray-900 dark:text-white" for="firstName">First Name</label>
            <input type="text" id="firstName" bind:value={firstName} placeholder="First Name" class="mt-1 block w-full p-2 border rounded" required/>
        </div>

        <div class="mb-4">
            <label class="block text-gray-900 dark:text-white" for="lastName">Last Name</label>
            <input type="text" id="lastName" bind:value={lastName} placeholder="Last Name" class="mt-1 block w-full p-2 border rounded" required/>
        </div>

        <div class="mb-4">
            <label class="block text-gray-900 dark:text-white" for="username">Username</label>
            <input type="text" id="username" bind:value={username} placeholder="Enter Username" class="mt-1 block w-full p-2 border rounded" required/>
        </div>
        
        <div class="mb-4">
            <label class="block text-gray-900 dark:text-white" for="password">Password</label>
            <input type="text" id="password" bind:value={password} placeholder="Enter Password" class="mt-1 block w-full p-2 border rounded" required/>
        </div>

        <button class="mt-6 w-full py-2 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 text-center">
            Register Analyst
        </button>

        <button type="button" class="mt-6 w-full py-2 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 text-center" on:click={goToLogin}>
            Back to Login
        </button>
    </form>
</div>