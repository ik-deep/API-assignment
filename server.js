const express = require("express");
const bodyParser = require("body-parser");
const jwt = require('jsonwebtoken');
const app = express();

//middleware 
app.use(bodyParser.json());


// Dummy secret key for JWT
const secretKey = "secret";

// Authentication middleware
function authenticateToken(req, res, next) {
    const token = req.headers['authorization'];
    // console.log( req.headers)
    // console.log("token:",token);
    if (token == null) {
        return res.sendStatus(401);
    }
    jwt.verify(token, secretKey, (err, user) => {
        if (err) {
            return res.sendStatus(403);
        }
        req.user = user;
        next();
    });
}

// Dummy database to store users
const users = [];
// Dummy database to store posts
let posts = [];


// User Registration API---------------------------------------------
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





// User Login API--------------------------------------------
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.find(user => user.username === username && user.password === password);

    if (!user) {
        return res.send({ message: "Invalid username or password", status: 401 });
    }

    // Generate JWT token
    const token = jwt.sign({ username: user.username, email: user.email }, secretKey);
    return res.send({ message: "Login successful", status: 200, token })
})




// Forget Password API----------------------------------------
app.post('/forgot-password', (req, res) => {
    const { email } = req.body;

    // Check if user with given email exists
    const user = users.find(user => user.email === email);
    if (!user) {
        return res.status(404).json({ message: "User not found with this email" });
    }

    // Here we can implement our logic for password reset,
    // like sending an email with a reset link
    res.json({ message: "Password reset email sent successfully", status: 200 });
})




// Create a new post ----------------------------------------------
app.post('/posts',authenticateToken, (req, res) => {
    const { title, content, author } = req.body;
    const newPost = { id: posts.length + 1, title, content, author, likes: 0, comments: [] };
    posts.push(newPost);
    res.status(201).json({ message: "Post created successfully", post: newPost });
});




// Get all posts---------------------------------------------------
app.get('/posts', (req, res) => {
    res.json(posts);
});





// Get a specific post by ID--------------------------------------
app.get('/posts/:id',authenticateToken, (req, res) => {
    const postId = parseInt(req.params.id);
    const post = posts.find(post => post.id === postId);
    if (!post) {
        return res.status(404).json({ message: "Post not found" });
    }
    res.json(post);
});




// Update a post by ID-------------------------------------------
app.put('/posts/:id',authenticateToken, (req, res) => {
    const postId = parseInt(req.params.id);
    const { title, content } = req.body;
    const postIndex = posts.findIndex(post => post.id === postId);
    if (postIndex === -1) {
        return res.status(404).json({ message: "Post not found" });
    }
    posts[postIndex].title = title;
    posts[postIndex].content = content;
    res.json({ message: "Post updated successfully", post: posts[postIndex] });
});





// Delete a post by ID---------------------------------------------------------
app.delete('/posts/:id',authenticateToken, (req, res) => {
    const postId = parseInt(req.params.id);
    const postIndex = posts.findIndex(post => post.id === postId);
    if (postIndex === -1) {
        return res.status(404).json({ message: "Post not found" });
    }
    posts.splice(postIndex, 1);
    res.json({ message: "Post deleted successfully" });
});






// Like a post by ID--------------------------------------------------------
app.post('/posts/:id/like',authenticateToken, (req, res) => {
    const postId = parseInt(req.params.id);
    const postIndex = posts.findIndex(post => post.id === postId);
    if (postIndex === -1) {
        return res.status(404).json({ message: "Post not found" });
    }
    posts[postIndex].likes++;
    res.json({ message: "Post liked successfully", post: posts[postIndex] });
});





// Add a comment to a post by ID-------------------------------------------------------
app.post('/posts/:id/comment',authenticateToken, (req, res) => {
    const postId = parseInt(req.params.id);
    const { comment } = req.body;
    const postIndex = posts.findIndex(post => post.id === postId);
    if (postIndex === -1) {
        return res.status(404).json({ message: "Post not found" });
    }
    posts[postIndex].comments.push(comment);
    res.json({ message: "Comment added successfully", post: posts[postIndex] });
});
















const PORT = 8000;
app.listen(PORT, () => {
    console.log(`Server is running on Port: ${PORT}`);
});


