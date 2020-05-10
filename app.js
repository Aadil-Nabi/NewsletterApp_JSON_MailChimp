const express = require("express");
const request = require("request");
const bodyParser = require("body-parser");
const https = require("https");

const app = express();
//To use the static files use below method in express
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}))

app.get("/", function(req, res){
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", function(req, res){
  //req.body will help us to get the input details from HTML form using body-parser package
  const fullName = req.body.fullname;
  const lastName = req.body.lastname;
  const emailId = req.body.email;

  const data = {
    members: [
      {
        email_address: emailId,
        status: "subscribed",
        merge_fields: {
          FNAME : fullName,
          LNAME : lastName
        }
      }
    ]
  }
  const jsonData = JSON.stringify(data);
  const options = {
    method:"POST",
    auth: "aadil:86c9a7d89d659622cc4eebb0cee315d3-us18"
  }

  const url = "https://us18.api.mailchimp.com/3.0/lists/56799c7336"
  const request = https.request(url, options, function(response){

    if(response.statusCode === 200){
      res.sendFile(__dirname +"/success.html")
    }
    else{
      res.sendFile(__dirname+"/failure.html")
    }

    response.on("data", function(data){
      console.log(JSON.parse(data));
    })

  })

  request.write(jsonData);
  request.end();

});

app.post("/failure", function(req, res){
  res.redirect("/")
})





app.listen(3000, function(){
  console.log("Sever listining on port 3000");
})

// API KEY     86c9a7d89d659622cc4eebb0cee315d3-us18
// 56799c7336  list ID
