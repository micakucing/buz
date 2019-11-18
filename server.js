/**
 * Module dependencies.
 */
var express = require('express'),
    routes = require('./views/routes/'),
    user = require('./views/routes/user'),
    http = require('http'),
    path = require('path');
var fs = require('fs');
var multer = require('multer');
var compression = require('compression')
var minifyHTML = require('express-minify-html');
var compressor = require('node-minify');
var nodemailer = require('nodemailer');
const xoauth2 = require('xoauth2');
var i18n = require("i18n-express");
var helm = require('helmet')
var app = express();
var easyimg = require('easyimage');
//var minify = require('html-minifier').minify;
var minify = require('express-minify');


var cors = require('cors');
const Feed = require('feed')
app.use(compression())
app.use(i18n({
    translationsPath: path.join(__dirname, 'translate'), // <--- use here. Specify translations files path.
    siteLangs: ["en", "id"],
    textsVarName: 'terjemahan'
}));
   app.use(helm.hidePoweredBy({setTo:'xbuz media'}))
   app.use(helm.noSniff())
 app.use(helm.frameguard())
app.use(helm.xssFilter())
app.use(function (req, res, next) {
    //res.header("X-powered-by", "VIDX")
    //ips = req.headers['x-forwarded-for'] || req.connection.remoteAddress;


    next()
    /*
 sess = req.session;
if (req.headers.host != 'vidx.herokuapp.com') {
        res.send({
            'ups': 'error'
        })
        return
    }
    else {}
    if (req.secure) {
        // request was via https, so do no special handling
        next();
    }
    else {
        // request was via http, so redirect to https
        res.redirect('https://' + req.headers.host + req.url);
    }*/
})
/*
compressor.minify({
    compressor: 'clean-css',
    publicFolder: './public/css/',
    input: ['image.css', 'reset.css', 'style.css', 'why.css', 'animate.css', 'core-style.css', 'font-awesome.min.css', 'jquery-ui.min.css','owl.carousel.css','responsive.css'],
    output: './public/css/all.min.css',
    options: {
        advanced: false, // set to false to disable advanced optimizations - selector & property merging, reduction, etc.
        aggressiveMerging: false
    },
    callback: function (err, min) {}
});

*/
/*
var uploadproduk = multer(
    { 
        dest : '/image/project_image',
        fileFilter : function(req, file , inst){

            var extFile = path.extname(file.originalname);
            if(extFile !== ".png"){
                // skip uploadnya
                inst(null, false)
            } else {
                inst(null, true)
            }
        }
    }
);
app.post('/fileupload', uploadproduk.single('photo'), function(req,res){
    if(req.file){
        sharp('./'+req.file.path).toBuffer().then(
            (data) => {
                sharp(data).resize(150).toFile('./'+req.file.path, (err,info) => {
                    res.send("oke");
                });
            }
        ).catch(
            (err) => {
                res.send('something wrong');
            }
        )
    } else {
        console.log('kamu upload apa hayoo');
        res.send('kamu upload apa gan? file apa hayoo');
    }
});
*/


app.get('/xbuz-rssfeed/artikelfeed', function (req, res) {
    let feed = new Feed({
        title: '',
        description: 'This is my personal feed!',
        id: 'http://example.com/',
        link: 'http://example.com/',
        image: 'http://example.com/image.png',
        favicon: 'http://example.com/favicon.ico',
        copyright: 'All rights reserved 2013, John Doe',
        updated: new Date(2013, 06, 14), // optional, default = today
        generator: 'awesome', // optional, default = 'Feed for Node.js'
        feedLinks: {
            json: 'https://example.com/json',
            atom: 'https://example.com/atom',
        }
    })



    db.query('SELECT * FROM artikel_data', function (err, resultsa) {


        for (var i = 0; i < resultsa.length; i++) {

            console.log(resultsa[i].judul_atikel)
            feed.addItem({
                title: resultsa[i].judul_atikel,
                id: 'http://example.com/',
                link: 'http://example.com/',
                image: 'http://example.com/ds.png',
                favicon: 'http://example.com/favicon.ico',
                copyright: 'All rights reserved 2013, John Doe',
                updated: new Date(2013, 06, 14), // optional, default = today
                generator: 'awesome', // optional, default = 'Feed for Node.js'
                feedLinks: {
                    json: 'https://example.com/json',
                    atom: 'https://example.com/atom',
                }
            })

        }
        res.set('Content-Type', 'application/rss+xml');

        res.send(feed.json1())
    })

})

/* project image path */
app.get('/projectimage/:name', function (req, res) {
    var name = req.params.name;
    const path = 'public/image/project_image/min/' + name
    const stat = fs.statSync(path)
    const fileSize = stat.size
    const file = fs.createReadStream(path)
    const head = {
        'Content-Length': fileSize,
        'Content-Type': 'image/jpeg',
        'Cache-Control': 'max-age=3600'
    }
    res.writeHead(200, head)
    file.pipe(res)
})

/* artikel image path */
app.get('/artikelimage/:name', function (req, res) {
    var name = req.params.name;
    const path = 'public/image/artikel_image/min/'+name
    const stat = fs.statSync(path)
    const fileSize = stat.size
    const file = fs.createReadStream(path)
    const head = {
        'Content-Length': fileSize,
        'Content-Type': 'image/jpeg',
        'Cache-Control': 'max-age=3600'
    }
    res.writeHead(200, head)
    file.pipe(res)
})

