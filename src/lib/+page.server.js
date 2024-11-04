const loginUser = async (userData) => {
    const { username, password } = userData;

    // Fetch user data from the database using username
    const response = await fetch('http://127.0.0.1:8080/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username })
    });

    const data = await response.json();
    const user = data.user;

    if (user) {
        // Compare hashed password with user-provided password
        const match = await bcrypt.compare(password, user.password);
        if (match) {
            console.log(`User "${username}" logged in successfully.`);
            // Continue login flow
        } else {
            console.error('Invalid username or password');
        }
    } else {
        console.error('User not found');
    }
};
