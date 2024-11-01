export const load = async ({ fetch }) => {
    const fetchUser = async () => {
        console.log("Testing request")
        const projectsRes = await fetch('http://127.0.0.1:8080/registration')
        console.log("Request processed")
        const projectsData = await projectsRes.json()
        console.log(projectsRes.body)
        console.log(projectsData.nodes)
        return projectsData.nodes
    }
 
    return {
        projectsData: await fetchUser(),
    }
}