/* slide image path */
app.get('/slideimage/:name', function (req, res) {
    var name = req.params.name;
    const path = 'public/image/slide_image/min/' + name
    const stat = fs.statSync(path)
    const fileSize = stat.size
    const file = fs.createReadStream(path)
    const head = {
        'Content-Length': fileSize,
        'Content-Type': 'image/jpeg',
        'Cache-Control': 'max-age=3600'
    }
    res.writeHead(200, head)
    file.pipe(res)
})


/* slide asset path */
app.get('/assetimage/:name', function (req, res) {
    var name = req.params.name;
    const path = 'public/image/webasset/' + name
    const stat = fs.statSync(path)
    const fileSize = stat.size
    const file = fs.createReadStream(path)
    const head = {
        'Content-Length': fileSize,
        'Content-Type': 'image/jpeg',
        'Cache-Control': 'max-age=3600'
    }
    res.writeHead(200, head)
    file.pipe(res)
})


/* photo asset path */
app.get('/potogaleryimage/:name', function (req, res) {
    var name = req.params.name;
    const path = 'public/image/photo_gallery/min/'+name
    const stat = fs.statSync(path)
    const fileSize = stat.size
    const file = fs.createReadStream(path)
    const head = {
        'Content-Length': fileSize,
        'Content-Type': 'image/jpeg',
        'Cache-Control': 'max-age=3600'
    }
    res.writeHead(200, head)
    file.pipe(res)
})


/* about asset path */
app.get('/aboutsimage/:name', function (req, res) {
    var name = req.params.name;
    const path = 'public/image/about_image/' + name
    const stat = fs.statSync(path)
    const fileSize = stat.size
    const file = fs.createReadStream(path)
    const head = {
        'Content-Length': fileSize,
        'Content-Type': 'image/jpeg',
        'Cache-Control': 'max-age=3600'
    }
    res.writeHead(200, head)
    file.pipe(res)
})


var cloudinary = require('cloudinary');
cloudinary.config({
    cloud_name: 'dsl4hppsk',
    api_key: '613128266124975',
    api_secret: '1l6oom5dz0lJsSibRtUWjA1njRg'
});
/*
compressor.minify({
    compressor: 'clean-css',
    publicFolder: './public/css/',
    input: ['image.css', 'reset.css', 'style.css', 'why.css', 'animate.css', 'core-style.css', 'font-awesome.min.css', 'jquery-ui.min.css','owl.carousel.css','responsive.css'],
    output: './public/css/all.min.css',
    options: {
        advanced: false, // set to false to disable advanced optimizations - selector & property merging, reduction, etc.
        aggressiveMerging: false
    },
    callback: function (err, min) {}
});
compressor.minify({
    compressor: 'clean-css',
    publicFolder: './public/css/',
    input: ['animate.css', 'bootstrap.min.css', 'owl.carousel.css','themify-icons.css'],
    output: './public/css/front.min.css',
    options: {
        advanced: false, // set to false to disable advanced optimizations - selector & property merging, reduction, etc.
        aggressiveMerging: false
    },
    callback: function (err, min) {}
});
*/
//var methodOverride = require('method-override');
var session = require('express-session');
const fileUpload = require('express-fileupload');


var mysql = require('mysql');

app.use(compression())

app.use(fileUpload({
    limits: {
        fileSize: 50 * 1024 * 1024
    },
}));







/*var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'test'
});
*/


 


app.use(minifyHTML({
    override: true,
    exception_url: false,
    htmlMinifier: {
        removeComments: false,
        collapseWhitespace: true,
        collapseBooleanAttributes: false,
        removeEmptyAttributes: true,
        minifyJS: true
    }
}));
 

 app.use(minify({removeAttributeQuotes: true,minifyCSS: true}));

 
/*
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    port: '',
    password: '',
    database: 'xbuzdata',
    connectTimeout: 30000,
    multipleStatements: true
});
*/

var connection = mysql.createConnection({
    host: 'remotemysql.com',
    user: 'Ndxvf7NaJT',
    port: '3306',
    password: 'zLplc778dV',
    database: 'Ndxvf7NaJT'
});

connection.connect();

global.db = connection;

// all environments
app.set('port', process.env.PORT || 8080);
var port = process.env.PORT || 8080;

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
var bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 3600000,
        expires: false
    }
}))

// delete prod
app.get('/home/addsomeimageproject/delete/:id', function (req, res) {
    var name = req.params.id;
    var sql = "SELECT * FROM gambar_produk WHERE `produk_id_gambar`='" + name + "'";
    db.query(sql, function (err, rows) {
        if (err) throw err;
        if (rows.length > 0) {
            for (var i = 0; i < rows.length; i++) {
                var filePath = './public/image/project_image/min/'+rows[i].uri_gambar;
                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath);
                } else {}

            }
        }

        var sqls = "DELETE FROM gambar_produk  WHERE produk_id_gambar='" + name + "'";
        db.query(sqls, function (err, results) {
            var sql = "DELETE FROM produk_data WHERE produk_id='" + name + "'";
            db.query(sql, function (err, rowsa) {
                if (err) throw err;

                          res.redirect("/home/project-page-data");
                
            })

        })

    })

})
app.get('/searchresult/:name', function (req, res) {
    var name = req.params.name;


    db.query('SELECT * , (SELECT uri_gambar FROM gambar_produk WHERE produk_data.produk_id=gambar_produk.produk_id_gambar LIMIT 1) AS gambars FROM produk_data WHERE `title_produk` LIKE "%' + name + '%" LIMIT 5', function (err, results) {

        db.query('SELECT * FROM artikel_data WHERE `judul_atikel` LIKE "%' + name + '%" LIMIT 5', function (err, resultsa) {

            db.query('SELECT * FROM video_galery WHERE `title_video` LIKE "%' + name + '%"  LIMIT 5', function (err, resultsx) {


                res.setHeader('Content-Type', 'application/json');
                res.send(JSON.stringify({

                    project: results,
                    artikel: resultsa,
                    video: resultsx

                }));


            })

        })

    })

})

