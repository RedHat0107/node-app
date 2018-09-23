if (process.env.NODE_ENV === 'production') {
    module.exports = {
        mongoURL:'mongodb://admin:admin123@ds153815.mlab.com:53815/node-20180923'
    }
}else {
    module.exports = {
        mongoURL:'mongodb://localhost/node'
    }   
}