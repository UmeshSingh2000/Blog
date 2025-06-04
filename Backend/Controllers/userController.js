const loginUser = async(req, res) => {
    try {
        // Simulate user login logic
        const { username, password } = req.body;
        
        // Here you would typically check the credentials against a database
        if (username === 'test' && password === 'password') {
            res.status(200).json({ message: 'Login successful', user: { username } });
        } else {
            res.status(401).json({ message: 'Invalid credentials' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}