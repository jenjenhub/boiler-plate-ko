const express = require('express')
const app = express()
const port = 4000
const bodyParser = require ('body-parser')   //bodyParser로 인해서 req.body를 받을 수 있게 됨
const {User}= require('./models/User')
const config = require('./config/key')

// application/x-www-form-urlencoded 이렇게 된 데이터를 분석해서 가져올 수 있게 해줌
app.use(bodyParser.urlencoded({extended:true}));
// application/json 타입으로 된 것을 분석해서 가져올 수 있게 해줌
app.use(bodyParser.json());

const mongoose = require('mongoose')
mongoose.connect(config.mongoURI,{
   // useNewUrlParser:true, useUnifiedTopology:true, useCreateIndex:true, useFindAndModify:false
}).then (()=> console.log('MongoDB connected!'))
.catch(err=>console.log(err))



app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.post('/register', (req,res) => {
    // 회원가입 : 회원가입할때 필요한 정보들을 client에서 가져오면 그것들을 db에 넣어준다.
   const user = new User (req.body)   // ! 이부분이 req.body를 User 모델에 넣은거라고 ?
   user.save((err, userInfo)=>{         //save는 mongoDB method
       if(err) return res.json({success : false, err})
       return res.status(200).json({success : true})
   })
})

app.post('/login', (req,res)=>{
    // 요청된 email이 db에 있는지 찾는다
    User.findOne({email: req.body.email}, (err, userInfo) => {
    // 요청된 email이 db에 없다면
        if(!userInfo){    
            res.json({loginSuccess:false, message:"제공된 이메일에 해당하는 유저가 없습니다"})
        }
    // 요청된 email이 db에 있다면 password가 맞는 password인지 확인
    userInfo.comparePassword(req.body.password, (err, isMatch) => {    //comparePassword 메서드는 User.js에서 생성
    // password가 틀리다면
       if(!isMatch)   
           return res.json({loginSuccess:false, message:"비밀번호가 틀렸습니다"})
     // password가 맞다면 토큰생성
       userInfo.generateToken((err, userInfo) => { 
    })
})
})
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})