const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');



const app = express();
const port = process.env.PORT || 4000;



/* connection for local pgSQL server */
const connectionString = process.env.DATABASE_URL;

const pool = new Pool({
    connectionString: connectionString,
    ssl: {
        rejectUnauthorized: false
    }
});



app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public')); 
//configuring EJS in the server
app.set('view engine', 'ejs');


// Handle form submission
app.post('/submit', async (req, res) => {
    try {
        const value = req.body.inputText;
        const statusValue = 'in-progress';
        await pool.query('INSERT INTO to_dua_list(tasks, status) VALUES($1, $2)', [value, statusValue]);
        res.redirect('/incomplete-tasks')
    } catch (err) {
        console.error(err);
        res.status(500).send('An error occurred');
    }
});

// Handle form results display
app.get('/incomplete-tasks', async (req, res) => {
    try {
        const result = await pool.query(`SELECT * FROM to_dua_list WHERE status='in-progress'`);
        const items = result.rows;
        //console.log(items);
        res.render('incomplete-tasks.ejs', { items });
    } catch (err) {
        console.error(err);
        res.status(500).send('An error occurred');
    }
});

// Handle completed tasks results display
app.get('/completed-tasks', async (req, res) => {
    try {
        const result = await pool.query(`SELECT * FROM to_dua_list WHERE status='completed'`);
        const items = result.rows;
        res.render('completed-tasks.ejs', { items });
    } catch (err) {
        console.error(err);
        res.status(500).send('An error occurred');
    }
})

//update item when button clicked
app.post('/execute-query', async (req, res) => {
    try {
        const taskId = req.body.taskId;
        const result = await pool.query(`UPDATE to_dua_list SET status = 'completed' WHERE id = $1`, [taskId]);
        res.json({ success: true, data: result.rows });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'An error occurred' });
    }
});

//handling clear list
app.delete('/clear-completed', async (req, res) => {
    try {
        await pool.query("DELETE FROM to_dua_list WHERE status='completed'");
        res.json({ message: "Successfully cleared completed items." });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal Server Error" });
    }
});


app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
