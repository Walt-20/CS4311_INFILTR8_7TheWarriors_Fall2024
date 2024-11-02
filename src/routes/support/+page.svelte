<script>
    import Menu from '$lib/Menu.svelte';
    import { marked } from 'marked';
    export let data;

    let menuOpen = false;
</script>

<Menu {menuOpen} />

<div class="flex flex-col items-center min-h-screen w-full bg-gray-50 dark:bg-gray-900 p-6">
    <div class="text-center w-full max-w-3xl">
        <h1 class="text-5xl font-extrabold text-gray-800 dark:text-gray-100 mb-8">
            Support
        </h1>
    </div>

    <div class="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 max-w-3xl w-full text-gray-700 dark:text-gray-200">
        <div class="prose dark:prose-invert leading-relaxed text-lg">
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

    /* Add padding and margin for readability */
    .prose p, .prose ul, .prose ol {
        margin-top: 0.75rem;
        margin-bottom: 0.75rem;
    }

    /* Responsive adjustments */
    @media (max-width: 640px) {
        h1 {
            font-size: 2.5rem;
        }
    }
</style>
