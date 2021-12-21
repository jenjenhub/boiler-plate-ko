const { User } = require("../models/User");

   // 인증 처리를 하는 곳
let auth = (req, res, next) => {

    // (client에서 받아온) cookie에서 token을 가져온다
    let token = req.cookies.x_auth;    

    // decode token and find user  (User모델에서 만든 findByToken 메서드 가져와 사용)
    User.findByToken(token, (err, user)=> {
        if(err) throw err;
        // if user is not found,
        if(!user) return res.json({isAuth : false, error : true})   //client에 이렇게 전달
        // if user is found,
        req.token = token;
        req.user = user;     //index.js에서 req.token 과 req.user로 이곳의 token과 user를 사용할 수 있게 만들게끔 req에 넣어주는 것.
        next();    // middleware에서 다음으로 넘어갈 수 있게 한다 (index.js line63에서 auth끝나고 (req,res)=> 로 넘어가게끔)

    })

    // 유저가 있으면 인증 ok

    // 유저가 없으면 인증 no

}

module.exports= { auth }