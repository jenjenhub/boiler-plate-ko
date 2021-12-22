const express = require('express')
const app = express()
const port = 4000
const bodyParser = require ('body-parser')   //bodyParser로 인해서 req.body를 받을 수 있게 됨
const cookieParser = require('cookie-parser')
const config = require('./server/config/key')

const { User }= require('./server/models/User')
const { auth } = require('./server/middleware/auth')

// application/x-www-form-urlencoded 이렇게 된 데이터를 분석해서 가져올 수 있게 해줌
app.use(bodyParser.urlencoded({extended:true}));
// application/json 타입으로 된 것을 분석해서 가져올 수 있게 해줌
app.use(bodyParser.json());
app.use(cookieParser());

const mongoose = require('mongoose')
mongoose.connect(config.mongoURI,{
   // useNewUrlParser:true, useUnifiedTopology:true, useCreateIndex:true, useFindAndModify:false
}).then (()=> console.log('MongoDB connected!'))
.catch(err=>console.log(err))



app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.post('/api/users/register', (req,res) => {     //나중에는 user api뿐만 아니라 product api, comment api 등 여러개 생기므로, 그냥 /register말고 /api/user/register로 specify 해준다.
    // 회원가입 : 회원가입할때 필요한 정보들을 client에서 가져오면 그것들을 db에 넣어준다.
   const user = new User (req.body)   // ! 이부분이 req.body를 User 모델에 넣은거라고 ?
   user.save((err, userInfo)=>{         //save는 mongoDB method
       if(err) return res.json({success : false, err})
       return res.status(200).json({success : true})
   })
})

app.post('/api/users/login', (req,res)=>{
    // 요청된 email이 db에 있는지 찾는다
    User.findOne({email: req.body.email}, (err, userInfo) => {   //err정보는err, db의 email과 req.body.email이 일치하는 유저의 정보(=db에 저장된 유저정보)가 userInfo라는 뜻이다. 그래서 !userInfo 뜻은, 일치하는 유저가 없어서 userInfo에 들어오는 값이 empty하므로 '없다'고 표현하는 것이다.
        
    // 요청된 email이 db에 없다면
        if(!userInfo){    
            res.json({loginSuccess:false, message:"제공된 이메일에 해당하는 유저가 없습니다"})
        }
    // 요청된 email이 db에 있다면 password가 맞는 password인지 확인   (db의유저정보인 userInfo와 입력된비번 비교)
    userInfo.comparePassword(req.body.password, (err, isMatch) => {    //comparePassword 메서드는 User.js에서 생성
    // password가 틀리다면
       if(!isMatch)   
           return res.json({loginSuccess:false, message:"비밀번호가 틀렸습니다"})
     // password가 맞다면 토큰생성 (토큰 사용 위해 jsonwebtoken 라이브러리 다운로드)
       userInfo.generateToken((err, userOK) => { 
           if(err) return res.status(400).send(err)
           // 토큰을 저장한다. 어디에? cookie, local storage, session ...
           res.cookie("x_auth", userOK.token)     //userOk에 userData가 들어오기 때문에, userOK에는 token이 들어있다 (index.js의 generateToken부분 참고)
           .status(200)
           .json({loginSuccess:true, userId: userOK._id})  
        })
})
})
})

app.get('/api/users/auth', auth, (req, res)=> {     // 여기 auth에 middleware/auth.js가 들어옴
    // 여기까지 middleware를 통과해 왔다는 얘기는 Authentication이 true라는 말.
    res.status(200).json({
      _id: req.user._id,
      isAdmin: req.user.role === 0 ? false : true,
      isAuth: true,
      email: req.user.email,
      name: req.user.name,
      lastname: req.user.lastname,
      role: req.user.role,
      image: req.user.image
    }) // userSchema에서 가져오고 싶은 key만 가져오면 됨. 여기서 req.user.어쩌고 사용가능한 이유는 auth.js의 req.token = token; req.user = user; 때문.
})

app.get('/api/users/logout', auth, (req,res)=> {
  User.findOneAndUpdate({_id: req.user._id}, {token : ""}, (err, user)=>{  // auth에서 가져옴, token없애줌, cb
    if(err) return res.json({success:false, err})
    return res.status(200).send({success:true})
  })
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})