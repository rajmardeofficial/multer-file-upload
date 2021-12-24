const express = require('express')
const multer = require('multer')
const path = require('path')

//set storage engine for multer

const storage = multer.diskStorage({
    destination: './public/uploads/',
    filename: (req, file, cb)=>{
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
});

//init uploads

const upload = multer({
    storage: storage,
    limits: {fileSize: 1000000},
    //to specify which type of file must be uploaded
    fileFilter: (req, file, cb)=>{
        checkFileType(file, cb)
    }
}).single('myImg');

//checkFileType function (custom func)

function checkFileType(file, cb){
    //Allowed extensions

    const fileTypes = /jpeg|jpg|png|gif/;
    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());

    //check mime

    const mimetype = fileTypes.test(file.mimetype)

    if(mimetype && extname){
        return cb(null, true) 
    } else{
        cb('Err: Images only')
    }
}

const app = express();
 app.set('view engine', 'ejs')
 app.use(express.static('public'))

app.get('/', (req, res)=>{
    res.render('index')
})

app.post('/upload', (req, res)=>{
    upload(req, res, (err)=>{

        if(err){
            res.render('index', {msg: err})
        } else {
            if(req.file == 'undefined'){
                res.render('index', {msg: 'No file selected'})
            } else {
                res.render('index', {msg: 'File Uploaded', file: `uploads/${req.file.filename}`})
            }
            
        }
    })
})



app.listen(3000, ()=>console.log('App started on port 3000'))