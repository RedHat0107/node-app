// 引入express模块
let express = require('express');
let exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const flash = require('connect-flash');
const methodOverride = require('method-override');
const path = require('path');
const passport = require('passport');
const db = require('./config/database');


// 初始化express实例
let app = express();

// load routes
const ideas = require('./routers/ideas');
const users = require('./routers/users');

require('./config/passport')(passport);

// 连接数据库
//mongoose.connect('mongodb://localhost/node')
mongoose.connect(db.mongoURL)
    .then(() => {
    console.log('mongoDB OK')       
}).catch((err) => {
    console.log(err);
    });



// handlebars middleware
app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

// 使用静态文件
app.use(express.static(path.join(__dirname, 'public')));

app.use(methodOverride('_method'));

// session & flash middleware
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
}));
app.use(passport.initialize());
app.use(passport.session());
  
app.use(flash());

// 配置全局变量
app.use((req,res,next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    next();
})

// 配置路由
app.get('/', (req, res) => {
    const title = '大家好,我是王璐!!!';
    res.render('index', {
        title:title
    });
})

app.get('/about', (req,res) => {
    res.render('about');
})

// 使用routers
app.use('/', ideas);
app.use('/users', users);

const port = process.env.PORT || 3000

app.listen(port, () => {
    console.log(`Server started on 3000`);
});