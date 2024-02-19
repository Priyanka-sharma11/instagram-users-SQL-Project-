const { faker } = require('@faker-js/faker');
const mysql = require('mysql2');
const express=require('express');
const app=express();
const path=require('path');
const methodOverride=require('method-override');
const { v4: uuidv4 } = require('uuid');

app.use(express.static(path.join(__dirname,'public')));
app.use(methodOverride("_method"));
app.use(express.urlencoded({entended:true}));
app.set("view engine",'ejs');
app.set("views",path.join(__dirname,"/views"));

// Create the connection to database
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'delta_app',
    password:'*priyanka*#61224'
  });

  
let getRandomUser=()=>{
  return [
    faker.string.uuid(), 
    faker.internet.userName(),
    faker.internet.email(),
    faker.internet.password(),
  ];
};  

   
app.get('/',(req,res)=>{
  let q=`SELECT count(*) FROM user`;

  try{
    connection.query(q,(err,result)=>{
        if(err) throw err;
        let count=result[0]['count(*)'];
        res.render('home.ejs',{count});
    });    
  }catch(err){
    console.log(err); 
    res.send('some error in database');
  } 
  
});

//SHOW route
app.get('/user',(req,res)=>{
  let q=`SELECT * FROM user`;
  try{
    connection.query(q,(err,users)=>{
        if(err) throw err;
        res.render('showusers.ejs',{users});
    });    
  }catch(err){
    console.log(err); 
    res.send('some error in database');
  } 
});


//EDIT ROUTE
app.get('/user/:id/edit',(req,res)=>{
  let {id}=req.params;

  let q=`SELECT * FROM user WHERE id = '${id}'`;
  try{
    connection.query(q,(err,result)=>{
        if(err) throw err;
       let user=result[0];
       res.render('edit.ejs',{user});
      console.log(user);
    });    
  }catch(err){
    console.log(err); 
    res.send('some error in database');
  } 
});

//UPDATE (DB) ROUTE
app.patch('/user/:id',(req,res)=>{
  let {id}=req.params;
  let {password:formpass, name:newname}=req.body;
  let q=`SELECT * FROM user WHERE id = '${id}'`;
  try{
    connection.query(q,(err,result)=>{
        if(err) throw err;
        let user=result[0];
        if(user.password==formpass){
           let q2=`UPDATE user SET name='${newname}' WHERE id='${id}'`;
             connection.query(q2,(err,result)=>{
              if(err) throw err;
              res.redirect('/user');
             })
        }else{
           res.send('password Incorrect!!');
        }
    });    
  }catch(err){
    console.log(err); 
    res.send('some error in database');
  } 
  
});

//new route
app.get('/user/new',(req,res)=>{
  res.render('new.ejs');
})

app.post('/user/new',(req,res)=>{
  let id=uuidv4();
  let {name,email,password}=req.body;
  let q=`INSERT INTO user (id,name,email,password) VALUES ('${id}','${name}','${email}','${password}')`;
  try{
    connection.query(q,(err,result)=>{
        if(err) throw err;
       res.redirect('/');
    });    
  }catch(err){
    console.log(err); 
    res.send('some error in database');
  } 
});

//DELETE ROUTE
app.get('/user/:id/delete',(req,res)=>{
  let {id}=req.params;
  let q=`SELECT * FROM user WHERE id='${id}'`;
  try{
    connection.query(q,(err,result)=>{
        if(err) throw err;
        let user=result[0];
        console.log(user);
        res.render('delete.ejs',{user});
    });    
  }catch(err){
    console.log(err); 
    res.send('some error in database');
  } 
});

app.delete('/user/:id',(req,res)=>{
  let {password}=req.body;
  let {id}=req.params;

  let q=`SELECT * FROM user WHERE id='${id}'`;
  try{
    connection.query(q,(err,result)=>{
        if(err) throw err;
        let user=result[0];
        if(user.password==password){
            let q=`DELETE FROM user WHERE id='${id}' and password='${password}'`;
            try{
              connection.query(q,(err,result)=>{
                  if(err) throw err;
                  res.redirect('/');
              });    
            }catch(err){
              console.log(err); 
              res.send('some error in database');
            } 
        }else{res.send('INCORRECT PASSWORD');};
    });    
  }catch(err){
    console.log(err); 
    res.send('some error in database');
  };
});
 

app.listen('8080',()=>{
  console.log('server is listening to port 8080');
});



//Create Form to Add a new user to Database  /user   post
//Create Form to Delete a user from Database if thery enter correct email id & password.   /user/:id    Delete        