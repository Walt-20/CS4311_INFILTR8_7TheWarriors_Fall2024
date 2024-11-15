
<script>
    import Menu from '$lib/Menu.svelte';
    import user from "../../user"


    const userId = $user.username;
    let projects = []
    let menuOpen = false;

    async function fetchUploadedFiles(userId) {
        if (!userId) {
            return
        }
        const stringifyedUserId = String(userId)
        console.log(stringifyedUserId)
        try {
            const response = await fetch('http://localhost:5001/user-projects',{
                    method:'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ userId: stringifyedUserId }),
                })

            if (!response.ok) {
                throw new Error('Failed to fetch projects')
            }

            const serverProjects = await response.json()
            projects = serverProjects.map(project => project.projectName)
        } catch (error) {
            console.error("Error fetching projects: ",error);
        }
    }

    fetchUploadedFiles(userId)
</script>

<Menu {menuOpen} />
<!-- Project Section -->
<div style="width:70%; margin-left:auto;margin-right:auto;margin-top:1%">
    <div class="projects">
        <div class="mb-4 rounded bg-gray-50 p-4 shadow dark:bg-gray-700">
            <h2 class="flex items-center text-xl font-bold dark:text-gray-200">
                <span class="material-symbols-outlined mr-2">folder</span>
                Projects
            </h2>
        </div>
        <div class="rounded bg-white p-4 shadow dark:bg-gray-700">
            {#if projects.length === 0}
                <p>No Projects Available</p>
            {:else}
                {#each projects as project}
                <h2 class="cursor-pointer mb-2 flex items-center text-md font-bold dark:text-gray-200 transition transform hover:scale-105 hover:shadow-xl">
                    <span class="mr-4">📁</span>
                    <a href="./project/{project}">{project}</a>
                </h2>
                {/each}
            {/if}
        </div>
    </div>
</div>