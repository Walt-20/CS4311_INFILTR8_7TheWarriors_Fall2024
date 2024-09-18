<script>
    import { onMount } from 'svelte';
    import Menu from '../../lib/Menu.svelte';

    let files = [];
    let uploadProgress = 0;
    let ips = ["192.168.1.1", "192.168.1.2", "192.168.1.3"];
    let analyses = ["Analysis 1", "Analysis 2", "Analysis 3"];
    let projects = ["Project 1", "Project 2", "Project 3"];
    let menuOpen = false;

    function moveUp(list, index) {
        if (index > 0) {
            [list[index - 1], list[index]] = [list[index], list[index - 1]];
            ips = [...list];
        }
    }

    function moveDown(list, index) {
        if (index < list.length - 1) {
            [list[index + 1], list[index]] = [list[index], list[index + 1]];
            ips = [...list];
        }
    }

</script>

<style>
    .grid {
        display: grid;
        grid-template-columns: 1fr auto;
        grid-template-areas: "current-project load" "ip load" "entry load";
        grid-gap: 20px;
        padding: 20px;
    }

    .current-project {
        grid-area: current-project;
        display: flex;
        width: 50%;
        align-items: center;
        padding: 10px;
        background-color: rgba(83,109,130,255);
        color: #fff;
        border: none;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        border-radius: 8px;
        cursor: pointer;
    }

    .folder-icon {
        margin-right: 10px;
        font-size: 2rem;
        display: flex;
        align-items: center;
    }

    .button-text {
        margin-top: .75rem;
        display: flex;
        flex-direction: column;
        margin-left: 10px;
    }

    .ip {
        grid-area: ip;
    }

    .scope-list {
        background-color: rgba(83,109,130,255);
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        width: 75%;
        padding: 10px;
    }

    .scope-list ul {
        list-style-type: none;
        padding: 0;
    }

    .scope-list li {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 5px 0;
    }

    .entry {
        grid-area: entry;
    }

    .load {
        grid-area: load;
        justify-self: end;
    }

    .main {
        padding: 20px;
    }

    .arrow {
        cursor: pointer;
        margin-left: 10px;
    }
</style>

<Menu {menuOpen} />

<div class="main">

    <h2>Current Project Folder</h2>

    <div class="grid">

        <button class="current-project">
            <div class="folder-icon">📁</div>
            <div class="button-text">
                <span>Go to Current</span>
                <span>Project Folder</span>
            </div>
        </button>
        
        <div class="ip">
            <h2>Scope IP List</h2>
            <div class="scope-list">
                <ul>
                    {#each ips as ip, index}
                        <li>
                            <span>{ip}</span>
                            <div>
                                <span class="arrow" on:click={() => moveUp(ips, index)} aria-label="Move up"><span class="material-symbols-outlined">
                                    keyboard_arrow_up
                                    </span></span>
                                <span class="arrow" on:click={() => moveDown(ips, index)} aria-label="Move down"><span class="material-symbols-outlined">
                                    keyboard_arrow_down
                                    </span></span>
                            </div>
                        </li>
                    {/each}
                </ul>
            </div>
        </div>
        
        <div class="entry">
            <h2>Entry Points Allowed</h2>
            <ul>
                {#each analyses as analysis, index}
                    <li>
                        {analysis}
                        <span class="arrow" on:click={() => moveUp(analyses, index)}>⬆️</span>
                        <span class="arrow" on:click={() => moveDown(analyses, index)}>⬇️</span>
                    </li>
                {/each}
            </ul>
        </div>
        
        <div class="load">
            <h2>Load Projects</h2>
            <ul>
                {#each projects as project}
                    <li>{project}</li>
                {/each}
            </ul>
        </div>
    </div>
</div>

