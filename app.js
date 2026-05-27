const express = require('express');
const app = express();
const port = 7000;
const db = require('./db');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// http://localhost:7000
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// ดึงข้อมูลผู้ใช้ทั้งหมด
app.get('/api/users', async (req, res) => { 
  try {
    const users = await db('users'); 
    res.json({
       success: true,
       count: users.length,
       data: users
    });
  } catch(error) {
    res.status(500).json({ error: error.message });
  }
});

// ดึงข้อมูลผู้ใช้โดยกรองจาก role
// ทดสอบด้วย: http://localhost:7000/api/users1?role=student
app.get('/api/users1', async (req, res) => {
  console.log('GET /api/users1, role =', req.query.role);
  const { role } = req.query; 
  
  try {
    const users = await db('users').where({ role: role }); 
    
    res.json({
      success: true,
      count: users.length,
      data: users
    });
  } catch(error) {
    res.status(500).json({ error: error.message });
  }
});

// ==========================================
// 🚀 เริ่มต้นโจทย์ข้อ 3 - 10
// ==========================================

// 3. ค้นหาผู้ใช้จาก email
// ทดสอบ: http://localhost:7000/api/users/search?email=student001@example.com
app.get('/api/users/search', async (req, res) => {
  const { email } = req.query;
  try {
    const users = await db('users').where({ email: email });
    res.json({ success: true, count: users.length, data: users });
  } catch(error) {
    res.status(500).json({ error: error.message });
  }
});

// 4. แสดงข้อมูล profile พร้อม username (JOIN)
// ทดสอบ: http://localhost:7000/api/profiles/with-users
app.get('/api/profiles/with-users', async (req, res) => {
  try {
    const profiles = await db('users')
      .join('profiles', 'users.id', 'profiles.user_id')
      .select(
        'users.id',
        'users.username',
        'profiles.fullname',
        'profiles.department',
        'profiles.level'
      );
    res.json({ success: true, count: profiles.length, data: profiles });
  } catch(error) {
    res.status(500).json({ error: error.message });
  }
});

// 5. แสดงทักษะทั้งหมดของ user_id = 1 (รับค่าเป็นพารามิเตอร์)
// ทดสอบ: http://localhost:7000/api/users/1/skills
app.get('/api/users/:userId/skills', async (req, res) => {
  const { userId } = req.params;
  try {
    const skills = await db('skills').where({ user_id: userId });
    res.json({ success: true, count: skills.length, data: skills });
  } catch(error) {
    res.status(500).json({ error: error.message });
  }
});

// 6. ค้นหาทักษะที่เกี่ยวกับ Web
// ทดสอบ: http://localhost:7000/api/skills/search?category=Web
app.get('/api/skills/search', async (req, res) => {
  const category = req.query.category || 'Web';
  try {
    // ใช้คำสั่ง LIKE ของ SQL
    const skills = await db('skills').where('category', 'like', `%${category}%`);
    res.json({ success: true, count: skills.length, data: skills });
  } catch(error) {
    res.status(500).json({ error: error.message });
  }
});

// 7. แสดง project ล่าสุด เรียงจากปีมากไปน้อย
// ทดสอบ: http://localhost:7000/api/projects
app.get('/api/projects', async (req, res) => {
  try {
    const projects = await db('projects').orderBy('project_year', 'desc');
    res.json({ success: true, count: projects.length, data: projects });
  } catch(error) {
    res.status(500).json({ error: error.message });
  }
});

// 8. นับจำนวนทักษะแยกตาม user (GROUP BY)
// ทดสอบ: http://localhost:7000/api/skills/count
app.get('/api/skills/count', async (req, res) => {
  try {
    const skillsCount = await db('skills')
      .select('user_id')
      .count('* as total_skills')
      .groupBy('user_id');
    res.json({ success: true, count: skillsCount.length, data: skillsCount });
  } catch(error) {
    res.status(500).json({ error: error.message });
  }
});

// 9. แสดงเกียรติบัตรที่ออกหลังปี 2025
// ทดสอบ: http://localhost:7000/api/certificates/recent
app.get('/api/certificates/recent', async (req, res) => {
  try {
    const certificates = await db('certificates').where('issued_date', '>=', '2025-01-01');
    res.json({ success: true, count: certificates.length, data: certificates });
  } catch(error) {
    res.status(500).json({ error: error.message });
  }
});

// 10. แสดง portfolio รวมของนักศึกษา (Multiple JOIN)
// ทดสอบ: http://localhost:7000/api/portfolios/students
app.get('/api/portfolios/students', async (req, res) => {
  try {
    const portfolios = await db('users as u')
      .join('profiles as p', 'u.id', 'p.user_id')
      .join('educations as e', 'u.id', 'e.user_id')
      .where('u.role', 'student')
      .select(
        'u.username',
        'p.fullname',
        'p.department',
        'e.school_name',
        'e.major',
        'e.gpa'
      );
    res.json({ success: true, count: portfolios.length, data: portfolios });
  } catch(error) {
    res.status(500).json({ error: error.message });
  }
});

// ==========================================
// เส้นทางอื่นๆ จากโค้ดเดิมของคุณ
// ==========================================

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

// ดึงข้อมูลทักษะ (Skills) ทั้งหมด (ดั้งเดิม)
app.get('/api/skills', async (req, res) => {
  console.log('GET /api/skills', req.query);
  try {
    const skills = await db('skills');
    res.json({
      success: true,
      count: skills.length,
      data: skills
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
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