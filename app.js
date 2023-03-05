require('dotenv').config();
const express=require("express");
const bodyParser=require("body-parser");
const app=express();
const https=require('node:https');
//to serve static files
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.get("/",function(req,res){
//console.log("hello");
 res.sendFile(__dirname + "/signup.html");   
})
app.post("/",function(req,res){
const firstName=req.body.fName;
const lastName=req.body.lName;
const email=req.body.email;
//console.log(firstName,lastName,email);

 const data={
   members: [
    {
        email_address: email,
        status:"subscribed",
        merge_fields:{
            FNAME:firstName,
            LNAME:lastName
        }
    }
   ]
 }
 const jsonData=JSON.stringify(data); //string obj is json format send to mailchimps server
const url="https://us21.api.mailchimp.com/3.0/lists/fb89df9b06";
const options={
    method:"POST",
    auth:process.env.API_KEY
}
 const request=https.request(url,options,function(response){
  if(response.statusCode===200){
    res.sendFile(__dirname + "/success.html");
  }
  else{
    res.sendFile(__dirname + "/failure.html");
  }
  response.on("data",function(data){
    console.log(JSON.parse(data));
  }) 
 })
   request.write(jsonData); //send data with request post
   request.end();

});
app.post("/failure",function(req,res){
res.redirect("/"); //redirect to home route
});
app.listen(3000,function(){
 console.log("server has started on port 3000");   
});
//ad779e0d554d8db20932d17630eff655-us21    mailchimp api key
//fb89df9b06