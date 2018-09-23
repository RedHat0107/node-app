let express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
//const bcrypt = require('bcrypt');
const router = express.Router();
const passport = require('passport');
const crypto = require("crypto");


var jsonParser = bodyParser.json()
var urlencodedParser = bodyParser.urlencoded({ extended: false });

// 加载module
require('../modules/users');
const User = mongoose.model('users');

// users login and register
router.get('/login', (req, res) => {
    res.render('users/login');
})

router.post('/login', urlencodedParser, (req, res, next) => {
    // local 固定的名字
    passport.authenticate('local', {
        successRedirect: '/ideas',
        failureRedirect: '/users/login',
        failureFlash: true,
    })(req, res, next);
})

router.get('/register', (req, res) => {
    res.render('users/register');
})

router.post('/register', urlencodedParser, (req, res) => {
    let errors = [];
    if (req.body.password != req.body.password2) {
        errors.push({
            text: '两次密码不一致!'
        })
    }
    if (req.body.password.length<4) {
        errors.push({
            text: '密码的长度不能小于4位!'
        })
    }
    if (errors.length > 0) {
        res.render('users/register', {
            errors,
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            password2: req.body.password2
        })
    } else {
        User.findOne({ email: req.body.email }).then(user => {
            if (user) {
                req.flash('error_msg', '邮箱已经存在,请更换邮箱注册~');
                res.redirect('/users/register');
            } else {
                
                const newUser = new User({
                    name: req.body.name,
                    email: req.body.email,
                    password: req.body.password
                })
                let md5 = crypto.createHash("md5");
                newUser.password = md5.update(newUser.password).digest("hex");
                newUser.save().then(user => {
                    req.flash('success_msg', '账号注册成功');
                    res.redirect('/users/login');
                }).catch(error => {
                    req.flash('error_msg', '账号注册失败');
                    res.redirect('/users/register');
                })
                
                /* bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if (err) {
                            throw err;
                        } else {
                            newUser.password = hash;
                            newUser.save().then(user => {
                                req.flash('success_msg', '账号注册成功');
                                res.redirect('/users/login');
                            }).catch(error => {
                                req.flash('error_msg', '账号注册失败');
                                res.redirect('/users/register');
                            })
                        }
                    })
                }) */
                

            }
        })        
    }
})

router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success_msg', '退出成功!');
    res.redirect('login');
})

module.exports = router;