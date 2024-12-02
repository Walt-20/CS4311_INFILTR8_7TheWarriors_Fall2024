<script>
    export let form;
</script>

<style>
</style>

<div class="flex justify-center items-center h-screen w-full bg-white dark:bg-gray-800">
    <form class="max-w-md w-full bg-gray-100 dark:bg-gray-700 shadow-md rounded-lg p-8" method="POST" action="?/login">
        <h2 class="text-2xl font-semibold text-center mb-6 dark:text-white">Log In</h2>

        <div class="mb-4 text-red-600">{form?.message || ''}</div>
        
        <div class="mb-4">
            <label class="block text-gray-900 dark:text-white" for="username">Username</label>
            <input type="text" id="username" name="username" placeholder="Username" class="mt-1 block w-full p-2 border rounded" value={form?.username ?? ''} />
        </div>

        <div class="mb-4">
            <label class="block text-gray-900 dark:text-white" for="password">Password</label>
            <input type="password" id="password" name="password" placeholder="Password" class="mt-1 block w-full p-2 border rounded"/>
        </div>
        
        <a href="/forgot-password" class="text-blue-600 hover:underline">Forgot Password?</a>

        <button type="submit" class="mt-6 w-full py-2 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 text-center block"> Login </button>

        <div class="mt-4 text-center">
            Don't have an account? <a href="/registration" class="text-blue-600 hover:underline">Register DAC Analyst</a>
        </div>
    </form>
</div>