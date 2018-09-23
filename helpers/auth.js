// 实现登录守卫,在用户没有登录的情况下是不能进入的课程详情之类的页面当中的,加上这个单行守卫之后就可以实现
module.exports = {
    ensureAuthenticated: (req, res, next) => {
        if (req.isAuthenticated()) {
            return next();
        }
        req.flash('error_msg', '请先登录!');
        res.redirect('/users/login');
    }
}