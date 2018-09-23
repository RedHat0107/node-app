const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// 加载model
const User = mongoose.model('users');
module.exports = (passport) => {
    // 使用传过来的passport
    passport.use(new LocalStrategy(
        {usernameField:'email'},
        ( email, password, done) => {
            User.findOne({ email: email }).then((user) => {
                // 判断用户是否在哎数据库中存在
                if (!user) {
                    
                    return done(null,false,{message:'没有这个用户'});
                }

                // 密码验证
                bcrypt.compare(password, user.password, (err, isMatch) => {
                    if (err) throw err;
                    if (isMatch) {
                        return done(null,user)
                    } else {
                        return done(null,false,'密码错误!')
                    }
                })
            })
        }
    ));

    // 序列化和反序列化--> 登录持久化
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });
       
    passport.deserializeUser(function(id, done) {
        User.findById(id, function (err, user) {
            done(err, user);
        });
    });
}
