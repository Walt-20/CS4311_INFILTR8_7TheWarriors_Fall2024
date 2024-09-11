<!-- src/lib/Notification.svelte -->
<script>
    export let message;
    export let unread = false;
</script>

<style>
    .notification {
        display: flex;
        align-items: center;
        background-color: #616060;
        padding: 10px;
        border-radius: 5px;
        margin-bottom: 10px;
        height: 15px;
    }

    .notification-message {
        flex: 1;
        display: flex;
        align-items: center;
    }

    .unread {
        color: rgb(153, 0, 0);
        margin-left: 8px;
    }
</style>

<div class="notification">
    {#if unread}
        <div class="notification-message">
            <p>{message}</p>
            <h3 class="unread">unread</h3>
        </div>
    {:else}
        <div class="noticiation-message">
            {message}
        </div>
    {/if}
</div>