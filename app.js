// 引入express模块
let express = require('express');
let exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const methodOverride = require('method-override')


// 初始化express实例
let app = express();

// 连接数据库
mongoose.connect('mongodb://localhost/node').then(() => {
    console.log('mongoDB OK')       
}).catch((err) => {
    console.log(err);
    });


// 引入模型
require('./modules/idea');
const Idea = mongoose.model('ideas');

// handlebars middleware
app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

var jsonParser = bodyParser.json()

var urlencodedParser = bodyParser.urlencoded({ extended: false });

app.use(methodOverride('_method'));



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

app.get('/ideas', (req, res) => {  
    Idea.find({

    }).sort({date:'desc'}).then(ideas => {
        res.render('ideas/index', {
            ideas
        });
    });
    
})

app.get('/ideas/add', (req,res) => {
    res.render('ideas/add');
})

// 编辑
app.get('/ideas/edit/:id', (req, res) => {
    Idea.findOne({
        _id:req.params.id
    }).then(idea => {
        res.render('ideas/edit', {
            idea
        });
    })
    
})


app.post('/ideas', urlencodedParser, (req, res) => {
    let errors = [];

    if (!req.body.title) {
        errors.push({
            text:'请输入标题!'
        })
    }
    if (!req.body.details) {
        errors.push({
            text: '请输入内容!'
        })
    }
    if (errors.length > 0) {
        res.render('ideas/add',{
            errors,
            title: req.body.title,
            details: req.body.details
        });
    } else {
        const newUser = {
            title: req.body.title,
            details: req.body.details,
        }
        new Idea(newUser).save().then(idea => {
            res.redirect('/ideas');
        })
    }
   
})

// 实现编辑
app.put('/ideas/:id',urlencodedParser, (req, res) => {
    Idea.findOne({
        _id : req.params.id
    }).then(idea => {
        idea.title = req.body.title;
        idea.details = req.body.details;

        idea.save().then(idea => {
            res.redirect('/ideas');
        });
    })
})

// 实现删除
app.delete('/ideas/:id', (req, res) => {
    Idea.remove({
        _id : req.params.id
    }).then(() => {
        res.redirect('/ideas');
    })   
})

app.listen(3000, () => {
    console.log(`Server started on 3000`);
});