app.post('/home/postmailtokomen', function (req, res) {
if (req.method == "POST") {
        var post = req.body;
        var name = post.mails;
        var text = post.textme;
            var sub = post.subject

        if (!text) {



            return
        } else {
             let transporter = nodemailer.createTransport({
                // host: 'smtp.gmail.com',
               host:'mail.xbuz.co.id',
                port: 465,
                secure: true,
                auth: {
                    user: 'adminsupport@xbuz.co.id',
                    pass: '{jdz0E]OUKdT'
                },
                  tls: {rejectUnauthorized: false},
            debug:true
            });
        
  let mailOptions = {
                from: '"xbuz admin" <adminsupport@xbuz.co.id>', // sender address
                to: name, //req.body.to, // list of receivers
                subject: sub, //req.body.subject, // Subject line
                text: '', //req.body.body, // plain text body
                html: '<div style="width: 100%; height: 100px;   margin-top:20px; text-align: center;">  <div class="logo" style="height: 50px; margin-bottom: 50px; margin: 0 auto; width: 150px; position: relative; background-image: url(https://www.xbuz.co.id/assetimage/logoad.png);background-size: cover;background-position: center;"></div></div>' + text // html body
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    return console.log(error);
                }
                console.log('Message %s sent: %s', info.messageId, info.response);
                res.send('sukses')

            })
/*
       let transporter = nodemailer.createTransport({
               // host: 'smtp.gmail.com',
                host:'mail.xbuz.co.id',
                port: 465,
                secure: true,
                auth: {
                    user: 'adminsupport@xbuz.co.id',
                    pass: '{jdz0E]OUKdT'
                }
            });
            let mailOptions = {
                from: '"xbuz admin" <adminsupport@xbuz.co.id>', // sender address
                to: name, //req.body.to, // list of receivers
                subject: sub, //req.body.subject, // Subject line
                text: '', //req.body.body, // plain text body
                html: '<div style="width: 100%; height: 100px;   margin-top:20px; text-align: center;">  <div class="logo" style="  height: 150px;margin: 0 auto;width: 250px; background-image: url(https://www.xbuz.co.id/assetimage/logoad.png);background-size: cover;background-position: center;"></div></div>' + text // html body
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    return console.log(error);
                }
                console.log('Message %s sent: %s', info.messageId, info.response);
                res.send('sukses')

            });*/
 }
    
    } else {


    }
    
})

app.post('/home/postmailto', function (req, res) {

    if (req.method == "POST") {
        var post = req.body;
        var name = post.mails;
        var text = post.textme;
        var sub = post.subject
        if (!text) {



            return
        } else {
 
             let transporter = nodemailer.createTransport({
               // host: 'smtp.gmail.com',
               host:'mail.xbuz.co.id',
                port: 465,
                secure: true,
                auth: {
                    user: 'adminsupport@xbuz.co.id',
                    pass: '{jdz0E]OUKdT'
                },
                  tls: {rejectUnauthorized: false},
            debug:true
            });
            let mailOptions = {
                from: '"xbuz admin" <adminsupport@xbuz.co.id>', // sender address
                to: name, //req.body.to, // list of receivers
                subject: sub, //req.body.subject, // Subject line
                text: '', //req.body.body, // plain text body
                html: '<div style="width: 100%; height: 100px;   margin-top:20px; text-align: center;">  <div class="logo" style="height: 50px; margin-bottom: 50px;margin: 0 auto;width: 150px; position: relative; background-image: url(https://www.xbuz.co.id/assetimage/logoad.png);background-size: cover;background-position: center;"></div></div>' + text // html body
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    return console.log(error);
                }
                console.log('Message %s sent: %s', info.messageId, info.response);
                res.send('sukses')

            });

        }
    } else {


    }
})
 


// development only




app.get('/home/produk/delete/:id', async (req, res) => {


    var ids = req.params.id;

    var userId = req.session.userId;
    if (userId == null) {
        res.redirect("/login");
        return;
    }


    var sql = "SELECT * FROM gambar WHERE `produk_id`='" + ids + "'";
    var upload_res = [];

    db.query(sql, function (err, rows, fields) {
        if (err) throw err;
        message = '';
        for (i = 0; i < rows.length; i++) {
            upload_res.push(rows[i].public_id);
        }


        cloudinary.v2.api.delete_resources(upload_res, (error, result) => {



        })

        var sqla = "DELETE FROM product  WHERE `produk_id`='" + ids + "'";
        db.query(sqla, function (err, results) {
            message = '';



            var sqls = "DELETE FROM gambar  WHERE `produk_id`='" + ids + "'";
            db.query(sqls, function (err, results) {
                message = '';


                db.query('SELECT * , (SELECT imageuri FROM gambar WHERE product.produk_id=gambar.produk_id LIMIT 1) AS gambars FROM product ', function (err, resultsa) {
                    message = '';

                    res.render('product', {
                        datas: resultsa,

                    });


                });


            });



        });


    });


})


