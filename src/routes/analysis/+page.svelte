<script>
    let entryPoints = [
        { name: "Unauthorized port bypass", selected: false },
        { name: "Default credentials", selected: false },
        { name: "Unpatched software exploits", selected: false },
        { name: "Protocols missing encryption", selected: false },
        { name: "Weak passwords", selected: false }
    ];

    let startTimes = ["08:00 AM", "12:00 PM", "04:00 PM"];
    let selectedStartTime = startTimes[0];
    let analysisProgress = 50; // Example progress value
    let overallProgress = 75; // Example overall progress value

    function handleEntryPointChange(index) {
        // Toggle the selected status of the entry point
        entryPoints[index].selected = !entryPoints[index].selected;
    }

    function handleStartTimeChange(event) {
        selectedStartTime = event.target.value;
    }

    function viewResult() {
        // Handle view result action
        const selectedEntryPoints = entryPoints.filter(entryPoint => entryPoint.selected);
        console.log("Selected entry points:", selectedEntryPoints);
    }
</script>

<style>
    body {
        background-color: rgba(42, 52, 61, 255);
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        color: rgba(156, 178, 190, 255);
    }

    h1, h2 {
        color: rgba(156,178,190,255);
    }

    .section {
        background-color: rgba(83,109,130,255);
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        margin-bottom: 20px;
    }

    .entry-point-checklist label {
        display: block;
        margin: 5px 0;
    }

    .entry-point-checklist input[type="checkbox"] {
        margin-right: 10px;
    }

    .entry-point-checklist {
        background-color: rgba(83,109,130,255);
        padding: 15px;
        border-radius: 8px;
    }

    .button {
        background-color: rgba(156,178,190,255);
        border: none;
        border-radius: 5px;
        padding: 10px 20px;
        font-size: 16px;
        cursor: pointer;
        transition: background-color 0.3s, box-shadow 0.3s;
    }

    .button:hover {
        background-color: #5e6b72;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    }

    select {
        background-color: rgba(83,109,130,255);
        color: rgba(156,178,190,255);
        border: 1px solid rgba(156,178,190,255);
        border-radius: 5px;
        padding: 5px;
        margin: 10px 0;
    }

    .progress-bar {
        width: 100%;
        background-color: rgba(83,109,130,255);
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
        color: rgba(156,178,190,255);
        margin-bottom: 5px;
    }
</style>

<h1>Schedule Analysis</h1>

<!-- Entry Points Checklist -->
<div class="section">
    <h2>Select Entry Points</h2>
    <div class="entry-point-checklist">
        {#each entryPoints as entryPoint, index}
            <label>
                <input type="checkbox" on:change={() => handleEntryPointChange(index)} checked={entryPoint.selected} />
                {entryPoint.name}
            </label>
        {/each}
    </div>
</div>

<!-- Start Time Dropdown -->
<div class="section">
    <label for="start-time-select">Start-Time</label>
    <select id="start-time-select" bind:value={selectedStartTime} on:change={handleStartTimeChange}>
        {#each startTimes as startTime}
            <option value={startTime}>{startTime}</option>
        {/each}
    </select>
</div>

<!-- Progress Bars -->
<div class="section">
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

<!-- View Result Button -->
<button class="button" on:click={viewResult}>View Result</button>
