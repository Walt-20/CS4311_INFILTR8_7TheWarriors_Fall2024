<!-- src/lib/Notification.svelte -->
<script>
    export let message;
    export let unread = false;
</script>

<style>
    .notification {
        display: flex;
        align-items: center;
        padding: 10px;
        margin-bottom: 10px;
        height: 15px;
    }

    .notification:hover {
        transform: scale(1.00);
        box-shadow: 0 4px 8px rgba(0,0,0,0.2);
        cursor: pointer;
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