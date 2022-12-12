const express=require("express")
const mongoose= require("mongoose")
const bodyParser= require("body-Parser")
const route= require("../routes/route")
const app = express()

app.use(bodyParser.json())

mongoose.connect("mongodb+srv://Rajnagwanshi:abhishek1410@cluster0.qlrpwrw.mongodb.net/group8Database",
   useNewUrlParser=true ) 

.then(()=>console.log("mongodb is connected"))
.catch(err=>console.log(err))

app.use("/",route)

app.listen(process.env.PORT || 3000, function(){
    console.log("express app is running in this port "+ (process.env.PORT || 3000))
})