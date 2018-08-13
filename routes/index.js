const express = require('express');
const router = express.Router();
const md5 = require('blueimp-md5');


const {UserModel} = require('../db/models');


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/*
1)注册成功返回: {code: 0, data: {_id: 'abc', username: ‘xxx’, password:’123’}
2)注册失败返回: {code: 1, msg: '此用户已存在'}
*/

//注册路由
router.post('/register',function (req,res) {
  //获取请求数据
  const {username,password,type} = req.body;
  //处理数据
  UserModel.findOne({username},function (error,userDoc) {
    if(userDoc){//说明此用户存在
      res.send({code: 1, msg: '此用户已存在'});
    }else {//说明此用户不存在
      //数据保存到数据库中
      const userModel = new UserModel({username, password: md5(password), type});
      userModel.save((error,userDoc)=>{
        console.log('save()',error,userDoc);

        //生成cookie,注册成功后自动登录，且七天内有效
        res.cookie('userId',userDoc._id, {maxAge: 1000*60*60*24*7});

        //注册成功
        res.send({code: 0, data: {_id: userDoc._id, username, password}});
      });
    }
  })
  //返回响应
});

//登录路由
router.post('/login',function (req,res) {
  //获取请求数据
  const {username,password} = req.body;
  //处理数据
  UserModel.findOne({username,password:md5(password)},{_id:0, __v:0, password:0},function (error,userDoc){
    if(userDoc){//此用户存在可以直接登录（登录成功）
      //生成cookie,七天内自动登录
      res.cookie('userId',userDoc._id, {maxAge: 1000*60*60*24*7});
      //登录成功
      res.send({code: 0, data: userDoc})
    }else{//登录失败
      res.send({code: 1, msg: '用户名或密码错误'})
    }
    
  })
});
module.exports = router;