//console.log(query.sql);

app.post('/home/newproduk/save', async (req, res) => {
    // Uploaded files:
    const randomNumber = new Date().getTime() + Math.floor(Math.random() * 1000)



    // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
    /* let sampleFile = req.files.sampleFile;


      //  sampleFile.mv('./public/image/'+req.files.sampleFile.name, function (err) {
      //----- development only --- //
      */

    var a = [req.body.fake1,
                req.body.fake2,
                req.body.fake3,
                req.body.fake4,
                req.body.fake5
               ]

    var b = []
    for (var i = 0; i < 5; i++) {
        if (a[i] !== undefined) {
            b.push(a[i]);
        }
    }
    let newArray = b.filter(arr => arr);

    /*  let upload_len = a.length
          ,upload_res =  new Array();
 
        for(let i = 0; i < upload_len; i++)
        {
            let filePath = a[i];
 
              await  cloudinary.v2.uploader.upload(filePath, {},
            function (result, img) {
               


                  /*push public_ids in an array */
    //   upload_res.push({nm: img});
    //
    /*  })

        } 
  
    
                     console.log(upload_res)
*/

    //resa.json({'response':upload_res})
    console.log(req.body.hargaproduk)

    var to
    if (!req.body.diskonproduk) {
        ds = '0'
    } else {
        ds = req.body.diskonproduk
    }
    var sqla = "INSERT INTO product (product_name, id_kategori, deskripsi, harga, diskon) VALUES ('" + req.body.namaproduk + "','" + req.body.kategoriproduk + "','" + req.body.deskripsiproduk + "','" + req.body.hargaproduk + "','" + ds + "')";

    db.query(sqla, function (err, result) {
        if (err) throw err;

        to = result.insertId;

    });


    let upload_len = newArray.length,
        upload_res = [];

    let multipleUpload = new Promise(async (resolve, reject) => {


            for (let i = 0; i <= upload_len + 1; i++) {
                let filePath = newArray[i];
                await cloudinary.v2.uploader.upload(filePath, (error, result) => {

                    if (upload_res.length === upload_len) {
                        /* resolve promise after upload is complete */
                        resolve(upload_res)
                    } else if (result) {
                        /*push public_ids in an array */
                        upload_res.push([result.url, result.public_id, to]);


                    } else if (error) {
                        reject(error)
                    }

                })

            }
        })
        .then((result) => result)
        .catch((error) => error)

    /*waits until promise is resolved before sending back response to user*/
    let upload = await multipleUpload;
    console.log(upload_res)

    if (!upload_res.length) {
        res.sendStatus(200);


    } else {

        var sql = "INSERT INTO `gambar` (imageuri, public_id,  produk_id) VALUES ? ";
        db.query(sql, [upload_res], function (err, resulta) {
            if (err) throw err;
            //  res.redirect("/home/productpage");


            res.sendStatus(200);



        });
    }

});



//--- project data upload edit 
app.post('/home/editprojectdataimage/update/:id', function (req, res) {







});



//-- test cloud project upload
app.post('/home/editproduk/update', async (req, res) => {
    // Uploaded files:
    const randomNumber = new Date().getTime() + Math.floor(Math.random() * 1000)



    // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
    /* let sampleFile = req.files.sampleFile;


      //  sampleFile.mv('./public/image/'+req.files.sampleFile.name, function (err) {
      //----- development only --- //
      */

    var a = [req.body.fake1,
                req.body.fake2,
                req.body.fake3,
                req.body.fake4,
                req.body.fake5
               ]

    var b = []
    for (var i = 0; i < 5; i++) {
        if (a[i] !== undefined) {
            b.push(a[i]);
        }
    }
    let newArray = b.filter(arr => arr);

    /*  let upload_len = a.length
          ,upload_res =  new Array();
 
        for(let i = 0; i < upload_len; i++)
        {
            let filePath = a[i];
            
            
            
              await  cloudinary.v2.uploader.upload(filePath, {},
            function (result, img) {
               


                  /*push public_ids in an array */
    //   upload_res.push({nm: img});
    //
    /*  })

        } 
  
    
                     console.log(upload_res)
*/

    //resa.json({'response':upload_res})
    console.log(req.body.namaproduk)

    var to
    if (!req.body.diskonproduk) {
        ds = '0'
    } else {
        ds = req.body.diskonproduk
    }

    db.query("UPDATE product SET product_name='" + req.body.namaproduk + "', id_kategori='" + req.body.kategoriproduk + "', deskripsi='" + req.body.deskripsiproduk + "', harga='" + req.body.hargaproduk + "', diskon='" + ds + "'  WHERE produk_id='" + req.body.produkid + "'", function (err, result) {
        if (err) throw err;

        to = result.insertId;

    });


    let upload_len = newArray.length,
        upload_res = [];

    let multipleUpload = new Promise(async (resolve, reject) => {


            for (let i = 0; i <= upload_len + 1; i++) {
                let filePath = newArray[i];
                await cloudinary.v2.uploader.upload(filePath, (error, result) => {

                    if (upload_res.length === upload_len) {
                        /* resolve promise after upload is complete */
                        resolve(upload_res)
                    } else if (result) {
                        /*push public_ids in an array */
                        upload_res.push([result.url, result.public_id, req.body.produkid]);


                    } else if (error) {
                        reject(error)
                    }

                })
            }
        })
        .then((result) => result)
        .catch((error) => error)

    /*waits until promise is resolved before sending back response to user*/
    let upload = await multipleUpload;
    console.log(upload_res)

    if (!upload_res.length) {
        res.sendStatus(200);


    } else {

        var sql = "INSERT INTO `gambar` (imageuri, public_id,  produk_id) VALUES ? ";
        db.query(sql, [upload_res], function (err, resulta) {
            if (err) throw err;
            //  res.redirect("/home/productpage");
            res.sendStatus(200);
        });
    }
});







