const express = require("express");
const bodyParser = require("body-parser");
const app = express();

//middleware 
app.use(bodyParser.json());

// Dummy database to store users
const users = [];

// User Registration API
app.post("/register", (req, res) => {
    const { username, email, password } = req.body;

    // Check if username or email already exists
    const isExistingUser = users.find(user => user.username === username || user.email === email);
    if (isExistingUser) {
        return res.send({ message: "Username or email already exists", status: 400 });
    }

    // Create new user
    const newUser = { username, email, password };
    users.push(newUser);
    res.status(201).json({ message: "User registered successfully" });
})





// User Login API
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.find(user => user.username === username && user.password === password);

    if (!user) {
        return res.send({ message: "Invalid username or password", status: 401 });
    }

    return res.send({ message: "Login successful", status: 200, data: users })
})






// Forget Password API
app.post('/forgot-password', (req, res) => {
    const {email} = req.body;

    // Check if user with given email exists
    const user = users.find(user => user.email === email);
    if (!user) {
        return res.status(404).json({ message: "User not found with this email" });
    }

    // Here we can implement our logic for password reset,
    // like sending an email with a reset link
    res.json({ message: "Password reset email sent successfully" ,status:200});
})




const PORT = 8000;
app.listen(PORT, () => {
    console.log(`Server is running on Port: ${PORT}`);
});


