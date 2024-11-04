import bcrypt from 'bcrypt';

export const load = async ({ fetch }) => {
    const fetchUser = async () => {
        console.log("Testing request");
        const projectsRes = await fetch('http://127.0.0.1:8080/registration');
        console.log("Request processed");
        const projectsData = await projectsRes.json();
        console.log(projectsRes.body);
        console.log(projectsData.nodes);
        return projectsData.nodes;
    };

    const registerUser = async (userData) => {
        const { firstName, lastName, username, password, token } = userData;

        // Hash the password and token
        const hashedPassword = await bcrypt.hash(password, 10);
        const hashedToken = await bcrypt.hash(token, 10);

        // Save to the database with hashed password and token
        const response = await fetch('http://127.0.0.1:8080/registration', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                firstName,
                lastName,
                username,
                password: hashedPassword,
                token: hashedToken
            })
        });

        return await response.json();
    };

    return {
        projectsData: await fetchUser(),
    };
};