//--- slide upload

app.post('/home/slidepageimage/upload', function (req, res) {
    // Uploaded files:    
    const randomNumber = new Date().getTime() + Math.floor(Math.random() * 1000)
    if (!req.files.sampleFiles) {

        return
    } else {
        // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
        let sampleFile = req.files.sampleFiles;
        sampleFile.mv('./public/image/slide_image/'+ req.files.sampleFiles.name.replace(/ /g,"_"), function (err) {
            //
            // cloudinary.v2.uploader.upload(req.body.fake, {},
            //  function (result, img) {
            var t = randomNumber + req.files.sampleFiles.name.replace(/ /g,"_")
            //var a = img.public_id
            
         easyimg.resize(
        {
            src: './public/image/slide_image/'+ req.files.sampleFiles.name.replace(/ /g,"_"),
            dst: './public/image/slide_image/min/'+randomNumber + req.files.sampleFiles.name.replace(/ /g,"_"),
            width: 650,
        }).then(function(file){
        console.log('success');
        
        fs.unlink('./public/image/slide_image/'+ req.files.sampleFiles.name.replace(/ /g,"_"), (err) => {
                if (err) {

                }
        })
        
    });
           
            
            
            
             
            
            
            var sqla = "INSERT INTO slide_front (image_slide, title_slide, deskrip_slide) VALUES ('" + t + "','" + req.body.tit + "','" + req.body.text + "')";
            db.query(sqla, function (err, results) {
                if (err) throw err;

                var sqla = "SELECT * FROM slide_front";
                db.query(sqla, function (err, resultsa) {

                    var totalStudents = resultsa.length,
                        pageSize = 6,
                        pageCount = Math.round(totalStudents / pageSize),
                        currentPage = 1,
                        studentsa = [],
                        studentsArrays = [],
                        studentsList = [];


                    for (var i = 0; i < totalStudents; i++) {
                        studentsa.push({
                            id: resultsa[i].id_slide,
                            img: resultsa[i].image_slide,
                            title: resultsa[i].title_slide,
                            deskrip: resultsa[i].deskrip_slide
                        });
                    }

                    while (studentsa.length > 0) {
                        studentsArrays.push(studentsa.splice(0, pageSize));
                    }



                    if (typeof req.query.page !== 'undefined') {
                        currentPage = +req.query.page;
                    }


                    studentsList = studentsArrays[+currentPage - 1];
                    res.render('./panel/slidepanel', {
                        datas: studentsList,
                        pageSize: pageSize,
                        totalStudents: totalStudents,
                        pageCount: pageCount,
                        currentPage: currentPage
                    });

                    //----- cloudinary only --- //   
                    /*              if (fs.existsSync('./public/image/'+req.files.sampleFile.name)) {

                      fs.unlink('./public/image/'+req.files.sampleFile.name, (err) => {
                    if (err) {
                        console.log("failed to delete local image:" + err);
                    } else {
                        console.log('successfully deleted local image');
                    }
                });
                                     }*/
                });
            });
            // });
        });
    }
});



app.post('/home/uploadimageprojectstuff', function (req, res) {
 
    var randomNumber = new Date().getTime() + Math.floor(Math.random() * 1000)
    if (!req.files.sampleFiles) {

        return
    } else {
        let sampleFile = req.files.sampleFiles;
        sampleFile.mv('./public/image/project_image/' + randomNumber + req.files.sampleFiles.name.replace(/ /g,"_"), function (err) {

 easyimg.resize({
            src: './public/image/project_image/'+randomNumber + req.files.sampleFiles.name.replace(/ /g,"_"),
            dst: './public/image/project_image/min/'+randomNumber + req.files.sampleFiles.name.replace(/ /g,"_"),
            width: 650,
        }).then(function(file){
         
        fs.unlink('./public/image/project_image/'+randomNumber + req.files.sampleFiles.name.replace(/ /g,"_"), (err) => {
                if (err) {

                }
        })
        
    });



            var t = randomNumber + req.files.sampleFiles.name.replace(/ /g,"_");
            var sqla = "INSERT INTO gambar_produk (uri_gambar, produk_id_gambar, deskrips_pp) VALUES ('" + t + "','" + req.body.numid + "','" + req.body.textedit + "')";
            db.query(sqla, function (err, results) {

                res.redirect('/home/photogalery')



            });
            // });
        });
    }



})




// --- slide edit 



