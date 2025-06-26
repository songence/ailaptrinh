// const app = require('./src/app')
// const PORT = process.env.PORT || 3056
// const server = app.listen(PORT, () => {
//     console.log(`WSV eCommerce start with ${PORT}`)
// })
// server.js
const express = require('express');
const path = require('path');
const app = express();

// Phục vụ file tĩnh từ thư mục src
app.use(express.static(path.join(__dirname, 'src')));

// Route cho trang chủ
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'src', 'ailaptrinh.html'));
});

// Các endpoint khác
app.get('/api/hello', (req, res) => {
    res.json({ message: 'Hello from backend!' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});