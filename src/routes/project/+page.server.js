export const load = async ({ fetch }) => {
    const fetchProjects = async () => {
        const projectsRes = await fetch('http://127.0.0.1:8080/projects')
        const projectsData = await projectsRes.json()
        return projectsData.nodes
    }

    return {
        projectsData: await fetchProjects(),
    }
}