app.post('/home/slide/edit', function (req, res) {
    // Uploaded files:
    const randomNumber = new Date().getTime() + Math.floor(Math.random() * 1000)


    if (!req.files.sampleFile) {

        var tql = 'UPDATE `slide_front` SET  `deskrip_slide`= ?,  `title_slide`= ?  WHERE `id_slide` = ?'
        db.query(tql, [req.body.text, req.body.tits, req.body.idtext], function (err, results) {


            /*console.log(req.body.tits)

            var sqla = "SELECT * FROM slide_front";
            db.query(sqla, function (err, resultsa) {

                var totalStudents = resultsa.length,
                    pageSize = 6,
                    pageCount = Math.round(totalStudents / pageSize),
                    currentPage = 1,
                    studentsa = [],
                    studentsArrays = [],
                    studentsList = [];


                for (var i = 1; i < totalStudents; i++) {
                    studentsa.push({
                        id: resultsa[i].id_slide,
                        img: resultsa[i].image_slide,
                        title: resultsa[i].title_slide,
                        deskrip: resultsa[i].deskrip_slide
                    });
                }

                while (studentsa.length > 0) {
                    studentsArrays.push(studentsa.splice(0, pageSize));
                }

                if (typeof req.query.page !== 'undefined') {
                    currentPage = +req.query.page;
                }

                studentsList = studentsArrays[+currentPage - 1];

                res.render('./panel/slidepanel', {
                    datas: studentsList,
                    pageSize: pageSize,
                    totalStudents: totalStudents,
                    pageCount: pageCount,
                    currentPage: currentPage
                });


            });*/

        })

    } else {
        // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
        let sampleFile = req.files.sampleFile;
      
        sampleFile.mv('./public/image/slide_image/'+randomNumber + req.files.sampleFile.name.replace(/ /g,"_"), function (err) {
          
            var t = randomNumber + '-' + req.files.sampleFile.name.replace(/ /g,"_")
            
            var sqld = "SELECT * FROM slide_front WHERE `id_slide`='"+req.body.idtext;
            db.query(sqld, function (err, resultsi) {
                
                
                 if (fs.existsSync('./public/image/slide_image/min/'+resultsi[0].image_slide)) {
                    fs.unlink('./public/image/slide_image/min/'+resultsi[0].image_slide, (err) => {
                        if (err) {
                            console.log("failed to delete local image:" + err);
                        } else {
                            console.log('successfully deleted local image');
                        }
                    })
                }
                
             
    easyimg.resize({
            src: './public/image/slide_image/'+randomNumber + req.files.sampleFile.name.replace(/ /g,"_"),
            dst: './public/image/slide_image/min/'+randomNumber + req.files.sampleFile.name.replace(/ /g,"_"),
            width: 650,
        }).then(function(file){

        fs.unlink('./public/image/slide_image/'+randomNumber + req.files.sampleFile.name.replace(/ /g,"_"), (err) => {
                if (err) {

                }
        })
        
    });
            
             
               
                var sqql = 'UPDATE `slide_front` SET `image_slide` = ? , `deskrip_slide`= ?, `title_slide`= ?  WHERE `id_slide` = ?';

                db.query(sqql, [t, req.body.text, req.body.tits, req.body.idtext], function (err, results) {
 
                });
               
               
            });
        });
    }

});



app.post('/postkarir/:id', function (req, res) {
 
     if (!req.files.sampleFiles) {
   var d =  req.params.id;
         
                 res.redirect("/apply-page-id/"+d);

        return
    } else {
            const randomNumber = new Date().getTime() + Math.floor(Math.random() * 1000)
        let sampleFile = req.files.sampleFiles;

        
                sampleFile.mv('./public/loadded/' + randomNumber + req.files.sampleFiles.name, function (err) {

         
        var post = req.body;
        var name = post.nama;
        var selec = post.kategoriartikel;
        var alamat = post.alamat
        var telepon = post.telpon;
                            var email = post.email;
                            var posi = post.posisi;

        var isi = post.isi
var maisl = 'mr.sanan27@gmail.com'
        let transporter = nodemailer.createTransport({
            // host: 'smtp.gmail.com',
            host: 'mail.xbuz.co.id',
            port: 465,
            secure: true,
            auth: {
                user: 'adminsupport@xbuz.co.id',
                pass: '{jdz0E]OUKdT'
            },
            tls: {
                rejectUnauthorized: false
            },
            debug: true
        });

        let mailOptions = {
            from: '"xbuz admin" <adminsupport@xbuz.co.id>', // sender address
            to: maisl, //req.body.to, // list of receivers
            subject: 'Prihal lamaran pekerjaan  email user ' + email, //req.body.subject, // Subject line
            text: '', //req.body.body, // plain text body
            html: '<h3>Posisi pekerjaan yang di inginkan ' +posi + '</h3><br><br><br>Nama Lengkap : ' + name + '<br>' + 'Jenis kelamin : ' + selec + '<br>' + 'Alamat Lengkap : ' + alamat + '<br>' + 'Nomer Telepon : ' + telepon + '<br><br>'  + isi.replace(/\n/g, '<br/>'), // html body,
            attachments: [{
                filename:  randomNumber + req.files.sampleFiles.name,
                path: './public/loadded/'+ randomNumber + req.files.sampleFiles.name,
                contentType: 'application/pdf'
  }]
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.log(error);
            }
            console.log('Message %s sent: %s', info.messageId, info.response);
            res.send('sukses')

            
           if (fs.existsSync('./public/loadded/' + randomNumber + req.files.sampleFiles.name)) {
                    fs.unlink('./public/loadded/' + randomNumber + req.files.sampleFiles.name, (err) => {
                        if (err) {
                            console.log("failed to delete local image:" + err);
                        } else {
                            console.log('successfully deleted local image');
                        }
                    })
                }
           
        })

                })
    }
    return false
})

