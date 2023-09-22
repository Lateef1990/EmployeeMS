import express from 'express'
import mysql from 'mysql'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import multer from 'multer'
import path from 'path'
import helmet from 'helmet'


const app = express();

app.use(cors({
    origin: 'http://localhost:3000',
    methods:["POST","PUT","GET"],
    credentials: true
}))
app.use(cookieParser());
app.use(express.json());
app.use(express.static('public'))
app.use(helmet());

// MYsql connection
const con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "signup"
})

// Image storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images')
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '_' + Date.now() + path.extname(file.originalname));
    }
})
const upload = multer({
    storage: storage
})
con.connect(function (err) {
    if (err) {
        console.log("Error in Connection")
    } else {
        console.log("Connected")
    }
})

// Fetch all the Employee from the database
app.get('/getEmployees', (req, res) => {
    const sql = "SELECT * FROM employee";
    con.query(sql, (err, result) => {
        if (err) return res.json({ Error: "Getting Employee Error in sql" })
        return res.json({ Status: "Success", Result: result })
    })
})
// Api to get single user
app.get('/get/:id', (req, res) => {
    const id = req.params.id;
    const sql = "SELECT * FROM  employee where id=?";
    con.query(sql, [id], (err, result) => {
        if (err) return res.json({ Error: "Getting Employee Error in sql" })
        return res.json({ Status: "Success", Result: result })
    })
})

// Login Api Admin Login 

app.post('/login', (req, res) => {
    const sql = "SELECT * FROM users where  email=? AND password =?";
    con.query(sql, [req.body.email, req.body.password], (err, result) => {
        if (err) return res.json({ Status: "Error", Error: "Error in running query" });
        if (result.length > 0) {
            const id = result[0].id
            const token = jwt.sign({role: "admin"}, "jwt-secret-key", {expiresIn: '1d'});
            res.cookie('token', token)
            return res.json({ Status: "Success" })
        } else {
            return res.json({ Status: "Error", Error: "Wrong Email Password" });
        }
    })
})

// Login Api For EmployeeLogin
app.post('/EmployeeLogin', (req, res) => {
    const sql = "SELECT * FROM employee where  email=?";
    con.query(sql, [req.body.email], (err, result) => {
        if (err) return res.json({ Status: "Error", Error: "Error in running query" });
        if (result.length > 0) {
            bcrypt.compare(req.body.password.toString(), result[0].password, (err, response)=>{
                if(err)  return res.json({ Error: "Password Error"});
                const token = jwt.sign({role: "employee", id: result[0].id}, "jwt-secret-key", {expiresIn: '1d'});
                res.cookie('token', token)
                return res.json({ Status: "Success", id: result[0].id })
            })
        } else {
            return res.json({ Status: "Error", Error: "Wrong Email Password" });
        }
    })
})

// Api to Update User
app.put('/update/:id', (req, res) => {
    const id = req.params.id;
    const sql = "UPDATE employee set `name` =?, `email` =?, `address` =?, `salary` =? WHERE  id= ?";

    const values = [
        req.body.name,
        req.body.email,
        req.body.address,
        req.body.salary
    ]
    con.query(sql, [...values, id], (err, data) => {
        if (err) return res.json({ Error: "Update Employee Error in sql" })
        return res.json({ Status: "Success" })
    })
})

app.get('/logout', (req, res)=>{
    res.clearCookie('token');
    return res.json({Status: "Success"});
})
// APi for Adding Employees
app.post('/create', upload.single('image'), async (req, res) => {
    try {
        const hash = await bcrypt.hash(req.body.password.toString(), 10);

        const sql = 'INSERT INTO employee (`name`, `email`, `password`, `salary`, `address`, `image`) VALUES (?, ?, ?, ?, ?, ?)';
        const values = [
            req.body.name,
            req.body.email,
            hash,
            req.body.salary,
            req.body.address,
            req.file.filename,
        ];

        con.query(sql, values, (err, result) => {
            if (err) {
                console.error('Error in SignUp query:', err);
                return res.json({ Error: 'Error in SignUp query' });
            }
            return res.json({ Status: 'Success' });
        });
    } catch (error) {
        console.error('Error in hashing password:', error);
        return res.json({ Error: 'Error in hashing password' });
    }
});

// Count Api
app.get('/adminCount', (req, res)=>{
    const sql = "select count(id) as admin from users";
    con.query(sql, (err, result) =>{
        if(err) return res.json({Status: "Error", Error: "Error in running query"});
        return res.json(result);
    })
})

app.get('/employeeCount', (req, res)=>{
    const sql = "select count(id) as employee from employee";
    con.query(sql, (err, result) =>{
        if(err) return res.json({Status: "Error", Error: "Error in running query"});
        return res.json(result);
    })
})

app.get('/employeeSalary', (req, res)=>{
    const sql = "select sum(salary) as sumOfSalary from employee";
    con.query(sql, (err, result) =>{
        if(err) return res.json({Status: "Error", Error: "Error in running query"});
        return res.json(result);
    })
})

// Api for Deeleting User from the employee table
app.delete('/delete/:id', (req, res)=>{
    const id = req.params.id;
    const sql = "DELETE FROM employee WHERE  id= ?";

    con.query(sql, [id], (err, result) => {
        if (err) return res.json({ Error: "Delete Employee Error in sql" })
        return res.json({ Status: "Success" })
    })
})
const verifyUser  = (req, res, next) => {
    const token = req.cookies.token;
    if(!token){
        return res.json({Error: "You are not Authenticated"})
    } else{
        jwt.verify(token, "jwt-secret-key", (err, decoded) =>{
            if(err) return res.json({Error: "Token Wrong"});
            req.role = decoded.role;
            req.id = decoded.id;
            next();
        })
    }
}
// Api to get employee Detail
app.get('/employee/:id', (req, res)=>{
    const id = req.params.id;
    const sql = "SELECT * FROM employee where id=?"
    con.query(sql, [id], (err, result)=>{
        if(err) return res.json({Error: "Get employee error in sql"});
        return res.json({Status: "Success", Result: result})
    })
})
// Api to Verify User in Dashboard
app.get('/dashboard',verifyUser, (req, res)=>{
    return res.json({Status: "Success", role: req.role, id: req.id})
})
app.listen(8081, () => {
    console.log("Running")
})
