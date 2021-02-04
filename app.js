require('dotenv').config()
const express = require("express")
const bodyParser = require("body-parser")
const ejs = require("ejs")
const https = require("https")
const port = 3000

const app = express()
app.use(express.static("public"))
app.use(bodyParser.urlencoded({extended:true}))
app.set('view engine', 'ejs')

app.get("/",function(req, res){
    res.render('home', {title: 'Subscribe to our Newslatter'})
})

app.post("/",function(req, res){

    const data = {
        members : [
            {
                email_address : req.body.email,
                status : "subscribed",
                merge_fields : {
                    FNAME : req.body.fname,
                    LNAME : req.body.lname,
                }
            }
        ]
    }
    const jasonData = JSON.stringify(data)
    const url = "https://us7.api.mailchimp.com/3.0/lists/"+process.env.LIST_ID
    options = {
        method : "POST",
        auth : "akshay:"+process.env.API_KEY
    }
    const request = https.request(url, options, function(responce){
        console.log(responce.statusCode)
        if(responce.statusCode === 200){
            res.render('home', {title : "You've successfully subscribed ! 😁"})
        }else{
            res.render('home', {title : 'There was an error ☹'})
        }

        responce.on("data", function(data){
            console.log(JSON.parse(data))
        })
    })

    request.write(jasonData)
    request.end()
})

app.post("/failure.html",function(req, res){
    res.redirect("/")
})

app.listen(process.env.PORT || port, function(){
    console.log("Server is runnning at port : "+port)
})
