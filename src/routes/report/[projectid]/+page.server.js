export const load = async ({ params }) => {
    console.log(params.projectid)
 
    return {
        projectid: params.projectid,
    }
}