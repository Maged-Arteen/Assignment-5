
const express = require('express');
const fs = require('fs')
const app = express();
app.use(express.json());

const dataBase = 'users.json';

//fn to read users
const readUsers = () => {
  if (!fs.existsSync(dataBase)) return [];
  return JSON.parse(fs.readFileSync(dataBase));
};

//fn to write users
const writeUsers = (users) => fs.writeFileSync(dataBase, JSON.stringify(users));

//CREATE USER
app.post('/adduser', (req, res) => {
  const { name, age, email} = req.body;
  console.log(req.body)
  const users = readUsers();
  if (users.some(user => user.email === email)) {
    return res.status(400).json({ message: 'Email already exists.' });
  }
  const newUser = { id: users.length, name, age, email };
  users.push(newUser);
  writeUsers(users);
  res.json({ message: 'User added successfully.' });
});

//UPDATE USER
app.patch('/updateUser/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const updates = req.body;
    const users = readUsers();
    const userIndex = users.findIndex(user => user.id === id);
    if (userIndex === -1) {
      return res.status(404).json({ message: 'User id not found.' });
    }
    users[userIndex] = { ...users[userIndex], ...updates };
    writeUsers(users);
    res.json({ message: 'User updated successfully.' });
  });
  
// DELETE USER
app.delete('/deleteUser/:id?', (req, res) => {
    const id = req.params.id ? parseInt(req.params.id) : req.body.id;
    const users = readUsers();
    const userIndex = users.findIndex(user => user.id === id);
    if (userIndex === -1) {
      return res.status(404).json({ message: 'User id not found.' });
    }
    users.splice(userIndex, 1);
    writeUsers(users);
    res.json({ message: 'User deleted successfully.' });
  });

  // GET USER BY NAME 
  app.get('/byName', (req, res) => {
    const { name } = req.query;
    console.log(req.query)
    const users = readUsers();
    const user = users.find(user => user.name === name);
    if (!user) {
      return res.status(404).json({ message: 'User name not found.' });
    }
    res.json(user);
  });

// GET USER BY ID
app.get('/byId/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const users = readUsers();
    const user = users.find(user => user.id === id);
    if (!user) {
      return res.status(404).json({ message: 'User id not found.' });
    }
    res.json(user);
  });

  
  // Start the server
  app.listen(3000, () => console.log('Server running on port 3000'));
  