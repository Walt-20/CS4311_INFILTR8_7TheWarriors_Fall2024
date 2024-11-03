<script>
    import Menu from '$lib/Menu.svelte';
    import { marked } from 'marked';
    export let data;

    let menuOpen = false;
</script>

<Menu {menuOpen} />

<div class="flex flex-col justify-start items-center min-h-screen w-full p-5">
    <div class="text-center w-full">
        <h1 class="text-4xl font-bold text-gray-800 dark:text-gray-200 py-4 mb-7">Support</h1>
    </div>

    <div class="text-gray-800 dark:text-gray-200 max-w-3xl">
        <div class="preview">{@html marked(data.file)}</div>
    </div>
</div>
