
export const authenticateUser = (event) => {
	// get the cookies from the request
	const { cookies } = event

	// get the user token from the cookie
	const userToken = cookies.get("auth")
	const roleToken = cookies.get("role")

	// if the user token is not valid, return null
	// this is where you would check the user token against your database
	// to see if it is valid and return the user object
    if (userToken && roleToken) {
        return {username: userToken, role: roleToken}
        // if (userToken === "regularusertoken") {
        //     const user = {
        //         username: "",
        //         role: "USER",
        //     }
        //     return user
        // }
        // if (userToken === "adminusertoken") {
        //     const user = {
        //         username: "admin",
        //         role: "ADMIN",
        //     }
        //     return user
        // }
    }

	return null
}