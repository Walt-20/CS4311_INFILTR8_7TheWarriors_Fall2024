
<script>
    import Menu from '$lib/Menu.svelte';
    import user from "../../user"


    const userId = $user.username;
    let projects = []
    let menuOpen = false;

</script>

<Menu {menuOpen} />
<div>Fix page with links to all reports</div>