//---site map 


        const p=[]
        const v=[]
     db.query('SELECT * FROM `produk_data`', function (err, ra) {
           var u = ra.length
           for(i=0; u > i; i++){
               p.push(ra[i].produk_id)
           }
           })
   db.query('SELECT * FROM `artikel_data`', function (err, ra) {
           var u = ra.length
           for(i=0; u > i; i++){
                           var t =  ra[i].judul_atikel.replace(/ /g,"-")

               v.push({id: ra[i].id_artikel,
                       nm: t
               })
           }
           })
 
function generate_xml_sitemap() {
    // this is the source of the URLs on your site, in this case we use a simple array, actually it could come from the database
    var urls = ['', 'article-categories.html', 'video-page.html', 'gallery-photo.html', 'project-page.html', 'about-us.html', 'contact-us.html', 'career-page.html'];
    // the root of your website - the protocol and the domain name with a trailing slash
    var root_path = 'https://www.xbuz.co.id/';
    // XML sitemap generation starts here

    var priority = 0.5;
    var freq = 'always';
    var a = 0
    var xml = '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';
    for (var i in urls) {
        xml += '<url>';
        xml += '<loc>'+ root_path + urls[i] + '</loc>';
        xml += '<changefreq>'+ freq +'</changefreq>';
         xml += '</url>';
        i++;
    }

       
          
    
    console.log(p)

    for (var i in p) {
        

                  
                  
                   xml += '<url>';
        xml += '<loc>'+ root_path + 'project-page-id/' + p[i] + '.html</loc>';
        xml += '<changefreq>'+ freq +'</changefreq>';
         xml += '</url>';
           }
  
           
        for (var i in v) {

       xml += '<url>';
        xml += '<loc>'+ root_path + 'article-categories-konten/' + v[i].id + '/'+ v[i].nm +'.html</loc>';
        xml += '<changefreq>'+ freq +'</changefreq>';
         xml += '</url>';
           }       
    
    
    xml += '</urlset>';
    return xml;
}

app.get('/sitemap.xml', function(req, res) {
    var sitemap = generate_xml_sitemap(); // get the dynamically generated XML sitemap
    res.header('Content-Type', 'text/xml');
    res.send(sitemap);     
})

app.get('/cpanel',function(req,res){  
    res.redirect('http://mydomain.com')
    return
    
})


app.get('/', user.fronts); //call for main index page
app.get('/about-us.html', user.abouts); //call for main index page
app.get('/contact-us.html', user.kontak); //call for main index page
app.get('/gallery-photo.html', user.gallerypoto); //call for main index page
 
 

app.get('/article-categories.html', user.artikelkategori); //call for main index page
app.get('/article-categories-id/:name/:id.html', user.artikelkatlist); //call for main index page
app.get('/article-categories-konten/:name/:id.html', user.artikelkonten); //call for main index page
app.get('/project-page.html', user.produkproject);
app.get('/project-kategori-page/:name.html', user.projectkategori);
app.get('/project-page-id/:name.html', user.projectpage);
app.get('/gallerykategori-photo/:name.html', user.gallerypotokategori); //call for main index page
app.post('/pesanpost', user.postpesan); //call for signup post 

app.get('/panel-admin-setup', routes.index); //call for main index page
app.get('/signup', user.signup); //call for signup page
app.post('/signup', user.signup); //call for signup post 
app.get('/login', routes.index); //call for login page
app.post('/login', user.login); //call for login post
app.get('/home/dashboard', user.dashboard); //call for dashboard page after login
app.get('/home/logout', user.logout); //call for logout
app.get('/home/profile', user.profile); //to render users profile
app.get('/video-page.html', user.videopage); //call for signup page


app.get('/home/productpage', user.product); //to render users profile
app.get('/home/editproductpage/:id', user.editproduct); //to render users profile
app.get('/home/deletesinglepic/:id', user.deletepic); //to render users profile
app.get('/home/newproductpage', user.newproduct); //to render users profile


//kategori photogallery panel setup
app.get('/home/kategori-photo-panel', user.kategoriphotopanel); //to render kategori artikel page
app.get('/home/kategoriphotopanel/delete/:id', user.kategoriphotopanel_delete);
app.get('/home/edit/kategoriphotopanel/:kategori/part/:data', user.editphotopanel);
app.get('/home/addnew/kategoriphotopanel/part/:data', user.addnewkategoriphotopanel);


//kategori project panel setup
app.get('/home/kategori-project-panel', user.kategoriprojectpanel); //to render kategori artikel page
app.get('/home/kategoriprojectpanel/delete/:id', user.kategoriprojectpanel_delete);
app.get('/home/edit/kategoriprojectpanel/:kategori/part/:data', user.editprojectpanel);
app.get('/home/addnew/kategoriprojectpanel/part/:data', user.addnewkategoriprojectpanel);


//kategori artikel panel setup
app.get('/home/kategori-artikel-panel', user.kategoriartikelpanel); //to render kategori artikel page
app.get('/home/kategoriartikelpanel/delete/:id', user.kategoriartikelpanel_delete);
app.get('/home/edit/kategoriartikelpanel/:kategori/part/:data', user.editartikelpanel);
app.get('/home/addnew/kategoriartikelpanel/part/:data', user.addnewkategoriartikelpanel);



