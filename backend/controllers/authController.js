const bcrypt = require('bcryptjs');
const pool = require('../config/db');
const jwt = require('jsonwebtoken');

const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                message: 'Name, email, and password are required.'
            });
        }

        const [existingUsers] = await pool.query(
            'SELECT id FROM users WHERE email = ?',
            [email]
        );

        if (existingUsers.length > 0) {
            return res.status(409).json({
                message: 'Email is already registered.'
            });
        }

        const passwordHash = await bcrypt.hash(password, 10);

        const [result] = await pool.query(
            `INSERT INTO users (name, email, password_hash)
             VALUES (?, ?, ?)`,
            [name, email, passwordHash]
        );

        res.status(201).json({
            message: 'Registration successful.',
            userId: result.insertId
        });

    } catch (error) {
        console.error('Registration error:', error.message);

        res.status(500).json({
            message: 'Server error.'
        });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: 'Email and password are required.'
            });
        }

        const [users] = await pool.query(
            'SELECT id, name, email, password_hash, role FROM users WHERE email = ?',
            [email]
        );

        if (users.length === 0) {
            return res.status(401).json({
                message: 'Invalid email or password.'
            });
        }

        const user = users[0];

        const passwordMatch = await bcrypt.compare(
            password,
            user.password_hash
        );

        if (!passwordMatch) {
            return res.status(401).json({
                message: 'Invalid email or password.'
            });
        }

		const token = jwt.sign(
			{
				id: user.id,
				role: user.role
			},
			process.env.JWT_SECRET,
			{
				expiresIn: process.env.JWT_EXPIRES_IN
			}
		);

		res.json({
			message: 'Login successful.',
			token,
			user: {
				id: user.id,
				name: user.name,
				email: user.email,
				role: user.role
			}
		});

    } catch (error) {
        console.error('Login error:', error.message);

        res.status(500).json({
            message: 'Server error.'
        });
    }
};
module.exports = {
    register,
    login
};