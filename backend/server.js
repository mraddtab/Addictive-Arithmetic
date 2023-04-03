const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const cors = require('cors');
const pool = require('./databasepg.js');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res) => {
    if (!req.session.userID) {
        // Redirect to login if user is not logged in
        return res.redirect('/login');
    }
    // Render homepage if user is logged in
    res.send('Welcome to the homepage!');
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    // Check if username and password are provided
    if (!username || !password) {
        return res.status(400).send({ message: 'Username and password are required' });
    }
    // Check if the username exists
    const user = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    if (user.rows.length === 0) {
        return res.status(401).send({ message: 'Invalid username or password' });
    }

    const hashedPassword = user.rows[0].password;
    const isValidPassword = await bcrypt.compare(password, hashedPassword);
    if (isValidPassword) {
        //Generate authtoken
        const authToken = uuidv4();
        //Store authtoken in database.
        try {
            await pool.query('UPDATE users SET authToken = $1 WHERE username = $2',[authToken, username]);
        } catch (err) {
            console.error(err);
            res.status(500).send({ message: 'Server error' });
        }
        // Return success response, and an auth token
        res.send({ success: true, authToken: authToken,username });
    } else {
        res.status(401).send({ message: 'Invalid username or password' });
    }
});

app.post('/register', async (req, res) => {
    const { username, password1, password2 } = req.body;

    //Verify if valid input
    if (!username || !password1 || !password2) {
    return res.status(400).send({ message: 'Username and passwords are required' });
    }
    if (password1 !== password2) {
    return res.status(400).send({ message: 'Passwords do not match' });
    }

    // Check if username is already taken
    const existingUser = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    if (existingUser.rows.length > 0) {
        return res.status(400).send({ message: 'Username already taken' });
    }
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password1, salt);

    // Insert new user into database
    try {
        await pool.query('INSERT INTO users (username, password, salt) VALUES ($1, $2, $3)', [username, hashedPassword, salt]);
        res.status(201).send({ message: 'User registered successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).send({ message: 'Server error' });
    }
});

app.get('/authorize-login', async (req, res) => {
    const authToken = req.headers.authorization;

    if (!authToken) {
    return res.status(401).send({ message: 'Unauthorized' });
    }

  // Check if authToken is valid in database
    try {
        const result = await pool.query('SELECT * FROM users WHERE authToken = $1', [authToken]);
        if (result.rows.length === 1) {
            return res.send({ success: true });
        }
    } 
    catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Server error' });
    }
    return res.send({ success: false });
});




app.post('/game', async (req, res) => {
    const username = req.body.username;
    const streak = req.body.streak;
    const correct = req.body.correct;

    const updateQuery = `
    UPDATE users
    SET questions_answered = questions_answered + 1,
        correct_answers = correct_answers + ${correct},
        longest_streak = GREATEST(longest_streak, ${streak}),
        accuracy = correct_answers / questions_answered * 100
    WHERE username = ${username};
    `;
    try {
        await pool.query(updateQuery);
        res.status(201).send({ message: 'Score updated' });
        return;
    } catch (error) {
        console.error(`Failed to update user info: ${error}`);
        res.status(500).send({ message: 'Server error' });
        return;
    }
});
app.get('/user-stats', async (req, res) => {
    const username = req.query.username;
    try {
        const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
        if (result.rows.length === 1) {
            const userStats = {
                username: result.rows[0].username,
                questions_answered: result.rows[0].questions_answered,
                correct_answers: result.rows[0].correct_answers,
                longest_streak: result.rows[0].longest_streak,
                accuracy: result.rows[0].correct_answers / result.rows[0].questions_answered * 100
            }
            return res.send({ success: true, userStats: userStats });
        }
        return res.status(404).send({ message: 'User not found' });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Server error' });
    }
});
app.listen(3000, () => {
    console.log('Server started on port 3000');
});