//slide panel setup
app.get('/home/slidepage', user.slidefrontpanel);
app.get('/home/slidepage/delete/:id', user.slide_delete);

//to render kategori artikel page
/*app.get('/home/kategoriartikelpanel/delete/:id', user.kategoriartikelpanel_delete);
app.get('/home/edit/kategoriartikelpanel/:kategori/part/:data', user.editartikelpanel);
app.get('/home/addnew/kategoriartikelpanel/part/:data', user.addnewkategoriartikelpanel);*/



//slideshow
app.get('/home/editslideshow/:id', user.editslideshow); //to render kategori artikel page
app.post('/home/editslideshowposting', user.editslideshowposting); //to render kategori artikel page



//youtube video player setup 
app.get('/home/youtubevideoplayer-panel', user.youtubevideoplayerpanel)
app.get('/home/addnew/youtubevideoplayerpanel/part/:data', user.addnewyoutubevideoplayerpanel);
app.get('/home/youtubevideoplayerpanel/delete/:id', user.youtubevideoplayerpanel_delete);


//profile page setup
app.get('/home/profilepage-panel', user.profilepagepanel)
app.post('/home/copropost', user.copropostpanel)


app.get('/home/subcribedelete/delete/:id', user.deletesubcribe)
app.get('/home/emailkontakdelete/delete/:id', user.deletekomenmail)



//hidtory page setup
app.get('/home/historypage-panel', user.historypagepanel)
app.post('/home/hispropost', user.historypropostpanel)

//subcribe client
app.post('/subscrip', user.postemail)

//subcribe backend
app.get('/home/email-subcribe-panel', user.mailsubcribe); //to render kategori artikel page
app.get('/home/kirimsubcribe/:id', user.halamanbalas); //to render kategori artikel page


//artikel data panel
app.get('/home/artikel-page-panel', user.artikelpanelsetup); //to render kategori artikel page
app.post('/home/artikelnewposting', user.artikelnewsetup); //to render kategori artikel page
app.get('/home/editartikelposting/:id', user.editartikelposting); //to render kategori artikel page
app.post('/home/editartikelpostingpost', user.artikelpostingeditpost); //to render kategori artikel page
app.get('/home/artikelpostingpanel/delete/:id', user.deleteartikelposting); //to render kategori artikel page


//photo gallery panel
app.get('/home/photogalery', user.photogallerysetup)
app.post('/home/newgallerypotokonten/upload', user.uploadphotogallery)
app.get('/home/photogallerypanel/delete/:id', user.deletephotogallery)


// project page panel 
app.get('/home/project-page-data', user.projectpagepanel)
app.get('/home/project-page-data/edit/:id', user.editprojectdata)
app.post('/home/editprojectdata/updates', user.editedprojectdatapost)
app.get('/home/addsomeimageproject/:id', user.addimageproject)
app.get('/home/newprojectkontenimage', user.newprojectstuff)

app.post('/home/savenewproject/saveit', user.savenewproject)



//karir page panel
app.get('/home/karir-page-panel', user.karirpanelsetup)
app.post('/home/karirnewposting', user.karirnewsetup); //to render kategori artikel page
app.get('/home/newkarirdelete/delete/:id', user.newkarirpanel_delete);
app.get('/home/editkarirposting/:id', user.editkarirposting); //to render kategori artikel page
app.post('/home/editkarirpostingpost', user.karirpostingeditpost); //to render kategori artikel page

//careers kategori setup
app.get('/home/kategori-karir-panel', user.kategorikarirpanel); //to render kategori artikel page
app.get('/home/addnew/kategorikarirpanel/part/:data', user.addnewkategorikarirpanel);
app.get('/home/edit/kategorikarirpanel/:kategori/part/:data', user.editkarirpanel);
app.get('/home/kategorikarirpanel/delete/:id', user.kategorikarirpanel_delete);

//postmail
//app.post('/home/postmailto', user.posrepley)
app.get('/home/kontak-komen-panel', user.posrepleykontak); //to render kategori artikel page
app.get('/home/kirimkoment/:id', user.halamankirimkomen); //to render kategori artikel page

// career page 
app.get('/career-page.html', user.careerpage)
app.get('/apply-page-id/:id', user.applys)
app.get('/career-categories-id/:id.html', user.catcaree)

//kategori video pabnel 
app.get('/home/kategori-video-panel', user.kategorivideopanel); //to render kategori artikel page
app.get('/home/addnew/kategorivideopanel/part/:data', user.addnewkategorivideopanel);
app.get('/home/edit/kategorivideopanel/:kategori/part/:data', user.editvideokatpanel);
app.get('/home/kategorivideopanel/delete/:id', user.kategorivideopanel_delete);


//-- video kategori

app.get('/gallerykategori-video/:name.html', user.galleryvideokategori); //call for main index page


app.get('/*.php', function (req, res) {
    res.redirect('/error');
    //res.send(404);
});


//Middleware
app.use(function (req, res) {
    res.render('404', {
        title: "Sorry, page not found",
        pagename: 'notfound'
    });
});
app.get('*', function (req, res) {
    //res.redirect('/');
    res.send(404);
});
app.listen(port)
