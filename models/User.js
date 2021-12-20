const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds=10    //salt글자수
const jwt= require('jsonwebtoken')

const userSchema = mongoose.Schema({
    name:{
        type:String,
        maxlength: 50
    },
    email:{
        type:String,
        trim:true,     
        unique: 1
    },
    password:{
        type:String,
        minlength: 5
    },
    lastname:{
        type:String,
        maxlength: 50
    },
    role:{
        type:Number,
        default:0
    },
    image:String,
    token:{
        type:String
    },
    tokenExp:{
        type:Number
    }
})

// * 밑으로는, index.js에서 사용할 method 모음

// index.js의 /register 에서 db에 save전에 실행됨 (pw암호화) / pre는 mongoose의 method
userSchema.pre('save', function(next){    
    //비밀번호를 암호화 시킨다.
    //먼저 salt생성하고, 생성된 salt로 비밀번호를 암호화 시킨다.
  var user = this;    //위에 userSchema, 즉 db를 뜻함

  if(user.isModified('password')) {     //유저가 비번 항목 변경했을 때만 실행된다는 조건 (email 같은거 건드렸을시 실행되지 않음)
  bcrypt.genSalt(saltRounds, function(err,salt){
      if(err) return next(err)

      bcrypt.hash(user.password, salt, function(err, hash){
          if(err) return next(err)
          user.password = hash    // !user.password는 사용자가 입력한 pw, 아직 db들어가기 전이지만 userSchema구조에 맞춰진 상태인데 이걸 hash로만들어 암호화시킨다
          next()
      })
  })}else{   //유저가 비번 말고 다른항목 변경시 실행
      next()
  }
})     

userSchema.methods.comparePassword = function(plainPassword, cb){
    // plainPassword = 사용자가 입력한 그대로 / 암호화된비번 = db에 담겨있다 -> plainPassword를 암호화하여 db의 비번과 비교해야함
    bcrypt.compare(plainPassword, this.password, function(err, isMatch) {
        if(err) return cb(err)    //다를때
        cb(null, isMatch)     //같을때: cb(err가 없고, isMatch가 true)
    })
}

userSchema.methods.generateToken = function(cb){
    var user = this;
    const token = jwt.sign(user._id.toHexString(), 'secretToken')     //_id는 db에 있는 항목이다
    //user._id + 'secretToken' = token
    //'secretToken'을 넣으면 user._id가 나오는 구조. 즉 이 사람이 누구인지 알 수 있음.
    user.token = token   //생성한 token을 db의 token항목에 넣는다
    user.save(function(err, userInformation) {    
    //userInformation은 변수 ! 이 userInformation이 index.js로 가서 generateToken((err,userOk) => 의 userOk위치로 보내진다. 변수일 뿐. userInformation이 뭐지 userOk와 다른건가 궁금해할 필요 X (한 페이지의 한 함수 내의 변수들은 거기서 끝난다고 생각하기. 다른 페이지에서 불러와지면 그건 그 위치에 들어가는 변수일뿐, 이름 같다고 무조건 같나?하면 안됨)
    // userInformation 변수 안에는 token을 담고 있다는게 중요
       if(err) return cb(err)      //err가 있다면 콜백으로 err전달
       cb(null, userInformation)   //save가 잘 되었다면 : 콜백으로 err가 없다는걸 전달하고, userInformation을 전달
    })
}

const User= mongoose.model('User', userSchema)
module.exports= { User }