<script>
    let tests = ["Test 1", "Test 2", "Test 3"];
    let selectedTest = tests[0];
    let entryPoints = ["Entry Point 1", "Entry Point 2"];
    let selectedEntryPoint = entryPoints[0];
    let startTimes = ["08:00 AM", "12:00 PM", "04:00 PM"];
    let selectedStartTime = startTimes[0];
    let analysisProgress = 50; // Example progress value
    let overallProgress = 75; // Example overall progress value

    function handleTestChange(event) {
        selectedTest = event.target.value;
    }

    function handleEntryPointChange(event) {
        selectedEntryPoint = event.target.value;
    }

    function handleStartTimeChange(event) {
        selectedStartTime = event.target.value;
    }

    function viewResult() {
        // Handle view result action
    }
</script>

<style>
    .summary-section {
        max-height: 200px;
        overflow-y: scroll;
        border: 1px solid #ccc;
        padding: 10px;
        margin-bottom: 20px;
    }

    .progress-bar {
        width: 100%;
        background-color: #f3f3f3;
        border-radius: 5px;
        overflow: hidden;
        margin-bottom: 10px;
    }

    .progress-bar div {
        height: 20px;
        background-color: #4caf50;
        width: 0;
    }

    .progress-label {
        margin-bottom: 5px;
    }
</style>

<h1>Analysis</h1>

<div>
    <label for="project-select">Select a test</label>
    <select id="project-select" bind:value={selectedTest} on:change={handleTestChange}>
        {#each tests as test}
            <option value={test}>{test}</option>
        {/each}
    </select>
</div>

<div class="summary-section">
    <h2>Summary</h2>
    <!-- Summary content goes here -->
</div>

<div>
    <div class="progress-label">Analysis Progress</div>
    <div class="progress-bar">
        <div style="width: {analysisProgress}%"></div>
    </div>
    <div class="progress-label">Overall Progress</div>
    <div class="progress-bar">
        <div style="width: {overallProgress}%"></div>
    </div>
    <div>{overallProgress}% completed</div>
</div>

<h2>Schedule Analysis</h2>

<div>
    <label for="entry-point-select">Entry Points</label>
    <select id="entry-point-select" bind:value={selectedEntryPoint} on:change={handleEntryPointChange}>
        {#each entryPoints as entryPoint}
            <option value={entryPoint}>{entryPoint}</option>
        {/each}
    </select>
</div>

<div>
    <label for="start-time-select">Start-Time</label>
    <select id="start-time-select" bind:value={selectedStartTime} on:change={handleStartTimeChange}>
        {#each startTimes as startTime}
            <option value={startTime}>{startTime}</option>
        {/each}
    </select>
</div>

<button on:click={viewResult}>View Result</button>