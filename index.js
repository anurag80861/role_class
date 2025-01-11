const dorenv = require('dotenv');
dorenv.config();

const express = require('express');
const tasksRouter = require('./routes/tasks.js');
const projectsRouter = require('./routes/projects.js');
const { USERS, ROLES } = require('./db.js');
const { authenticateToken, authRole } = require('./middleware/auth.js');

const app = express();
const PORT = process.env.PORT1;

// Middleware to parse JSON
app.use(express.json());
app.use(authenticateToken);

app.use('/tasks', tasksRouter);
app.use('/projects', authRole(ROLES.ADMIN, ROLES.MANAGER), projectsRouter);

app.get('/users', authRole(ROLES.ADMIN), (req, res) => {
    console.log(req.query)
    const { page =1, limit=10 } = req.query;
    const pageNum = parseInt(page)
    const limitNum = parseInt(limit)

    const totalPages = Math.ceil(USERS.length / limitNum);

    if (isNaN(pageNum) || isNaN(limitNum) || pageNum <= 0 || limitNum <= 0 || pageNum > limitNum) {
        return res.status(400).json({ message: "invalid page or limit value" })
    }

    const startIndex = (pageNum - 1) * limitNum;
    const endIndex = startIndex + limitNum;
    const results = USERS.slice(startIndex, endIndex)

    const paginatedResult = {
        results: results,
        totalPages: totalPages,
        totalResults: USERS.length,
        currentPage: page,
    }

    if (pageNum < totalPages) {
        paginatedResult.next = {
            page: pageNum + 1,
            limit: limitNum,
        }

    }
    
    if (pageNum >1) {
        paginatedResult.prev = {
            page: pageNum -1,
            limit: limitNum,
        }

    }

    return res.json(paginatedResult);
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
