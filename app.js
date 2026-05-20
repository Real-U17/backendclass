const express = require('express');
const app = express();
const port = 7000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// http://localhost:7000

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/about', (req, res) => {
  res.send('ระบบประวัติการศึกษา portfolio');
});



app.get('/api/auth/me', (req, res) => {
  res.send('ข้อมูลผู้ใช้');
});

app.post('/api/auth/register', (req, res) => {
  console.log(req.body);
  res.send({ message: 'ลงทะเบียนผู้ใช้สำเร็จ' });
  
});

app.post('/api/auth/login', (req, res) => {
  res.send('เข้าสู่ระบบ');
});

app.post('/api/auth/logout', (req, res) => {
  res.send('ออกจากระบบ');
});

app.put('/api/auth/change-password', (req, res) => {
  res.send('เปลี่ยนรหัสผ่าน');
});


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});