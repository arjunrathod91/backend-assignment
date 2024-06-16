const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
app.use(express.json());
app.use(bodyParser.json());

const jwtSecret = 'arjun_26#45rathod';
const users = [
    { id: 1, username: 'admin', password: 'admin', role: 'admin' },
    { id: 2, username: 'user', password: 'user', role: 'user' }
];


let tasks = [
    { id: 1, title: 'Task 1', desc: 'Description 1' },
    { id: 2, title: 'Task 2', desc: 'Description 2' },
    { id: 3, title: 'Task 3', desc: 'Description 3' },
    { id: 4, title: 'Task 4', desc: 'Description 4' },
    { id: 5, title: 'Task 5', desc: 'Description 5' },
    { id: 6, title: 'Task 6', desc: 'Description 6' },
];


function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) return res.sendStatus(401); // Unauthorized

    jwt.verify(token, jwtSecret, (err, user) => {
        if (err) return res.sendStatus(403); // Forbidden
        req.user = user;
        next();
    });
}


app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
        const token = jwt.sign({ username: user.username, role: user.role }, jwtSecret, { expiresIn: '1h' });
        res.json({ token });
    } else {
        res.status(401).json({ error: 'Invalid credentials' });
    }
});

//get all tasks

app.get('/tasks',authenticateToken,(req,res)=>{
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 2;
    const sortBy = req.query.sortBy || 'id';
    const order = req.query.order === 'desc' ? -1 : 1;
    const filterBy = req.query.filterBy || null;
    const filterValue = req.query.filterValue || null;

    // Filter tasks
    let filteredTasks = tasks;
    if (filterBy && filterValue) {
        filteredTasks = tasks.filter(task => task[filterBy] == filterValue);
    }

    // Sort tasks
    filteredTasks.sort((a, b) => {
        if (a[sortBy] < b[sortBy]) return -1 * order;
        if (a[sortBy] > b[sortBy]) return 1 * order;
        return 0;
    });


    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedTasks = tasks.slice(startIndex, endIndex);

    const response = {
        page,
        limit,
        totalTasks: tasks.length,
        totalPages: Math.ceil(tasks.length / limit),
        tasks: paginatedTasks
    };

    res.status(200).json(response);
})

//get request by id

app.get('/tasks/:id',(req,res)=>{
    const taskId = parseInt(req.params.id);
    const task = tasks.find(t => t.id === taskId);
    if (task) {
        res.status(200).json(task);
    } else {
        res.status(400).send({ error: 'Task not found' });
    }
})

// post request

app.post('/tasks',authenticateToken,(req, res) => {
    const { title, desc } = req.body;
    const newTask = {
        id: tasks.length + 1,
        title: title,
        desc: desc
    };
    tasks.push(newTask);
    res.json(newTask);
});

//put request

app.put('/tasks/:id',authenticateToken,(req, res) => {
    const taskId = parseInt(req.params.id);
    const { title, desc } = req.body;
    const taskToUpdate = tasks.find(t => t.id === taskId);
    if (taskToUpdate) {
        taskToUpdate.title = title || taskToUpdate.title;
        taskToUpdate.desc = desc || taskToUpdate.desc;
        res.status(200).json(taskToUpdate);
    } else {
        res.status(404).json({ error: 'Task not found' });
    }
});

//delete delete

app.delete('/tasks/:id',authenticateToken,(req, res) => {
    const taskId = parseInt(req.params.id);
    const taskIndex = tasks.findIndex(t => t.id === taskId);
    if (taskIndex !== -1) {
        const deletedTask = tasks.splice(taskIndex, 1);
        res.status(200).json(deletedTask[0]);
    } else {
        res.status(404).send({ error: 'Task not found' });
    }
});


app.listen(8000,()=>{
    console.log(`server is running`);
})