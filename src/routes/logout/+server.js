import { redirect } from "@sveltejs/kit"

export const GET = async ({ cookies }) => {
	cookies.delete("auth",{path: "/"})
	cookies.delete("role",{path: "/"})
	throw redirect(303, "/login")
}