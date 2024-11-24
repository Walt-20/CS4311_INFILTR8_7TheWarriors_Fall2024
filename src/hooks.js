import { authenticateUser } from "$lib/auth"
import { redirect } from "@sveltejs/kit"

export const handle = async ({ event, resolve }) => {
	// Stage 1
	event.locals.user = authenticateUser(event)
    console.log("This is from hook:",event.locals.user)
    if (!event.locals.user) {
        if (event.url.pathname != "/login") {
            throw redirect(303, "/login")
        }
    }

    console.log("Trying to resolve event")
	const response = await resolve(event) // Stage 2

	// Stage 3

	return response
}