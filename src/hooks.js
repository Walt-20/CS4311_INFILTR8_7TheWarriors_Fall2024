import { authenticateUser } from "$lib/auth"
import { redirect } from "@sveltejs/kit"

export const handle = async ({ event, resolve }) => {
    
	// Stage 1
    const authentication = authenticateUser(event)
    console.log(authentication)
    if (authentication){
        const {username, role} = authentication
        event.locals.user = username
        event.locals.role = role
    } else {
        event.locals.user = null
        event.locals.role = null
    }
    console.log("This is from hook:",event.locals.user)

    // Redirect for index
    if (event.url.pathname == "/"){
        if (event.locals.user){
            throw redirect(303,"/dashboard")
        } else {
            throw redirect(303,"/login")
        }
    }

    //Avoid unauthorized login
    if (!event.locals.user) {
        if (event.url.pathname != "/login" && event.url.pathname != "/registration") {
            throw redirect(303, "/login")
        }
    }

    //Restricted access for admin
    if (event.url.pathname.includes("admin-")){
        if (event.locals.role != "Admin"){
            throw redirect(303, "/login")
        }
    }
    console.log("Trying to resolve event")
	const response = await resolve(event) // Stage 2

	// Stage 3

	return response
}