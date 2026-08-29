const express = require('express');
const cors = require('cors');
const sqlite3=require('sqlite3').verbose();
const db = new sqlite3.Database('./tasks.db');
const app = express();

db.run(`CREATE TABLE IF NOT EXISTS tasks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  done BOOLEAN DEFAULT 0
)`);

app.use(cors());
app.use(express.json());

app.get('/api/tasks', (req, res) => {
  db.all('SELECT * FROM tasks', (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

app.post('/api/tasks', (req, res) => {
  const { title } = req.body;
  db.run('INSERT INTO tasks (title) VALUES (?)', [title], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ id: this.lastID, title, done: false });
  });
});
app.put('/api/tasks/:id', (req, res) => {
  const { id } = req.params;
  const { done } = req.body;
  db.run('UPDATE tasks SET done = ? WHERE id = ?', [done, id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ id, done });
  });
});

app.delete('/api/tasks/:id', (req, res) =>{
  const { id } = req.params;
  db.run('DELETE FROM tasks WHERE id=?', [id], function(err){
    if(err){
      res.status(500).json({error:err.message});
      return
    }
    res.json({id})
  }

  );

  
});
//moved the port 5001 too busy
app.listen(5001, () => console.log('Server running on port 5000'));