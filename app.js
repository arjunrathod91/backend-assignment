const express = require('express');
const app = express();
app.use(express.json());

let tasks = [
    { id: 1, title: 'Task 1', desc: 'Description 1' },
    { id: 2, title: 'Task 2', desc: 'Description 2' },
    { id: 3, title: 'Task 3', desc: 'Description 3' },
    { id: 4, title: 'Task 4', desc: 'Description 4' },
    { id: 5, title: 'Task 5', desc: 'Description 5' },
    { id: 6, title: 'Task 6', desc: 'Description 6' },
];

//get all tasks

app.get('/tasks',(req,res)=>{
    res.status(200).json(tasks);
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

app.post('/tasks', (req, res) => {
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

app.put('/tasks/:id', (req, res) => {
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

app.delete('/tasks/:id', (req, res) => {
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