<script>
    import Menu from '$lib/Menu.svelte';
    import { marked } from 'marked';
    import { colorBlindMode } from '$lib/settingStore.js'; // Import the colorBlindMode store
    export let data;

    let menuOpen = false;
</script>

<Menu {menuOpen} />

<div class={`flex flex-col items-center min-h-screen w-full p-6 ${$colorBlindMode ? 'color-blind-bg' : 'bg-gray-50 dark:bg-gray-900'}`}>
    <div class="text-center w-full max-w-3xl">
        <h1 class={`text-5xl font-extrabold mb-8 ${$colorBlindMode ? 'color-blind-text' : 'text-gray-800 dark:text-gray-100'}`}>
            Support
        </h1>
    </div>

    <div class={`shadow-lg rounded-lg p-6 max-w-3xl w-full ${$colorBlindMode ? 'color-blind-section' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200'}`}>
        <div class={`prose leading-relaxed text-lg ${$colorBlindMode ? 'color-blind-text' : 'dark:prose-invert'}`}>
            <div class="preview">{@html marked(data.file)}</div>
        </div>
    </div>
</div>

<style>
    /* Smooth transition for theme and hover effects */
    h1, .preview {
        transition: color 0.3s ease, background-color 0.3s ease;
    }

    /* Make links stand out */
    .preview a {
        color: #2563eb; /* blue-600 */
        text-decoration: underline;
    }

    .preview a:hover {
        color: #1e40af; /* blue-800 */
    }

    .prose p, .prose ul, .prose ol {
        margin-top: 0.75rem;
        margin-bottom: 0.75rem;
    }

    @media (max-width: 640px) {
        h1 {
            font-size: 2.5rem;
        }
    }

    /* Color Blind Mode Styling */
    .color-blind-bg {
        background-color: #273043;
    }
    .color-blind-text {
        color: #264653;
    }
    .color-blind-section {
        background-color: #F4A261;
        color: #264653;
    }
</style>

