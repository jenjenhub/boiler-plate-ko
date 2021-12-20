const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds=10    //salt글자수

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

// index.js의 /register 에서 db에 save전에 실행됨 (pw암호화) / pre는 mongoose의 method
userSchema.pre('save', function(next){    
    //비밀번호를 암호화 시킨다.
    //먼저 salt생성하고, 생성된 salt로 비밀번호를 암호화 시킨다.
  var user = this;    //위에 userSchema를 뜻함

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
        if(err) return cb(err),    //다를때
        cb(null, isMatch)     //같을때: cb(err가 없고, isMatch가 true)
    })
}

const User= mongoose.model('User', userSchema)
module.exports= {User}