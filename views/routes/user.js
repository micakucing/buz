var fs = require('fs');
var cloudinary = require('cloudinary');
var mysqls = require('promise-mysql');
var ala = require('alasql')
var connection;
var striptags = require('striptags');
var sanitizeHtml = require('sanitize-html');
var imagemin = require('imagemin');
//const sharp = require('sharp');
//const gm = require('gm')
var easyimg = require('easyimage');

var imageminMozjpeg = require('imagemin-mozjpeg');
cloudinary.config({
    cloud_name: 'dsl4hppsk',
    api_key: '613128266124975',
    api_secret: '1l6oom5dz0lJsSibRtUWjA1njRg'
});
// inject
function mysql_real_escape_string (str) {
    return str.replace(/[\0\x08\x09\x1a\n\r"'\\\%]/g, function (char) {
        switch (char) {
            case "\0":
                return "\\0";
            case "\x08":
                return "\\b";
            case "\x09":
                return "\\t";
            case "\x1a":
                return "\\z";
            case "\n":
                return "\\n";
            case "\r":
                return "\\r";
            case "\"":
            case "'":
            case "\\":
            case "%":
                return "\\"+char; // prepends a backslash to backslash, percent,
                                  // and double/single quotes
        }
    });
}




//---------------------------------------------signup page call------------------------------------------------------
exports.signup = function (req, res) {
    message = '';
    if (req.method == "POST") {
        var post = req.body;
        var name = post.user_name;
        var pass = post.password;
        var fname = post.first_name;
        var lname = post.last_name;
        var mob = post.mob_no;

        //---------------------------------------------cek user name taken------------------------------------------------------

        var sqla = "SELECT user_name FROM `users` WHERE `user_name`='" + name + "'";
        db.query(sqla, function (err, results) {
            if (results.length) {

                message = '' + name + ' is already taken';
                res.render('signup', {
                    message: message,
                    alert: 'alert-danger'
                });


            } else {

                var sql = "INSERT INTO `users`(`first_name`,`last_name`,`mob_no`,`user_name`, `password`) VALUES ('" + fname + "','" + lname + "','" + mob + "','" + name + "','" + pass + "')";
                var query = db.query(sql, function (err, result) {
                    message = "Succesfully! Your account has been created.";
                    res.render('signup', {
                        message: message,
                        alert: 'alert-success'
                    });
                });
            }
        })
    } else {
        res.render('signup');
    }
};



//-----------------------------------------------contact form user------------------------------------------------------

exports.postpesan = function (req, res) {

    var months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
    var myDays = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jum&#39;at', 'Sabtu'];
    var date = new Date();
    var day = date.getDate();
    var month = date.getMonth();
    var thisDay = date.getDay(),
        thisDay = myDays[thisDay];
    var yy = date.getYear();
    var year = (yy < 1000) ? yy + 1900 : yy;
    var tanggal = thisDay + ', ' + day + ' ' + months[month] + ' ' + year
    if (req.method == "POST") {
        var post = req.body;
        var name = post.nama;
        var email = post.email;

        var tlp = post.notelp;
        var isi = post.isi_k

        var sql = "INSERT INTO `kontak_pesan`(`nama_pengirim`,`email_pengirim`,`no_tlp`,`isi_pesan`, `tenggal_kirim`) VALUES ('" + name + "','" + email + "','" + tlp + "','" + isi + "','" + tanggal + "')";
        var query = db.query(sql, function (err, result) {

            res.send('sukses')

        });

    }

}

//-----------------------------------------------contact form user------------------------------------------------------

exports.postemail = function (req, res) {


    console.log('rama')
    var months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
    var myDays = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jum&#39;at', 'Sabtu'];
    var date = new Date();
    var day = date.getDate();
    var month = date.getMonth();
    var thisDay = date.getDay(),
        thisDay = myDays[thisDay];
    var yy = date.getYear();
    var year = (yy < 1000) ? yy + 1900 : yy;
    var tanggal = thisDay + ', ' + day + ' ' + months[month] + ' ' + year
    if (req.method == "POST") {
        var post = req.body;
        var email = post.subtextme;
        var sql = "SELECT * FROM `subscribe_mail` WHERE `mailuri`='" + email + "'";
        db.query(sql, function (err, results) {
            if (results.length) {
                res.send('error')


            } else {
                var sql = "INSERT INTO `subscribe_mail`(`mailuri`,`date`) VALUES ('" + email + "','" + tanggal + "')";
                var query = db.query(sql, function (err, result) {

                    res.send('sukses')

                });
            }
        })
    }

}









exports.copropostpanel = function (req, res) {

    if (req.method == "POST") {
        var post = req.body;
        var textt = post.textme;
        var knts = post.len;
        var ids = post.idnum;



        console.log(knts)

        if (knts == 'no') {
            var sql = "INSERT INTO `company_pro`(`isi_c`) VALUES ('" + textt + "')";
            var query = db.query(sql, function (err, result) {

                res.send('sukses')

            });



        } else {

            db.query('UPDATE `company_pro` SET `isi_c` = ? WHERE `id` = ?', [textt, ids], function (err, results) {

                res.send('sukses')

            });




        }


    }

}

exports.historypropostpanel = function (req, res) {

    if (req.method == "POST") {
        var post = req.body;
        var textt = post.textme;
        var knts = post.len;
        var ids = post.idnum;



        if (knts == 'no') {
            var sql = "INSERT INTO `history_co`(`isi_h`) VALUES ('" + textt + "')";
            var query = db.query(sql, function (err, result) {

                res.send('sukses')

            });



        } else {
            var d = sanitizeHtml(textt, {
                allowedTags: [],
                allowedAttributes: []
            })
            db.query('UPDATE `history_co` SET `isi_h` = ? WHERE `id` = ?', [textt, ids], function (err, results) {

                res.send('sukses')

            });
        }
    }
}



//-----------------------------------------------login page call------------------------------------------------------
exports.login = function (req, res) {
    var message = '';
    var sess = req.session;

    if (req.method == "POST") {
        var post = req.body;
        var name = post.user_name;
        var pass = post.password;

        var sql = "SELECT * FROM `admin_user` WHERE `admin_name`='" + name + "' and password_admin = '" + pass + "'";
        db.query(sql, function (err, results) {
            if (results.length) {
                req.session.userId = results[0].id_admin;
                req.session.user = results[0];
                res.redirect('/home/dashboard');
                console.log(results[0].id)
            } else {
                message = 'Wrong Credentials.';
                res.render('./panel/frontadm', {
                    message: message
                });
            }

        });
    } else {
        res.render('./panel/frontadm', {
            message: message
        });
    }

};
//-----------------------------------------------dashboard page functionality----------------------------------------------

exports.dashboard = function (req, res, next) {

    var user = req.session.user,
        userId = req.session.userId;
    if (userId == null) {
        res.redirect("/login");
        return;
    }

    var sql = "SELECT * FROM `admin_user` WHERE `id_admin`='" + userId + "'";

    db.query(sql, function (err, results) {
        res.render('./panel/dashboard', {
            user: results[0].admin_name
           
        });
    });
};
//------------------------------------logout functionality----------------------------------------------
exports.logout = function (req, res) {
    req.session.destroy(function (err) {
        res.redirect("/login");
    })
};
//--------------------------------render user details after login--------------------------------
exports.profile = function (req, res) {

    var userId = req.session.userId;
    if (userId == null) {
        res.redirect("/login");
        return;
    }

    var sql = "SELECT * FROM `users` WHERE `id`='" + userId + "'";
    db.query(sql, function (err, result) {
        res.render('profile', {
            data: result
        });
    });
};
//---------------------------------edit users details after login----------------------------------
exports.editprofile = function (req, res) {
    var userId = req.session.userId;
    if (userId == null) {
        res.redirect("/login");
        return;
    }

    var sql = "SELECT * FROM `users` WHERE `id`='" + userId + "'";
    db.query(sql, function (err, results) {
        res.render('edit_profile', {
            data: results
        });
    });
};

// ---- photo gallery setup 

exports.photogallerysetup = function (req, res) {
    var userId = req.session.userId;
    if (userId == null) {
        res.redirect("/login");
        return;
    }
    var sqla = "SELECT * FROM kategori_poto";
    db.query(sqla, function (err, resultss) {

        var sql = "SELECT * FROM photo_galery";
        db.query(sql, function (err, results) {
            message = '';

            var totalStudents = results.length,
                pageSize = 4,
                pageCount = Math.round(totalStudents / pageSize),
                currentPage = 1,
                students = [],
                studentsArrays = [],
                studentsList = [];

            for (var i = 0; i < totalStudents; i++) {
                students.push({
                    id: results[i].id_photo_galery,
                    img: results[i].imageuri,
                    deskrip: results[i].deskrip,
                    kat: results[i].kategori_poto
                });
            }

            while (students.length > 0) {
                studentsArrays.push(students.splice(0, pageSize));
            }

            if (typeof req.query.page !== 'undefined') {
                currentPage = +req.query.page;
            }

            studentsList = studentsArrays[+currentPage - 1];
            res.render('./panel/pannelgalleryphoto', {
                datas: studentsList,
                pageSize: pageSize,
                totalStudents: totalStudents,
                pageCount: pageCount,
                currentPage: currentPage,
                katpoto: resultss
            });

            //   res.render('kategori',{data:results,message: message });
        });
    });
    //console.log(query.sql);
};


//-----------------------------------------------photo gallery upload page call------------------------------------------------------


exports.uploadphotogallery = function (req, res) {
    var userId = req.session.userId;
    if (userId == null) {
        res.redirect("/login");
        return;
    }
    const randomNumber = new Date().getTime() + Math.floor(Math.random() * 1000)
    if (!req.files.sampleFiles) {

        return
    } else {
        // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
        let sampleFile = req.files.sampleFiles;
        sampleFile.mv('./public/image/photo_gallery/' + randomNumber + req.files.sampleFiles.name.replace(/ /g,"_"), function (err) {
            //
            // cloudinary.v2.uploader.upload(req.body.fake, {},
            //  function (result, img) {
            
     easyimg.resize({
            src: './public/image/photo_gallery/'+randomNumber + req.files.sampleFiles.name.replace(/ /g,"_"),
            dst: './public/image/photo_gallery/min/'+randomNumber + req.files.sampleFiles.name.replace(/ /g,"_"),
            width: 500,
        }).then(function(file){
  fs.unlink('./public/image/photo_gallery/' + randomNumber + req.files.sampleFiles.name.replace(/ /g,"_"), (err) => {
                if (err) {

                }
        })
        
        
    });
            
            
            
            var t = randomNumber + req.files.sampleFiles.name.replace(/ /g,"_")
            //var a = img.public_id
            var sqla = "INSERT INTO photo_galery (imageuri, deskrip, kategori_poto) VALUES ('" + t + "','" + req.body.text + "','" + req.body.kategoriphoto + "')";
            db.query(sqla, function (err, results) {

               res.redirect('/home/photogalery')



            });
            // });
        });
    }

}


//-----------------------------------------------slide panel page call------------------------------------------------------


exports.slidefrontpanel = function (req, res) {
    var userId = req.session.userId;
    if (userId == null) {
        res.redirect("/login");
        return;
    }


    var sql = "SELECT * FROM slide_front";
    db.query(sql, function (err, results) {
        message = '';

        var totalStudents = results.length,
            pageSize = 6,
            pageCount = Math.round(totalStudents / pageSize),
            currentPage = 1,
            students = [],
            studentsArrays = [],
            studentsList = [];

        for (var i = 0; i < totalStudents; i++) {
            students.push({
                id: results[i].id_slide,
                img: results[i].image_slide,
                title: results[i].title_slide,
                deskrip: results[i].deskrip_slide
            });
        }

        while (students.length > 0) {
            studentsArrays.push(students.splice(0, pageSize));
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

        //   res.render('kategori',{data:results,message: message });
    });
    //console.log(query.sql);
};






//-----------------------------------------------kategori artikel page call------------------------------------------------------


exports.kategoriartikelpanel = function (req, res) {
    var userId = req.session.userId;
    if (userId == null) {
        res.redirect("/login");
        return;
    }


    var sql = "SELECT * FROM kategori_artikel";
    db.query(sql, function (err, results) {
        message = '';

        var totalStudents = results.length,
            pageSize = 6,
            pageCount = Math.round(totalStudents / pageSize),
            currentPage = 1,
            students = [],
            studentsArrays = [],
            studentsList = [];

        for (var i = 0; i < totalStudents; i++) {
            students.push({
                kategori: results[i].kategori_artikel_nama,
                id: results[i].id_artikel
            });
        }

        while (students.length > 0) {
            studentsArrays.push(students.splice(0, pageSize));
        }

        if (typeof req.query.page !== 'undefined') {
            currentPage = +req.query.page;
        }

        studentsList = studentsArrays[+currentPage - 1];
        res.render('./panel/kategoriartikelpanel', {
            data: studentsList,
            pageSize: pageSize,
            totalStudents: totalStudents,
            pageCount: pageCount,
            currentPage: currentPage
        });

        //   res.render('kategori',{data:results,message: message });
    });
    //console.log(query.sql);
};







//-----------------------------------------------kategori delete call------------------------------------------------------

exports.kategoriartikelpanel_delete = function (req, res) {
    var userId = req.session.userId;
    if (userId == null) {
        res.redirect("/login");
        return;
    }
    var ids = req.params.id;
    var sql = "DELETE FROM kategori_artikel  WHERE `id_artikel`='" + ids + "'";
    db.query(sql, function (err, results) {
 
                    res.redirect("/home/kategori-artikel-panel");

    });

    //console.log(query.sql);


};


//-----------------------------------------------new kategori artikel page call------------------------------------------------------


exports.addnewkategoriartikelpanel = function (req, res) {
    var datas = req.params.data;
var t = datas.replace(/-/g," ")

    db.query("INSERT INTO `kategori_artikel` (`kategori_artikel_nama`) VALUES ('" + t + "')", function (err, results) {


        var sqls = "SELECT * FROM kategori_artikel";
        db.query(sqls, function (err, results) {
            message = '';
            var totalStudents = results.length,
                pageSize = 6,
                pageCount = Math.round(totalStudents / pageSize),
                currentPage = 1,
                students = [],
                studentsArrays = [],
                studentsList = [];



            for (var i = 1; i < totalStudents; i++) {
                students.push({
                    kategori: results[i].kategori_artikel_nama,
                    id: results[i].id_artikel
                });
            }

            while (students.length > 0) {
                studentsArrays.push(students.splice(0, pageSize));
            }

            if (typeof req.query.page !== 'undefined') {
                currentPage = +req.query.page;
            }


            studentsList = studentsArrays[+currentPage - 1];

            res.render('./panel/kategoriartikelpanel', {
                data: studentsList,
                pageSize: pageSize,
                totalStudents: totalStudents,
                pageCount: pageCount,
                currentPage: currentPage
            });


        });


    });

};

//-----------------------------------------------edit kategori artikel page call------------------------------------------------------

exports.editartikelpanel = function (req, res) {
    var ids = req.params.kategori;
    var datas = req.params.data;

    db.query('UPDATE `kategori_artikel` SET `kategori_artikel_nama` = ? WHERE `id_artikel` = ?', [mysql_real_escape_string(datas), ids], function (err, results) {

        var sqls = "SELECT * FROM kategori_artikel";
        db.query(sqls, function (err, results) {
            message = '';
            var totalStudents = results.length,
                pageSize = 6,
                pageCount = Math.round(totalStudents / pageSize),
                currentPage = 1,
                students = [],
                studentsArrays = [],
                studentsList = [];



            for (var i = 0; i < totalStudents; i++) {
                students.push({
                    kategori: results[i].kategori_artikel_nama,
                    id: results[i].id_artikel
                });
            }

            while (students.length > 0) {
                studentsArrays.push(students.splice(0, pageSize));
            }

            if (typeof req.query.page !== 'undefined') {
                currentPage = +req.query.page;
            }


            studentsList = studentsArrays[+currentPage - 1];

            res.render('./panel/kategoriartikelpanel', {
                data: studentsList,
                pageSize: pageSize,
                totalStudents: totalStudents,
                pageCount: pageCount,
                currentPage: currentPage
            });


        });


    });

};





//-----------------------------------------------kategori project page call------------------------------------------------------


exports.kategoriprojectpanel = function (req, res) {
    var userId = req.session.userId;
    if (userId == null) {
        res.redirect("/login");
        return;
    }


    var sql = "SELECT * FROM kategori_product";
    db.query(sql, function (err, results) {
        message = '';

        var totalStudents = results.length,
            pageSize = 6,
            pageCount = Math.round(totalStudents / pageSize),
            currentPage = 1,
            students = [],
            studentsArrays = [],
            studentsList = [];

        for (var i = 0; i < totalStudents; i++) {
            students.push({
                kategori: results[i].kategori_name_p,
                id: results[i].id_kategori_p
            });
        }

        while (students.length > 0) {
            studentsArrays.push(students.splice(0, pageSize));
        }

        if (typeof req.query.page !== 'undefined') {
            currentPage = +req.query.page;
        }

        studentsList = studentsArrays[+currentPage - 1];
        res.render('./panel/kategoriprojectpanel', {
            data: studentsList,
            pageSize: pageSize,
            totalStudents: totalStudents,
            pageCount: pageCount,
            currentPage: currentPage
        });

        //   res.render('kategori',{data:results,message: message });
    });
    //console.log(query.sql);
};



//-----------------------------------------------new kategori project page call------------------------------------------------------


exports.addnewkategoriprojectpanel = function (req, res) {
    var datas = req.params.data;


    db.query("INSERT INTO `kategori_product` (`kategori_name_p`) VALUES ('" + datas + "')", function (err, results) {
        var sqls = "SELECT * FROM kategori_product";
        db.query(sqls, function (err, results) {
            message = '';
            var totalStudents = results.length,
                pageSize = 6,
                pageCount = Math.round(totalStudents / pageSize),
                currentPage = 1,
                students = [],
                studentsArrays = [],
                studentsList = [];



            for (var i = 1; i < totalStudents; i++) {
                students.push({
                    kategori: results[i].kategori_name_p,
                    id: results[i].id_kategori_p
                });
            }

            while (students.length > 0) {
                studentsArrays.push(students.splice(0, pageSize));
            }

            if (typeof req.query.page !== 'undefined') {
                currentPage = +req.query.page;
            }


            studentsList = studentsArrays[+currentPage - 1];

            res.render('./panel/kategoriprojectpanel', {
                data: studentsList,
                pageSize: pageSize,
                totalStudents: totalStudents,
                pageCount: pageCount,
                currentPage: currentPage
            });


        });


    });

};


exports.posrepleykontak = function (req, res) {
    var userId = req.session.userId;
    if (userId == null) {
        res.redirect("/login");
        return;
    }


    var sql = "SELECT * FROM kontak_pesan";
    db.query(sql, function (err, results) {
        message = '';

        var totalStudents = results.length,
            pageSize = 6,
            pageCount = Math.round(totalStudents / pageSize),
            currentPage = 1,
            students = [],
            studentsArrays = [],
            studentsList = [];

        for (var i = 0; i < totalStudents; i++) {
            students.push({
                namauser: results[i].nama_pengirim,
                 mail: results[i].email_pengirim,
                 tlp: results[i].no_tlp,
                                id: results[i].id_pesan,

                isi_pesan: results[i].isi_pesan,
                date: results[i].tenggal_kirim 
            });
        }

        while (students.length > 0) {
            studentsArrays.push(students.splice(0, pageSize));
        }

        if (typeof req.query.page !== 'undefined') {
            currentPage = +req.query.page;
        }

        studentsList = studentsArrays[+currentPage - 1];
        res.render('./panel/panellistkontakkomen', {
            data: studentsList,
            pageSize: pageSize,
            totalStudents: totalStudents,
            pageCount: pageCount,
            currentPage: currentPage
        });

        //   res.render('kategori',{data:results,message: message });
    });
    //console.log(query.sql);
};




//-----------------------------------------------mail subcribe page call------------------------------------------------------


exports.mailsubcribe = function (req, res) {
    var userId = req.session.userId;
    if (userId == null) {
        res.redirect("/login");
        return;
    }


    var sql = "SELECT * FROM subscribe_mail";
    db.query(sql, function (err, results) {
        message = '';

        var totalStudents = results.length,
            pageSize = 6,
            pageCount = Math.round(totalStudents / pageSize),
            currentPage = 1,
            students = [],
            studentsArrays = [],
            studentsList = [];

        for (var i = 0; i < totalStudents; i++) {
            students.push({
                namaemail: results[i].mailuri,
                date: results[i].date,
                aktif: results[i].active,
                id: results[i].id_subcribe
            });
        }

        while (students.length > 0) {
            studentsArrays.push(students.splice(0, pageSize));
        }

        if (typeof req.query.page !== 'undefined') {
            currentPage = +req.query.page;
        }

        studentsList = studentsArrays[+currentPage - 1];
        res.render('./panel/panellistsubcribe', {
            data: studentsList,
            pageSize: pageSize,
            totalStudents: totalStudents,
            pageCount: pageCount,
            currentPage: currentPage
        });

        //   res.render('kategori',{data:results,message: message });
    });
    //console.log(query.sql);
};









//-----------------------------------------------kategori delete call------------------------------------------------------

exports.kategoriprojectpanel_delete = function (req, res) {
    var userId = req.session.userId;
    if (userId == null) {
        res.redirect("/login");
        return;
    }
    var ids = req.params.id;
    var sql = "DELETE FROM kategori_product  WHERE `id_kategori_p`='" + ids + "'";
    db.query(sql, function (err, results) {

       /* var sqls = "SELECT * FROM kategori_product";
        db.query(sqls, function (err, results) {
            message = '';
            var totalStudents = results.length,
                pageSize = 6,
                pageCount = Math.round(totalStudents / pageSize),
                currentPage = 1,
                students = [],
                studentsArrays = [],
                studentsList = [];



            for (var i = 0; i < totalStudents; i++) {
                students.push({
                    kategori: results[i].kategori_name_p,
                    id: results[i].id_kategori_p
                });
            }

            while (students.length > 0) {
                studentsArrays.push(students.splice(0, pageSize));
            }

            if (typeof req.query.page !== 'undefined') {
                currentPage = +req.query.page;
            }


            studentsList = studentsArrays[+currentPage - 1];

            res.render('./panel/kategoriprojectpanel', {
                data: studentsList,
                pageSize: pageSize,
                totalStudents: totalStudents,
                pageCount: pageCount,
                currentPage: currentPage
            });


        });*/
                res.redirect("/home/kategori-project-panel");

        

    });

    //console.log(query.sql);


};


//-----------------------------------------------edit kategori artikel page call------------------------------------------------------

exports.editprojectpanel = function (req, res) {
    var ids = req.params.kategori;
    var datas = req.params.data;

    db.query('UPDATE `kategori_product` SET `kategori_name_p` = ? WHERE `id_kategori_p` = ?', [mysql_real_escape_string(datas), ids], function (err, results) {
        var sqls = "SELECT * FROM kategori_product";
        db.query(sqls, function (err, results) {
            message = '';
            var totalStudents = results.length,
                pageSize = 6,
                pageCount = Math.round(totalStudents / pageSize),
                currentPage = 1,
                students = [],
                studentsArrays = [],
                studentsList = [];



            for (var i = 0; i < totalStudents; i++) {
                students.push({
                    kategori: results[i].kategori_name_p,
                    id: results[i].id_kategori_p
                });
            }

            while (students.length > 0) {
                studentsArrays.push(students.splice(0, pageSize));
            }

            if (typeof req.query.page !== 'undefined') {
                currentPage = +req.query.page;
            }


            studentsList = studentsArrays[+currentPage - 1];

            res.render('./panel/kategoriprojectpanel', {
                data: studentsList,
                pageSize: pageSize,
                totalStudents: totalStudents,
                pageCount: pageCount,
                currentPage: currentPage
            });


        });


    });

};





//-----------------------------------------------kategori photo page call------------------------------------------------------


exports.kategoriphotopanel = function (req, res) {
    var userId = req.session.userId;
    if (userId == null) {
        res.redirect("/login");
        return;
    }


    var sql = "SELECT * FROM kategori_poto";
    db.query(sql, function (err, results) {
        message = '';

        var totalStudents = results.length,
            pageSize = 6,
            pageCount = Math.round(totalStudents / pageSize),
            currentPage = 1,
            students = [],
            studentsArrays = [],
            studentsList = [];

        for (var i = 0; i < totalStudents; i++) {
            students.push({
                kategori: results[i].nama_kategori,
                id: results[i].id_kategori_poto
            });
        }

        while (students.length > 0) {
            studentsArrays.push(students.splice(0, pageSize));
        }

        if (typeof req.query.page !== 'undefined') {
            currentPage = +req.query.page;
        }

        studentsList = studentsArrays[+currentPage - 1];
        res.render('./panel/kategoripotopanel', {
            data: studentsList,
            pageSize: pageSize,
            totalStudents: totalStudents,
            pageCount: pageCount,
            currentPage: currentPage
        });

        //   res.render('kategori',{data:results,message: message });
    });
    //console.log(query.sql);
};



//-----------------------------------------------new kategori photo page call------------------------------------------------------


exports.addnewkategoriphotopanel = function (req, res) {
    var datas = req.params.data;


    db.query("INSERT INTO `kategori_poto` (`nama_kategori`) VALUES ('" + datas + "')", function (err, results) {


        var sqls = "SELECT * FROM kategori_poto";
        db.query(sqls, function (err, results) {
            message = '';
            var totalStudents = results.length,
                pageSize = 6,
                pageCount = Math.round(totalStudents / pageSize),
                currentPage = 1,
                students = [],
                studentsArrays = [],
                studentsList = [];



            for (var i = 1; i < totalStudents; i++) {
                students.push({
                    kategori: results[i].nama_kategori,
                    id: results[i].id_kategori_poto
                });
            }

            while (students.length > 0) {
                studentsArrays.push(students.splice(0, pageSize));
            }

            if (typeof req.query.page !== 'undefined') {
                currentPage = +req.query.page;
            }


            studentsList = studentsArrays[+currentPage - 1];

            res.render('./panel/kategoripotopanel', {
                data: studentsList,
                pageSize: pageSize,
                totalStudents: totalStudents,
                pageCount: pageCount,
                currentPage: currentPage
            });


        });


    });

};




//-----------------------------------------------kategori poto delete call------------------------------------------------------

exports.kategoriphotopanel_delete = function (req, res) {
    var userId = req.session.userId;
    if (userId == null) {
        res.redirect("/login");
        return;
    }
    var ids = req.params.id;
    var sql = "DELETE FROM kategori_poto  WHERE `id_kategori_poto`='" + ids + "'";
    db.query(sql, function (err, results) {

        var sqls = "SELECT * FROM kategori_poto";
        db.query(sqls, function (err, results) {
            message = '';
            var totalStudents = results.length,
                pageSize = 6,
                pageCount = Math.round(totalStudents / pageSize),
                currentPage = 1,
                students = [],
                studentsArrays = [],
                studentsList = [];



            for (var i = 0; i < totalStudents; i++) {
                students.push({
                    kategori: results[i].nama_kategori,
                    id: results[i].id_kategori_poto
                });
            }

            while (students.length > 0) {
                studentsArrays.push(students.splice(0, pageSize));
            }

            if (typeof req.query.page !== 'undefined') {
                currentPage = +req.query.page;
            }


            studentsList = studentsArrays[+currentPage - 1];

            res.render('./panel/kategoripotopanel', {
                data: studentsList,
                pageSize: pageSize,
                totalStudents: totalStudents,
                pageCount: pageCount,
                currentPage: currentPage
            });


        });

    });

    //console.log(query.sql);


};




//-----------------------------------------------edit kategori poto page call------------------------------------------------------

exports.editphotopanel = function (req, res) {
    var ids = req.params.kategori;
    var datas = req.params.data;

    db.query('UPDATE `kategori_poto` SET `nama_kategori` = ? WHERE `id_kategori_poto` = ?', [datas, ids], function (err, results) {

        var sqls = "SELECT * FROM kategori_poto";
        db.query(sqls, function (err, results) {
            message = '';
            var totalStudents = results.length,
                pageSize = 6,
                pageCount = Math.round(totalStudents / pageSize),
                currentPage = 1,
                students = [],
                studentsArrays = [],
                studentsList = [];



            for (var i = 0; i < totalStudents; i++) {
                students.push({
                    kategori: results[i].nama_kategori,
                    id: results[i].id_kategori_poto
                });
            }

            while (students.length > 0) {
                studentsArrays.push(students.splice(0, pageSize));
            }

            if (typeof req.query.page !== 'undefined') {
                currentPage = +req.query.page;
            }


            studentsList = studentsArrays[+currentPage - 1];

            res.render('./panel/kategoripotopanel', {
                data: studentsList,
                pageSize: pageSize,
                totalStudents: totalStudents,
                pageCount: pageCount,
                currentPage: currentPage
            });
        });
    });
};


// --- youtube video player ---


exports.youtubevideoplayerpanel = function (req, res) {
    var userId = req.session.userId;
    if (userId == null) {
        res.redirect("/login");
        return;
    }
var u

    var sql = "SELECT * FROM video_galery";
    db.query(sql, function (err, results) {
        message = '';

            var sql = "SELECT * FROM video_kategori";
    db.query(sql, function (err, resultsa) {
        
        if(!resultsa.length){
                   u = ''
                   console.log(u)
                }else{
                    u = resultsa
                }
        
        var totalStudents = results.length,
            pageSize = 6,
            pageCount = Math.round(totalStudents / pageSize),
            currentPage = 1,
            students = [],
            studentsArrays = [],
            studentsList = [];




        for (var i = 0; i < totalStudents; i++) {
            students.push({
                id: results[i].id_video,
                title: results[i].title_video,
                uri: results[i].uri_video
            });
        }

        while (students.length > 0) {
            studentsArrays.push(students.splice(0, pageSize));
        }

        if (typeof req.query.page !== 'undefined') {
            currentPage = +req.query.page;
        }

        studentsList = studentsArrays[+currentPage - 1];
        res.render('./panel/youtubeplayerchanel', {
            data: studentsList,
            pageSize: pageSize,
            totalStudents: totalStudents,
            pageCount: pageCount,
            currentPage: currentPage,
            katv: u
        });
  });
        //   res.render('kategori',{data:results,message: message });
    });
    //console.log(query.sql);
};





//-----------------------------------------------new youtube video page call------------------------------------------------------


exports.addnewyoutubevideoplayerpanel = function (req, res) {
    var datas = req.params.data;
    var nama = req.query.vd;
    var katv = req.query.katv;


    db.query("INSERT INTO `video_galery` (`title_video`, `uri_video`, `kat_id`) VALUES ('" + datas + "','" + nama + "', '"+katv+"')", function (err, results) {
 
        res.redirect("/home/youtubevideoplayer-panel");


    });

};






//-----------------------------------------------youtube player video delete call------------------------------------------------------

exports.youtubevideoplayerpanel_delete = function (req, res) {
    var userId = req.session.userId;
    if (userId == null) {
        res.redirect("/login");
        return;
    }
    var ids = req.params.id;
    var sql = "DELETE FROM video_galery  WHERE `id_video`='" + ids + "'";
    db.query(sql, function (err, results) {
        res.redirect("/home/youtubevideoplayer-panel");

      
    });

    //console.log(query.sql);


};





//-----------------------------------------------slide page call------------------------------------------------------


exports.slide = function (req, res) {
    var userId = req.session.userId;
    if (userId == null) {
        res.redirect("/login");
        return;
    }


    var sql = "SELECT * FROM slide";
    db.query(sql, function (err, resultsa) {
        message = '';

        var totalStudents = resultsa.length,
            pageSize = 6,
            pageCount = Math.round(totalStudents / pageSize),
            currentPage = 1,
            studentsa = [],
            studentsArrays = [],
            studentsList = [];


        for (var i = 1; i < totalStudents; i++) {
            studentsa.push({
                imgurl: resultsa[i].image,
                deskrip: resultsa[i].deskrip,
                id: resultsa[i].id,
                title: resultsa[i].title_slide

            });
        }

        while (studentsa.length > 0) {
            studentsArrays.push(studentsa.splice(0, pageSize));
        }



        if (typeof req.query.page !== 'undefined') {
            currentPage = +req.query.page;
        }
        studentsList = studentsArrays[+currentPage - 1];
        res.render('slide', {
            datas: studentsList,
            pageSize: pageSize,
            totalStudents: totalStudents,
            pageCount: pageCount,
            currentPage: currentPage
        });
        //   res.render('kategori',{data:results,message: message });
    });
    //console.log(query.sql);
};



exports.addimageproject = function (req, res) {
        var ids = req.params.id;
  var x = /^(\+|-)?\d+$/;
    if (x.test(ids)) {
        //integer
        console.log('bener')
    } else {
        //not an integer
        res.redirect("/home/project-page-data");

        return

    }
      res.render('./panel/addimageproject', {
           
            idproject: ids,
         });
}



//--- delete project 





exports.deletepic = function (req, res) {
    var ids = req.params.id;
    var userId = req.session.userId;
    if (userId == null) {
        res.redirect("/login");
        return;
    }
    var sqld = "SELECT * FROM gambar_produk WHERE `id_gambar`='" + ids + "'";
    db.query(sqld, function (err, resultsi) {
       if (fs.existsSync('./public/image/project_image/min/' + resultsi[0].uri_gambar)) {
            fs.unlink('./public/image/project_image/min/' + resultsi[0].uri_gambar, (err) => {
                if (err) {

                } else {
        var sql = "DELETE FROM gambar_produk  WHERE `id_gambar`='" + ids + "'";
        db.query(sql, function (err, results) {
            message = '';
           
                res.setHeader('Content-Type', 'text/plain');
                res.sendStatus(200);
            


        });
                }
            })
       }

    });

 

};






// -- video page
exports.videopage = function (req, res) {
    var name = req.params.name;


    var sqldas = "SELECT  * FROM video_galery LIMIT 6";
    db.query(sqldas, function (err, video) {
         var sqldasa = "SELECT  * FROM  video_kategori";
    db.query(sqldasa, function (err, llsss) {
        if (!video.length) {

             
            
            
            
            
            lo = 'Error'

            res.render('videopage', {
                datas: null,
                pageSize: null,
                totalStudents: null,
                pageCount: null,
                currentPage: null,
                uri: req,
                title: lo,
                pagename: 'video',
                num: name,
                                kategorv: '',
   galv: '',
 galkv:''
            });


        } else {
   

            var totalStudents = video.length,
                pageSize = 6,
                pageCount = Math.round(totalStudents / pageSize),
                currentPage = 1,
                studentsa = [],
                studentsArrays = [],
                studentsList = [];


            for (var i = 0; i < totalStudents; i++) {
                studentsa.push({
                    uri: video[i].uri_video,
                    title: video[i].title_video,
                    id: video[i].id_video


                });
            }

            while (studentsa.length > 0) {
                studentsArrays.push(studentsa.splice(0, pageSize));
            }



            if (typeof req.query.page !== 'undefined') {
                currentPage = +req.query.page;
            }


            studentsList = studentsArrays[+currentPage - 1];

            res.render('videopage', {
                datas: studentsList,
                pageSize: pageSize,
                totalStudents: totalStudents,
                pageCount: pageCount,
                currentPage: currentPage,
                uri: req,
                title: 'video',
                pagename: 'video',
                num: name,
                kategorv: llsss,   galv: 'yes',
 galkv:''
            });
 
        }
    })
    })
}


//-- komen 


exports.halamankirimkomen = function (req, res) {
    var name = req.params.id;
    var k
    var x = /^(\+|-)?\d+$/;
    if (x.test(name)) {
        //integer
        console.log('bener')
    } else {
        //not an integer
        res.redirect("/home/kontak-komen-panel");

        return

    }
    var sqldasa = "SELECT  * FROM  kontak_pesan  WHERE id_pesan=" + name;
    db.query(sqldasa, function (err, llss) {
        if (!llss.length) {
            res.redirect("/home/kontak-komen-panel");


        } else {
            res.render('./panel/halamanbalaskomen', {
                datas: llss
            });
        }
    });
}



//-- pesan email

exports.halamanbalas = function (req, res) {
    var name = req.params.id;
    var k
    var x = /^(\+|-)?\d+$/;
    if (x.test(name)) {
        //integer
        console.log('bener')
    } else {
        //not an integer
        res.redirect("/home/email-subcribe-panel");

        return

    }
    var sqldasa = "SELECT  * FROM  subscribe_mail  WHERE id_subcribe=" + name;
    db.query(sqldasa, function (err, llss) {
        if (!llss.length) {
            res.redirect("/home/email-subcribe-panel");


        } else {
            res.render('./panel/halamanbalas', {
                datas: llss
            });
        }
    });
}






//--profile page

exports.profilepagepanel = function (req, res) {
    var name = req.params.name;
    var k
    var sqldasa = "SELECT  * FROM  company_pro";
    db.query(sqldasa, function (err, llss) {
        if (!llss.length) {
            var o = 'no'
            res.render('./panel/profilepagepanel', {
                datas: llss,
                len: 'no'
            });
        } else {
            res.render('./panel/profilepagepanel', {
                datas: llss,
                len: 'yes'
            });

        }


    })


}

//--history page


exports.historypagepanel = function (req, res) {
    var name = req.params.name;
    var k
    var sqldasa = "SELECT  * FROM  history_co";
    db.query(sqldasa, function (err, llss) {
        if (!llss.length) {
            var o = 'no'
            res.render('./panel/historycompany', {
                datas: llss,
                len: 'no'
            });
        } else {
            res.render('./panel/historycompany', {
                datas: llss,
                len: 'yes'
            });

        }


    })


}




exports.deletephotogallery = function (req, res) {
    var ids = req.params.id;

    var userId = req.session.userId;
    if (userId == null) {
        res.redirect("/login");
        return;
    }
    var sqld = "SELECT * FROM photo_galery WHERE `id_photo_galery`='" + ids + "'";
    db.query(sqld, function (err, resultsi) {

        // cloudinary.v2.uploader.destroy(resultsi[0].public_id, function (error, result) {
        if (fs.existsSync('./public/image/photo_gallery/min/' + resultsi[0].imageuri)) {
            fs.unlink('./public/image/photo_gallery/min/' + resultsi[0].imageuri, (err) => {
                if (err) {

                } else {

                    var sql = "DELETE FROM photo_galery  WHERE `id_photo_galery`='" + ids + "'";
                    db.query(sql, function (err, results) {
                        message = '';
                        res.send('delete')

                        /* var sqla = "SELECT * FROM slide_front";
                         db.query(sqla, function (err, resultsa) {
                             var totalStudents = resultsa.length,
                                 pageSize = 3,
                                 pageCount = Math.round(totalStudents / pageSize),
                                 currentPage = 1,
                                 studentsa = [],
                                 studentsArrays = [],
                                 studentsList = [];
                             for (var i = 1; i < totalStudents; i++) {
                                 studentsa.push({
                                     id: results[i].id_slide,
                                     img: results[i].image_slide,
                                     title: results[i].title_slide,
                                     deskrip: results[i].deskrip_slide
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
                        //   res.render('kategori',{data:results,message: message });
                    });

                }
            });
        }

    });


    //console.log(query.sql);
};





//-----------------------------------------------slide delete page call------------------------------------------------------


exports.slide_delete = function (req, res) {
    var ids = req.params.id;

    var userId = req.session.userId;
    if (userId == null) {
        res.redirect("/login");
        return;
    }
    var sqld = "SELECT * FROM slide_front WHERE `id_slide`='" + ids + "'";
    db.query(sqld, function (err, resultsi) {
                  if(!resultsi.length){
                      
                  }else{
                      
                      
                      
                      
        // cloudinary.v2.uploader.destroy(resultsi[0].public_id, function (error, result) {
        if (fs.existsSync('./public/image/slide_image/min/' + resultsi[0].image_slide)) {
            fs.unlink('./public/image/slide_image/min/' + resultsi[0].image_slide, (err) => {
                if (err) {

                } else {

                    var sql = "DELETE FROM slide_front  WHERE `id_slide`='" + ids + "'";
                    db.query(sql, function (err, results) {
                        message = '';
                        res.send('delete')

                       
                    });

                }
            });
        }
        
        
        
        /* if (fs.existsSync('./public/image/slide_image/' + resultsi[0].image_slide)) {
            fs.unlink('./public/image/slide_image/' + resultsi[0].image_slide, (err) => {
                if (err) {

                } else {

                    var sql = "DELETE FROM slide_front  WHERE `id_slide`='" + ids + "'";
                    db.query(sql, function (err, results) {
                        message = '';
                        res.send('delete')

                       
                    });

                }
            });
        }
        */
        
        
        
        
        
                  }
    });


    //console.log(query.sql);
};









//-----------------------------------------------product page call------------------------------------------------------


exports.product = function (req, res) {
    var userId = req.session.userId;
    if (userId == null) {
        res.redirect("/login");
        return;
    }


    db.query('SELECT * , (SELECT imageuri FROM gambar WHERE product.produk_id=gambar.produk_id LIMIT 1) AS gambars FROM product ', function (err, resultsa) {

        message = '';





        /* ala.promise('SELECT * FROM ?', [resultsa[0]]).then(function(resad){
                 
                return   ala.promise('SELECT * FROM ?  ', [resultsa[1]])
               
        }).then(function(resa){
                console.log('You got: ', resa);
       
            
            })
      
          */

        /*   var st = ala.compile('SELECT * \
                      ARRAY(_) AS imageuri FROM ?  GROUP BY imageuri');
    st.promise([resultsa[0], resultsa[1]]).then(function(resa){
    // Process data
        
        console.log(resa[0].imageuri)
}).catch(function(err){
    // Process errors
});
    
  */



        /*
                                           var myArray = []
                                            myArray.push({
                                                product: resultsa[0],
                                                gambar: resultsa[1]
                                            })
                                      var resa = ala("SELECT * FROM ? ", [myArray[0].product ]);

                 
                                      var resaa = ala("SELECT * FROM ? ", [myArray[1].gam ]);

                               
              */




        res.render('product', {
            datas: resultsa,

        });



        //   res.render('kategori',{data:results,message: message });

    });

    //console.log(query.sql);



};







//-----------------------------------------------edit product page call------------------------------------------------------


exports.editproduct = function (req, res) {
    var userId = req.session.userId;
    var ids = req.params.id;

    if (userId == null) {
        res.redirect("/login");
        return;
    }


    db.query('SELECT *  FROM product WHERE produk_id=?', [ids], function (err, resultsa) {
        if (err) throw err;


        db.query('SELECT *  FROM kategori WHERE id=?', [resultsa[0].id_kategori], function (err, resultsaka) {

            db.query('SELECT *  FROM gambar WHERE produk_id=?', [ids], function (err, resultsas) {

                db.query('SELECT *  FROM kategori', function (err, resultsakas) {

                    res.render('editproduk', {
                        dataproduk: resultsa,
                        datagambar: resultsas,
                        datakategori: resultsakas,
                        datakatpro: resultsaka

                    });

                })
            })

        })

        //   res.render('kategori',{data:results,message: message });

    });

    //console.log(query.sql);



};



exports.newproduct = function (req, res) {
    var sqld = "SELECT * FROM kategori";
    db.query(sqld, function (err, resultsi) {
        console.log(resultsi)
        res.render('newproduct', {
            data: resultsi,
        });


    })

}


exports.abouts = function (req, res) {
    var sqlda = "SELECT * FROM company_pro";
    db.query(sqlda, function (err, sld) {
        var sqldas = "SELECT * FROM history_co";
        db.query(sqldas, function (err, lls) {
            res.render('about', {
                histori: lls,
                profile: sld,
                uri: req,
                pagename: 'about'
            });

        })
    })
}


exports.kontak = function (req, res) {
    var sqlda = "SELECT * FROM company_pro";
    db.query(sqlda, function (err, sld) {
        var sqldas = "SELECT * FROM history_co";
        db.query(sqldas, function (err, lls) {
            res.render('contact', {
                histori: lls,
                profile: sld,
                uri: req,
                pagename: 'kontak'
            });

        })
    })
}



exports.gallerypoto = function (req, res) {



    var sqldasa = "SELECT  * FROM kategori_poto";
    db.query(sqldasa, function (err, llss) {
        var sqldasd = "SELECT imageuri FROM photo_galery ORDER BY RAND() LIMIT 1";
        db.query(sqldasd, function (err, llssa) {


            var sqldas = "SELECT * FROM photo_galery LIMIT 4";
            db.query(sqldas, function (err, lls) {


                res.render('galleryp', {
                    datas: lls,
                    image: llssa,
                    uri: req,
                    kategoripoto: llss,
                    pagename: 'galery',
                      gal: ''
                   ,galk: ''
                });


            })

        })

    })
}


//uploadedit project data




//-- project edit page 


exports.editedprojectdatapost = function (req, res) {
   if (req.method == "POST") {
     var sqla = "UPDATE `produk_data` SET `title_produk` = ?, `id_kategori_p` =?  WHERE `produk_id`=?";
        db.query(sqla, [req.body.namaproduk, req.body.kategoriproduk, req.body.idnumproduk], function (err, results) {
            
             res.setHeader('Content-Type', 'text/plain');
                res.sendStatus(200);
            
        })
       
   }
}

//-----------------------------------------------edit product page call------------------------------------------------------


exports.editprojectdata = function (req, res) {
    var userId = req.session.userId;
    var ids = req.params.id;
var u
    if (userId == null) {
        res.redirect("/login");
        return;
    }

var x = /^(\+|-)?\d+$/;
        if (x.test(ids)) {
            //integer
            console.log('bener')


        } else {
            //not an integer
            res.redirect('/home/project-page-data')

            return

        }
    db.query('SELECT *  FROM  produk_data WHERE produk_id=?', [ids], function (err, resultsa) {
        if (err) throw err;
  if (!resultsa.length) {
         
            res.redirect('/home/project-page-data')

            return

        }
        db.query('SELECT *  FROM kategori_product WHERE id_kategori_p=?', [resultsa[0].id_kategori_p], function (err, resultsaka) {

            db.query('SELECT *  FROM gambar_produk WHERE produk_id_gambar=?', [ids], function (err, resultsas) {

                db.query('SELECT *  FROM kategori_product', function (err, resultsakas) {

                   if(!resultsaka.length){
                   u = ''
                   console.log(u)
                }else{
                    u = resultsaka
                }
                    res.render('./panel/panelprojectedit', {
                        dataproduk: resultsa,
                        datagambar: resultsas,
                        datakategori: resultsakas,
                        datakatpro: u

                    });

                })
            })


        })


        //   res.render('kategori',{data:results,message: message });

    });

    //console.log(query.sql);



};









//--- project data page 
exports.projectpagepanel = function (req, res) {

    db.query('SELECT * , (SELECT uri_gambar FROM gambar_produk WHERE produk_data.produk_id=gambar_produk.produk_id_gambar LIMIT 1) AS gambars FROM produk_data', function (err, resultsa) {




        if (!resultsa.length) {

            res.render('./panel/projectpanel', {
                datas: null,
                pageSize: null,
                totalStudents: null,
                pageCount: null,
                currentPage: null,
                 pagename: 'Project',
            });

            return
        } else {
            var totalStudents = resultsa.length,
                pageSize = 4,
                pageCount = Math.round(totalStudents / pageSize),
                currentPage = 1,
                studentsa = [],
                studentsArrays = [],
                studentsList = [];


            for (var i = 0; i < totalStudents; i++) {
                studentsa.push({
                    imgurl: resultsa[i].gambars,
                    titpro: resultsa[i].title_produk,

                    id: resultsa[i].produk_id

                });
            }

            while (studentsa.length > 0) {
                studentsArrays.push(studentsa.splice(0, pageSize));
            }



            if (typeof req.query.page !== 'undefined') {
                currentPage = +req.query.page;
            }


            studentsList = studentsArrays[+currentPage - 1];

            res.render('./panel/projectpanel', {
                datas: studentsList,
                pageSize: pageSize,
                totalStudents: totalStudents,
                pageCount: pageCount,
                currentPage: currentPage,
                uri: req,
                pagename: 'Project',
            });


        }

    })


}

exports.produkproject = function (req, res) {


var nbg
    var sqldasa = "SELECT * FROM kategori_product";
    db.query(sqldasa, function (err, llss) {

        var sqldasdx = "SELECT uri_gambar FROM gambar_produk ORDER BY RAND() LIMIT 1";
        db.query(sqldasdx, function (err, llssax) {
        
            db.query('SELECT * , (SELECT uri_gambar FROM gambar_produk WHERE produk_data.produk_id=gambar_produk.produk_id_gambar LIMIT 1) AS gambars FROM produk_data ORDER BY RAND() LIMIT 4', function (err, resultsa) {
                  if(!llssax.length){
                      
                      nbg = ''
                  }else{
                       nbg = llssax[0].uri_gambar
                  }

                res.render('project', {
                    datas: resultsa,
                    uri: req,
                    image: nbg,
                    kategoriproject: llss,
                    pagename: 'Project',  num:'',
                    prok: '',
                    pro: ''
                });


            })

        })

    })
}

exports.savenewproject= function (req, res) {
        if (req.method == "POST") {
 var months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
    var myDays = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jum&#39;at', 'Sabtu'];
    var date = new Date();
    var day = date.getDate();
    var month = date.getMonth();
    var thisDay = date.getDay(),
        thisDay = myDays[thisDay];
    var yy = date.getYear();
    var year = (yy < 1000) ? yy + 1900 : yy;
    var tanggal = thisDay + ', ' + day + ' ' + months[month] + ' ' + year;
    
      var sqla = "INSERT INTO produk_data (title_produk, publikasi_produk, id_kategori_p) VALUES ('" + req.body.namaproduk + "','" + tanggal + "','" + req.body.kategoriproduk + "')";
        db.query(sqla, function (err, results) {
            if (err) throw err;
 res.setHeader('Content-Type', 'text/plain');
                res.sendStatus(200);

        })
    
    
        }
    
    
}
exports.newprojectstuff = function (req, res) {
        var sqldasa = "SELECT * FROM kategori_product";
    db.query(sqldasa, function (err, llss) {
     res.render('./panel/newprojectstuff',{
     datakategori: llss
     });

    })
    
    
}

exports.projectpage = function (req, res) {
    var name = req.params.name;
    var sqldasa = "SELECT * FROM kategori_product";
    db.query(sqldasa, function (err, llss) {
        var x = /^(\+|-)?\d+$/;
        if (x.test(name)) {
            //integer
            console.log('bener')


        } else {
            //not an integer
            res.render('projectpage', {
                datas: null,
                uri: req,
                title: 'Error',
                image: null,
                kategoriproject: llss,
                pagename: 'Project',
                num: '',
  prok: '',
                    pro: ''

            });

            return

        }
        var sqldasdx = "SELECT * FROM gambar_produk WHERE produk_id_gambar=" + name;
        db.query(sqldasdx, function (err, llssax) {
            db.query('SELECT *  FROM produk_data WHERE produk_id= ?', [name], function (err, resultsa) {
var ngb
                if (!resultsa.length) {

                    res.render('projectpage', {
                        datas: null,
                        uri: req,
                        title: 'Error',
                        image: null,
                        kategoriproject: llss,
                        pagename: 'Project',
                num: '',
  prok: '',
                    pro: ''

                    });
                    return
                } else {
                    
                    
                       if(!llssax.length){
                           
                           ngb =''
                       }else{
                           ngb = llssax
                       }
                    
                    res.render('projectpage', {
                        datas: resultsa,
                        uri: req,
                        image: ngb,
                        title: resultsa[0].title_produk,
                        kategoriproject: llss,
                        pagename: 'Project',
                  num: name,
                          prok: 'yes',
                    pro: ''
                    });

                }

            })

        })

    })
}

exports.projectkategori = function (req, res) {

    var name = req.params.name.replace(/\.[^/.]+$/, "");
    var up;
    var sqldasa = "SELECT * FROM kategori_product";
    db.query(sqldasa, function (err, llss) {
        var x = /^(\+|-)?\d+$/;
        if (x.test(name)) {
            //integer
            console.log('bener')


        } else {
            //not an integer
            lo = 'Error'

            res.render('projectkat', {
                datas: null,
                pageSize: null,
                totalStudents: null,
                pageCount: null,
                currentPage: null,
                uri: req,
                kategoriproject: llss,
                image: null,
                uri: req,
                title: lo,
                pagename: 'Project',
                num: null,
                
                              prok: '',
                    pro: ''
            });

            return

        }
    
            
            db.query('SELECT * , (SELECT uri_gambar FROM gambar_produk WHERE produk_data.produk_id=gambar_produk.produk_id_gambar LIMIT 1) AS gambars FROM produk_data WHERE id_kategori_p = ?', [name], function (err, resultsa) {
                if (!resultsa.length) {
                    lo = 'Error'

                    res.render('projectkat', {
                        datas: null,
                        pageSize: null,
                        totalStudents: null,
                        pageCount: null,
                        currentPage: null,
                        uri: req,
                        kategoriproject: llss,
                        image: null,
                        title: lo,
                        pagename: 'Project',
                        num: null,
                        
                              prok: '',
                    pro: ''
                    });
                   return
                }
    var sqldasdx = "SELECT uri_gambar FROM gambar_produk WHERE produk_id_gambar=? LIMIT 1";
        db.query(sqldasdx, [resultsa[0].produk_id], function (err, llssax) {
                var sqldasdxa = "SELECT * FROM kategori_product WHERE id_kategori_p=?";
        db.query(sqldasdxa, [name], function (err, llssaxa) {
                if (!llssax.length) {
                    lo = 'Error'

                    res.render('projectkat', {
                        datas: null,
                        pageSize: null,
                        totalStudents: null,
                        pageCount: null,
                        currentPage: null,
                        uri: req,
                        kategoriproject: llss,
                        image: null,
                        title: lo,
                        pagename: 'Project',
                        num: null,
                        
                              prok: '',
                    pro: ''
                    });
                   return
                } else {
                    var totalStudents = resultsa.length,
                        pageSize = 4,
                        pageCount = Math.round(totalStudents / pageSize),
                        currentPage = 1,
                        studentsa = [],
                        studentsArrays = [],
                        studentsList = [];


                    for (var i = 0; i < totalStudents; i++) {
                        studentsa.push({
                            imgurl: resultsa[i].gambars,
                            titpro: resultsa[i].title_produk,

                            id: resultsa[i].produk_id

                        });
                    }

                    while (studentsa.length > 0) {
                        studentsArrays.push(studentsa.splice(0, pageSize));
                    }



                    if (typeof req.query.page !== 'undefined') {
                        currentPage = +req.query.page;
                    }


                    studentsList = studentsArrays[+currentPage - 1];
                    if (llss[0].id_kategori_p == name) {
                    }
                                            up = llssaxa[0].kategori_name_p

                    res.render('projectkat', {
                        datas: studentsList,
                        pageSize: pageSize,
                        totalStudents: totalStudents,
                        pageCount: pageCount,
                        currentPage: currentPage,
                        uri: req,
                        kategoriproject: llss,
                        image: llssax,
                        uri: req,
                        title: up,
                        pagename: 'Project',
                        num: name,
                        
                              prok: 'yes',
                    pro: ''
                    });


                    console.log(up)
                }
            })
              })
        })
    })
}







exports.artikelkategori = function (req, res) {

    var sqldasa = "SELECT  * FROM  kategori_artikel";
    db.query(sqldasa, function (err, llss) {
        var sqldas = "SELECT * FROM artikel_data LIMIT 8";
        db.query(sqldas, function (err, artikel) {
            res.render('artikel', {
                kategoriartikel: llss,
                news: artikel,
                uri: req,
                art: '',
                artk:'',
                pagename: 'artikel'
            });


        })

        console.log(llss)
    })

}


exports.deletekomenmail = function (req, res) {
    var name = req.params.id;
     var x = /^(\+|-)?\d+$/;
        if (x.test(name)) {
            //integer
            console.log('bener')


        } else {
            //not an integer
            res.redirect('/home/kontak-komen-panel');

            return

        }
      var sql = "DELETE FROM kontak_pesan  WHERE `id_pesan`=" + name;
        db.query(sql, function (err, results) {


            res.redirect('/home/kontak-komen-panel')
        })
}


exports.deletesubcribe = function (req, res) {
    var name = req.params.id;
     var x = /^(\+|-)?\d+$/;
        if (x.test(name)) {
            //integer
            console.log('bener')


        } else {
            //not an integer
            res.redirect('/home/email-subcribe-panel');

            return

        }
      var sql = "DELETE FROM subscribe_mail  WHERE `id_subcribe`=" + name;
        db.query(sql, function (err, results) {


            res.redirect('/home/email-subcribe-panel')
        })
}
//--- artikel posting delete
exports.deleteartikelposting = function (req, res) {
    var name = req.params.id;

    var userId = req.session.userId;
    if (userId == null) {
        res.redirect("/login");
        return;
    }
    var sqla = "SELECT * FROM artikel_data WHERE id_artikel=" + name;
    db.query(sqla, function (err, resultsa) {

        if (fs.existsSync('./public/image/artikel_image/' + resultsa[0].gambar_artikel)) {
            fs.unlink('./public/image/artikel_image/' + resultsa[0].gambar_artikel, (err) => {
                if (err) {

                } else {

                }
            })
        }




        var sql = "DELETE FROM artikel_data  WHERE `id_artikel`=" + name;
        db.query(sql, function (err, results) {


            res.redirect('/home/artikel-page-panel')
        })

    })


};


//--- edit artikel 
exports.editartikelposting = function (req, res) {
    var name = req.params.id;
    var k
    var sqldassa = "SELECT  * FROM  kategori_artikel";
    db.query(sqldassa, function (err, llssa) {
        var x = /^(\+|-)?\d+$/;
        if (x.test(name)) {
            //integer
            console.log('bener')


        } else {
            //not an integer
            res.redirect('/home/artikel-page-panel');

            return

        }
        var sqldasa = "SELECT  * FROM  artikel_data  WHERE id_artikel=" + name;
        db.query(sqldasa, function (err, llss) {
            if (!llss.length) {
                res.redirect('/home/artikel-page-panel');

                return

            } else {
                var sqldasas = "SELECT  * FROM  kategori_artikel WHERE id_artikel=" + llss[0].id_katego_artikel;
                db.query(sqldasas, function (err, llssx) {
                    message = ''
                    res.render('./panel/halamaneditartikel', {
                        datas: llss,
                        kategoriartikel: llssa,
                        namakategori: llssx

                    });

                });
            }
        });
    });
}


//-- edit post artikel setup

//-- edit post artikel setup
exports.artikelpostingeditpost = function (req, res) {
    const randomNumber = new Date().getTime() + Math.floor(Math.random() * 1000)
    var months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
    var myDays = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jum&#39;at', 'Sabtu'];
    var date = new Date();
    var day = date.getDate();
    var month = date.getMonth();
    var thisDay = date.getDay(),
        thisDay = myDays[thisDay];
    var yy = date.getYear();
    var year = (yy < 1000) ? yy + 1900 : yy;
    var tanggal = thisDay + ', ' + day + ' ' + months[month] + ' ' + year
  
    if (!req.files.sampleFiles) {
        
        
        
        
        
        
        
        
        var sqla = "UPDATE `artikel_data` SET `judul_atikel` = ?, `isi_artikel` =?, `penulis_artikel`=?, `id_katego_artikel`=?, `size`=? WHERE `id_artikel`=?";
        db.query(sqla, [req.body.title, req.body.textedit, req.body.penulis, req.body.konum, req.body.image, req.body.idedit], function (err, results) {
            if (err) throw err;
            var sqla = "SELECT * FROM artikel_data WHERE id_artikel=" + mysql_real_escape_string(req.body.idedit);
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
                        id: resultsa[i].id_artikel,
                        titpro: resultsa[i].judul_atikel,
                        isi: resultsa[i].isi_artikel,
                        img: resultsa[i].gambar_artikel,
                        publis: resultsa[i].data_publis,
                        penulis: resultsa[i].penulis_artikel,
                        idkat: resultsa[i].id_katego_artikel
                    });
                }

                while (studentsa.length > 0) {
                    studentsArrays.push(studentsa.splice(0, pageSize));
                }



                if (typeof req.query.page !== 'undefined') {
                    currentPage = +req.query.page;
                }


                studentsList = studentsArrays[+currentPage - 1];
                res.render('./panel/artartikelpagepanel', {
                    datas: studentsList,
                    pageSize: pageSize,
                    totalStudents: totalStudents,
                    pageCount: pageCount,
                    currentPage: currentPage,
                     kategoriartikel: resultsa
                });


            });

        })
      
    } else {
        
 
         let sampleFile = req.files.sampleFiles;
        
        sampleFile.mv('./public/image/artikel_image/' + randomNumber + req.files.sampleFiles.name.replace(/ /g,"_"), function (err) {
          
            var t = randomNumber + req.files.sampleFiles.name.replace(/ /g,"_")
            var sqld = "SELECT * FROM artikel_data WHERE id_artikel="+mysql_real_escape_string(req.body.idedit);
            db.query(sqld, function (err, resultsi) {

                console.log(resultsi)
 
                // cloudinary.v2.uploader.destroy(resultsi[0].public_id, function (error, result) {
                if (fs.existsSync('./public/image/artikel_image/min/' + resultsi[0].gambar_artikel)) {
                    fs.unlink('./public/image/artikel_image/min/' + resultsi[0].gambar_artikel, (err) => {
                        if (err) {                                                                                                                 

                        } else {

                        }
                    })
                }







 easyimg.resize(
        {
            src: './public/image/artikel_image/'+randomNumber + req.files.sampleFiles.name.replace(/ /g,"_"),
            dst: './public/image/artikel_image/min/' + randomNumber + req.files.sampleFiles.name.replace(/ /g,"_"),
            width: 500,
        }).then(function(file){
        console.log('success');
        
      
    });









                var sqlas = "UPDATE artikel_data SET gambar_artikel=?, judul_atikel = ?, isi_artikel=?, penulis_artikel=?, id_katego_artikel=?, size=? WHERE id_artikel=?";
                db.query(sqlas, [t, mysql_real_escape_string(req.body.title), req.body.textedit, mysql_real_escape_string(req.body.penulis), req.body.konum, mysql_real_escape_string(req.body.image), mysql_real_escape_string(req.body.idedit)], function (err, results) {
                    if (err) throw err;

                    var sqla = "SELECT * FROM artikel_data";
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
                                id: resultsa[i].id_artikel,
                                titpro: resultsa[i].judul_atikel,
                                isi: resultsa[i].isi_artikel,
                                img: resultsa[i].gambar_artikel,
                                publis: resultsa[i].data_publis,
                                penulis: resultsa[i].penulis_artikel,
                                idkat: resultsa[i].id_katego_artikel
                            });
                        }

                        while (studentsa.length > 0) {
                            studentsArrays.push(studentsa.splice(0, pageSize));
                        }



                        if (typeof req.query.page !== 'undefined') {
                            currentPage = +req.query.page;
                        }


                        studentsList = studentsArrays[+currentPage - 1];
                        res.render('./panel/artartikelpagepanel', {
                            datas: studentsList,
                            pageSize: pageSize,
                            totalStudents: totalStudents,
                            pageCount: pageCount,
                            currentPage: currentPage,
                            kategoriartikel: resultsi
                        });


                    });
                });

                // });
            });
        })
    }


}


//-- new artikel setup
exports.artikelnewsetup = function (req, res) {
    const randomNumber = new Date().getTime() + Math.floor(Math.random() * 1000)
    var months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
    var myDays = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jum&#39;at', 'Sabtu'];
    var date = new Date();
    var day = date.getDate();
    var month = date.getMonth();
    var thisDay = date.getDay(),
        thisDay = myDays[thisDay];
    var yy = date.getYear();
    var year = (yy < 1000) ? yy + 1900 : yy;
    var tanggal = thisDay + ', ' + day + ' ' + months[month] + ' ' + year
     var titl = req.body.title.replace(/\-/g, " ")

    if (!req.files.sampleFiles) {
   

   var sqla = "INSERT INTO artikel_data (judul_atikel, isi_artikel, data_publis, penulis_artikel, id_katego_artikel, size) VALUES ('" + titl + "','" + req.body.texteditor + "','" + tanggal + "','" + mysql_real_escape_string(req.body.penulis) + "','" + mysql_real_escape_string(req.body.kategoriartikel) + "','" + mysql_real_escape_string(req.body.selimage) + "')";


        db.query(sqla, function (err, results) {
            if (err) throw err;


        })
    } else {
        // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
        let sampleFile = req.files.sampleFiles;
        sampleFile.mv('./public/image/artikel_image/' + randomNumber + req.files.sampleFiles.name.replace(/ /g,"_"), function (err) {
            //
            // cloudinary.v2.uploader.upload(req.body.fake, {},
            //  function (result, img) {
            
            
              /*sharp('./public/image/artikel_image/'+randomNumber + req.files.sampleFiles.name.replace(/ /g,"_")).toBuffer().then(
        (data) => {
            sharp(data).resize(800).toFile('./public/image/artikel_image/min/', (err,info) => {
                console.log('oke');
            });
        }
    ).catch(
        (err) => {
            console.log(err);
        }
    )
    
    /*
      sharp(inputBuffer)
  .resize(320, 240)
  .toFile('output.webp', (err, info) => ... );
     */
var t = randomNumber + req.files.sampleFiles.name.replace(/ /g,"_")
  /*
          imagemin(['./public/image/artikel_image/*.{jpg,png}'], './public/image/artikel_image/min/', {
	plugins: [
		imageminMozjpeg({quality: '20'})
	]
}).then(files => {
	console.log(files);
	//=> [{data: <Buffer 89 50 4e …>, path: 'build/images/foo.jpg'}, …]
});
*/
/*
  imagemin(['./public/image/artikel_image/*.{jpg,png}'], './public/image/artikel_image/min/', {
	plugins: [
	    	imageminMozjpeg()
	]
	});

 
/*

gm(['./public/image/artikel_image/*.{jpg,png}'])
.flip()
.magnify()
.rotate('green', 45)
.blur(7, 3)
.crop(300, 300, 150, 130)
.edge(3)
.write('./public/image/artikel_image/min/'+t, function (err) {
  if (!err) console.log('crazytown has arrived');
})*/

/*
sharp('./public/image/artikel_image/'+t)
  .resize(200)
  .toFile('./public/image/artikel_image/min/output.webp', (err, info) => ... );

*/
  easyimg.resize(
        {
            src: './public/image/artikel_image/'+randomNumber + req.files.sampleFiles.name.replace(/ /g,"_"),
            dst: './public/image/artikel_image/min/' + randomNumber + req.files.sampleFiles.name.replace(/ /g,"_"),
            width: 500,
        }).then(function(file){
        console.log('success');
        
        fs.unlink('./public/image/artikel_image/'+randomNumber + req.files.sampleFiles.name.replace(/ /g,"_"), (err) => {
                if (err) {

                }
        })
        
    });
            //var a = img.public_id

 var sqlas = "INSERT INTO artikel_data (gambar_artikel, judul_atikel, isi_artikel, data_publis, penulis_artikel, id_katego_artikel) VALUES ('" + t + "','" + titl + "','" + mysql_real_escape_string(req.body.texteditor) + "','" + tanggal + "','" + mysql_real_escape_string(req.body.penulis) + "','" + req.body.kategoriartikel + "')";

            db.query(sqlas, function (err, results) {
                if (err) throw err;




                var sqla = "SELECT * FROM artikel_data";
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
                            id: resultsa[i].id_artikel,
                            titpro: resultsa[i].judul_atikel,
                            isi: resultsa[i].isi_artikel,
                            img: resultsa[i].gambar_artikel,
                            publis: resultsa[i].data_publis,
                            penulis: resultsa[i].penulis_artikel,
                            idkat: resultsa[i].id_katego_artikel
                        });
                    }

                    while (studentsa.length > 0) {
                        studentsArrays.push(studentsa.splice(0, pageSize));
                    }



                    if (typeof req.query.page !== 'undefined') {
                        currentPage = +req.query.page;
                    }


                    studentsList = studentsArrays[+currentPage - 1];
                    res.render('./panel/artartikelpagepanel', {
                        datas: studentsList,
                        pageSize: pageSize,
                        totalStudents: totalStudents,
                        pageCount: pageCount,
                        currentPage: currentPage
                    });


                });
            });
            // });
        });
    }

}

//-- artikel setup panel 

exports.artikelpanelsetup = function (req, res) {
    var name = req.params.name;
    var k
    var u
    var sqldasa = "SELECT  * FROM  kategori_artikel";
    db.query(sqldasa, function (err, llss) {
        var sqldas = "SELECT  * FROM artikel_data";
        db.query(sqldas, function (err, artikel) {
 if(!llss.length){
               u = ''
           }else{
               u = llss
           }
            message = ''
            var totalStudents = artikel.length,
                pageSize = 4,
                pageCount = Math.round(totalStudents / pageSize),
                currentPage = 1,
                studentsa = [],
                studentsArrays = [],
                studentsList = [];


            for (var i = 0; i < totalStudents; i++) {
                studentsa.push({
                    id: artikel[i].id_artikel,
                    titpro: artikel[i].judul_atikel,
                    isi: artikel[i].isi_artikel,
                    img: artikel[i].gambar_artikel,
                    publis: artikel[i].data_publis,
                    penulis: artikel[i].penulis_artikel,
                    idkat: artikel[i].id_katego_artikel

                });
            }

            while (studentsa.length > 0) {
                studentsArrays.push(studentsa.splice(0, pageSize));
            }



            if (typeof req.query.page !== 'undefined') {
                currentPage = +req.query.page;
            }


            studentsList = studentsArrays[+currentPage - 1];

            res.render('./panel/artartikelpagepanel', {
                datas: studentsList,
                pageSize: pageSize,
                totalStudents: totalStudents,
                kategoriartikel: u,
                pageCount: pageCount,
                currentPage: currentPage,

            });

        })
    })


}






exports.artikelkonten = function (req, res) {
    var name = req.params.name;
    var k , u;
var id = req.params.id.replace(/\-/g, " ")
        console.log(id)
    var sqldasa = "SELECT  * FROM  kategori_artikel";
    db.query(sqldasa, function (err, llss) {
        var x = /^(\+|-)?\d+$/;
        if (x.test(name)) {
            //integer
            console.log('bener')


        } else {
            //not an integer
            k = 'Error'
            res.render('artikelpage', {
                datas: null,
                uri: req,
                kategoriartikel: llss,
                title: k,
                 ls: k,
                uri: req,
                katerelate: '',
                pagename: 'artikel',
                num: name,
                   art: '',
                artk:''
            });

            return

        }
        var sqldas = "SELECT  * FROM artikel_data WHERE id_artikel='" + name +"' AND judul_atikel='"+id+"'";
        db.query(sqldas, function (err, artikel) {

            if (!artikel.length) {
                k = 'Error'
                res.render('artikelpage', {
                    datas: null,
                    uri: req,
                    kategoriartikel: llss,
                    title: k,
                     ls: k,
                    uri: req,
                    katerelate: '',
                    pagename: 'artikel',
                    num: name,
                       art: '',
                artk:''
                });


            } else {

                var sqldasx = "SELECT * FROM artikel_data WHERE id_katego_artikel=" + artikel[0].id_katego_artikel + " LIMIT 4";
                db.query(sqldasx, function (err, kate) {


                    var y;

                    k = artikel[0].judul_atikel
                    u =  artikel[0].judul_atikel.replace(/\s/g, "-");

                    if (kate[0].id_artikel === name) {
                        y = ''
                        return true
                    } else {

                        y = kate
                    }
                    console.log(y)
                    res.render('artikelpage', {
                        datas: artikel,
                        uri: req,
                        kategoriartikel: llss,
                        title: k,
                        ls: u,
                        uri: req,
                        katerelate: y,
                        pagename: 'artikel',
                        num: name,
                           art: '',
                artk:'yes'
                    });



                })
            }

        })

    })

}








exports.artikelkatlist = function (req, res) {
    var name = req.params.name.replace(/\.[^/.]+$/, "");
    var id = req.params.id.replace(/\-/g, " ")
        console.log(id)
    var sqldasa = "SELECT  * FROM  kategori_artikel";
    db.query(sqldasa, function (err, llss) {
        var x = /^(\+|-)?\d+$/;
        if (x.test(name)) {
            //integer
            console.log('bener')


        } else {
            //not an integer
            lo = 'Error'

            res.render('artikelkat', {
                datas: null,
                pageSize: null,
                totalStudents: null,
                pageCount: null,
                currentPage: null,
                uri: req,
                kategoriartikel: llss,
                art: '',
                artk:'',
                uri: req,
                title: lo,
                pagename: 'artikel',
                num: name,
            });

            return

        }
        var sqldasas = "SELECT  * FROM  kategori_artikel WHERE id_artikel='" + name +"' AND kategori_artikel_nama='"+id+"'";
        db.query(sqldasas, function (err, lo) {
 if (!lo.length) {
                    lo = 'Error'
       res.render('artikelkat', {
                        datas: null,
                        pageSize: null,
                        totalStudents: null,
                        pageCount: null,
                        currentPage: null,
                        uri: req,
                        kategoriartikel: llss,
                        art: '',
                        artk:'',
                        uri: req,
                        title: lo,
                        pagename: 'artikel',
                        num: name,
                    });
     return
     
 }
            var sqldas = "SELECT  * FROM artikel_data WHERE id_katego_artikel=" + name;
            db.query(sqldas, function (err, artikel) {
                if (!lo.length) {
                    lo = 'Error'

                    res.render('artikelkat', {
                        datas: null,
                        pageSize: null,
                        totalStudents: null,
                        pageCount: null,
                        currentPage: null,
                        uri: req,
                        kategoriartikel: llss,
       art: '',
 artk:'',
                        uri: req,
                        title: lo,
                        pagename: 'artikel',
                        num: name,
                    });

                } else if (lo && !artikel.length) {


                    lo = 'Error'

                    res.render('artikelkat', {
                        datas: null,
                        pageSize: null,
                        totalStudents: null,
                        pageCount: null,
                        currentPage: null,
                        uri: req,
                        kategoriartikel: llss,
       art: '',
 artk:'',
                        uri: req,
                        title: lo,
                        pagename: 'artikel',
                        num: name,
                    });


                } else {
                    na = lo
                }
                if (!artikel.length) {

                } else {


                    var totalStudents = artikel.length,
                        pageSize = 4,
                        pageCount = Math.round(totalStudents / pageSize),
                        currentPage = 1,
                        studentsa = [],
                        studentsArrays = [],
                        studentsList = [];


                    for (var i = 0; i < totalStudents; i++) {
                        studentsa.push({
                            imgurl: artikel[i].gambar_artikel,
                            judul: artikel[i].judul_atikel,
                            isi: artikel[i].isi_artikel,
                            tanggal: artikel[i].data_publis,
                            penulis: artikel[i].penulis_artikel,
                            id: artikel[i].id_artikel

                        });
                    }

                    while (studentsa.length > 0) {
                        studentsArrays.push(studentsa.splice(0, pageSize));
                    }



                    if (typeof req.query.page !== 'undefined') {
                        currentPage = +req.query.page;
                    }


                    studentsList = studentsArrays[+currentPage - 1];

                    res.render('artikelkat', {
                        datas: studentsList,
                        pageSize: pageSize,
                        totalStudents: totalStudents,
                        pageCount: pageCount,
                        currentPage: currentPage,
                        uri: req,
                        kategoriartikel: llss,
       art: 'yes',
 artk:'',
                        uri: req,
                        title: lo,
                        pagename: 'artikel',
                        num: name,
                    });





                }


                console.log(artikel)

            })
        })

    })

}



exports.gallerypotokategori = function (req, res) {

    var name = req.params.name;
    var na;
    var sqldasa = "SELECT  * FROM kategori_poto";
    db.query(sqldasa, function (err, llss) {
        var x = /^(\+|-)?\d+$/;
        if (x.test(name)) {
            //integer
            console.log('bener')


        } else {
            //not an integer
            na = 'Error'

            res.render('galerripage', {
                datas: null,
                pageSize: null,
                totalStudents: null,
                pageCount: null,
                currentPage: null,
                uri: req,
                title: na,
                imageog: null,
                kategoripoto: llss,
                num: name,
                pagename: 'galery'
                   ,gal: ''
                   ,galk: ''
            });
            return

        }
        var sqldass = "SELECT  nama_kategori FROM kategori_poto WHERE id_kategori_poto=" + name;
        db.query(sqldass, function (err, llsa) {


            var sqldas = "SELECT * FROM photo_galery WHERE kategori_poto=" + name;
            db.query(sqldas, function (err, lls) {
                if (!llsa.length) {
                    na = 'Error'

                    res.render('galerripage', {
                        datas: null,
                        pageSize: null,
                        totalStudents: null,
                        pageCount: null,
                        currentPage: null,
                        uri: req,
                        title: na,
                        imageog: null,
                        kategoripoto: llss,
                        num: name,
                        pagename: 'galery'
                           ,gal: ''
                   ,galk: ''
                    });
                    return
                } else if (llsa && !lls.length) {
                    na = 'Error'
                    res.render('galerripage', {
                        datas: null,
                        pageSize: null,
                        totalStudents: null,
                        pageCount: null,
                        currentPage: null,
                        uri: req,
                        title: na,
                        imageog: null,
                        kategoripoto: llss,
                        num: name,
                        pagename: 'galery'
                           ,gal: ''
                   ,galk: ''
                    });
                } else {
                    na = llsa[0].nama_kategori
                }
                console.log(na)
                if (!lls.length) {} else {
                    var totalStudents = lls.length,
                        pageSize = 4,
                        pageCount = Math.round(totalStudents / pageSize),
                        currentPage = 1,
                        studentsa = [],
                        studentsArrays = [],
                        studentsList = [];
                    for (var i = 0; i < totalStudents; i++) {
                        studentsa.push({
                            imgurl: lls[i].imageuri,
                            deskrip: lls[i].deskrip,
                            id: lls[i].id_photo_galery
                        });
                    }
                    while (studentsa.length > 0) {
                        studentsArrays.push(studentsa.splice(0, pageSize));
                    }
                    if (typeof req.query.page !== 'undefined') {
                        currentPage = +req.query.page;
                    }
                    studentsList = studentsArrays[+currentPage - 1];
                    console.log(na)
                    res.render('galerripage', {
                        datas: studentsList,
                        pageSize: pageSize,
                        totalStudents: totalStudents,
                        pageCount: pageCount,
                        currentPage: currentPage,
                        uri: req,
                        title: na,
                        imageog: req.protocol + '://' + req.get('host') + '/potogaleryimage/' + lls[0].imageuri,
                        kategoripoto: llss,
                        num: name,
                        pagename: 'galery'
                           ,gal: 'yes'
                   ,galk: ''
                    });
                }
            })
        })
    })
}






//--- karir section 





//--- edit karir setup 
exports.editkarirposting = function (req, res) {
    var name = req.params.id;
    var k
    var u
    var sqldassa = "SELECT  * FROM  kategori_karir";
    
    db.query(sqldassa, function (err, llssa) {
        var x = /^(\+|-)?\d+$/;
        if (x.test(name)) {
            //integer
            console.log('bener')


        } else {
            //not an integer
            res.redirect('/home/karir-page-panel');

            return

        }
        console.log(name)
        
        var sqldasa = "SELECT * FROM karir_data WHERE id_karir=" +name;
        db.query(sqldasa, function (err, llss) {
            if (!llss.length) {
                res.redirect('/home/karir-page-panel');

                return

            } else {
                 if(!llssa.length){
                   u = ''
                   console.log(u)
                }else{
                    u = llssa
                }
                var sqldasas = "SELECT  * FROM  kategori_karir WHERE id_kategori_karir="+u;
                db.query(sqldasas, function (err, llssx) {
                    console.log(llssx)
                    message = ''
                    res.render('./panel/halamaneditkarir', {
                        datas: llss,
                        kategoriartikel: u,
                        namakategori: llssx

                    });

                });
            }
        });
    });
}



//--- karir setup new 
exports.karirnewsetup = function (req, res) {
     var months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
    var myDays = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jum at', 'Sabtu'];
    var date = new Date();
    var day = date.getDate();
    var month = date.getMonth();
    var thisDay = date.getDay(),
        thisDay = myDays[thisDay];
    var yy = date.getYear();
    var year = (yy < 1000) ? yy + 1900 : yy;
    var tanggal = thisDay + ', ' + day + ' ' + months[month] + ' ' + year
         var sqla = "INSERT INTO karir_data (nama_karir, deskripsi_karir, tangal_publis, kategori_karir) VALUES ('" + req.body.title + "','" + req.body.texteditor + "','" + tanggal + "','" + req.body.kategorikarir + "')";
        db.query(sqla, function (err, results) {
            if (err) throw err;
            var sqla = "SELECT * FROM karir_data";
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
                    id: resultsa[i].id_karir,
                    titpro: resultsa[i].nama_karir,
                    isi: resultsa[i].deskripsi_karir,
                    img: resultsa[i].gambar_artikel,
                    publis: resultsa[i].tangal_publis,
                    idkat: resultsa[i].kategori_karir
                    });
                }
                while (studentsa.length > 0) {
                    studentsArrays.push(studentsa.splice(0, pageSize));
                }
                if (typeof req.query.page !== 'undefined') {
                    currentPage = +req.query.page;
                }
                studentsList = studentsArrays[+currentPage - 1];
                res.render('./panel/karirpagepanel', {
                    datas: studentsList,
                    pageSize: pageSize,
                    totalStudents: totalStudents,
                    pageCount: pageCount,
                    currentPage: currentPage
                });
            });
        })
  
}







//-- edit post karir setup
exports.karirpostingeditpost = function (req, res) {
     var months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
    var myDays = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jum at', 'Sabtu'];
    var date = new Date();
    var day = date.getDate();
    var month = date.getMonth();
    var thisDay = date.getDay(),
        thisDay = myDays[thisDay];
    var yy = date.getYear();
    var year = (yy < 1000) ? yy + 1900 : yy;
    var tanggal = thisDay + ', ' + day + ' ' + months[month] + ' ' + year
 
          
        db.query('UPDATE `karir_data` SET `nama_karir` = ?, `deskripsi_karir` = ?, `kategori_karir` = ?  WHERE `id_karir` = ?', [req.body.title, req.body.textedit, req.body.katkar, req.body.idedit], function (err, results) {
            if (err) throw err;
            var sqla = "SELECT * FROM karir_data WHERE id_karir =" + req.body.idedit;
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
                       id: resultsa[i].id_karir,
                    titpro: resultsa[i].nama_karir,
                    isi: resultsa[i].deskripsi_karir,
                    img: resultsa[i].gambar_artikel,
                    publis: resultsa[i].tangal_publis,
                    idkat: resultsa[i].kategori_karir
                    });
                }

                while (studentsa.length > 0) {
                    studentsArrays.push(studentsa.splice(0, pageSize));
                }



                if (typeof req.query.page !== 'undefined') {
                    currentPage = +req.query.page;
                }


                studentsList = studentsArrays[+currentPage - 1];
                res.render('./panel/karirpagepanel', {
                    datas: studentsList,
                    pageSize: pageSize,
                    totalStudents: totalStudents,
                    pageCount: pageCount,
                    currentPage: currentPage,
                    kategoriartikel: resultsa
                });


            });

        })

    


}
















//-- karir new delete

exports.newkarirpanel_delete = function (req, res) {
    var userId = req.session.userId;
    if (userId == null) {
        res.redirect("/login");
        return;
    }
    var ids = req.params.id;
    var sql = "DELETE FROM karir_data  WHERE `id_karir`='" + ids + "'";
    db.query(sql, function (err, results) {
  var sqldasa = "SELECT * FROM `kategori_karir`";
    db.query(sqldasa, function (err, llss) {
        var sqls = "SELECT * FROM karir_data";
        db.query(sqls, function (err, resultsa) {
            message = '';
            var totalStudents = resultsa.length,
                pageSize = 6,
                pageCount = Math.round(totalStudents / pageSize),
                currentPage = 1,
                students = [],
                studentsArrays = [],
                studentsList = [];



            for (var i = 0; i < totalStudents; i++) {
                students.push({
                      id: resultsa[i].id_karir,
                    titpro: resultsa[i].nama_karir,
                    isi: resultsa[i].deskripsi_karir,
                     publis: resultsa[i].tangal_publis,
                    idkat: resultsa[i].kategori_karir
                });
            }

            while (students.length > 0) {
                studentsArrays.push(students.splice(0, pageSize));
            }

            if (typeof req.query.page !== 'undefined') {
                currentPage = +req.query.page;
            }


            studentsList = studentsArrays[+currentPage - 1];

            res.render('./panel/karirpagepanel', {
                datas: studentsList,
                pageSize: pageSize,
                totalStudents: totalStudents,
                pageCount: pageCount,
                                karirkategori: llss,

                currentPage: currentPage
            });

        })
        });

    });

    //console.log(query.sql);


};




//--- karir setup
exports.karirpanelsetup = function (req, res) {
    var name = req.params.name;
    var k
    var u
    var sqldasa = "SELECT * FROM `kategori_karir`";
    db.query(sqldasa, function (err, llss) {


        console.log(llss)
        var sqldas = "SELECT * FROM karir_data";
        db.query(sqldas, function (err, artikel) {

                if(!llss.length){
                   u = ''
                   
                }else{
                    u = llss
                }
            message = ''
            var totalStudents = artikel.length,
                pageSize = 4,
                pageCount = Math.round(totalStudents / pageSize),
                currentPage = 1,
                studentsa = [],
                studentsArrays = [],
                studentsList = [];


            for (var i = 0; i < totalStudents; i++) {
                studentsa.push({
                    id: artikel[i].id_karir,
                    titpro: artikel[i].nama_karir,
                    isi: artikel[i].deskripsi_karir,
                    img: artikel[i].gambar_artikel,
                    publis: artikel[i].tangal_publis,
                    idkat: artikel[i].kategori_karir

                });
            }

            while (studentsa.length > 0) {
                studentsArrays.push(studentsa.splice(0, pageSize));
            }



            if (typeof req.query.page !== 'undefined') {
                currentPage = +req.query.page;
            }


            studentsList = studentsArrays[+currentPage - 1];

            res.render('./panel/karirpagepanel', {
                datas: studentsList,
                pageSize: pageSize,
                totalStudents: totalStudents,
                karirkategori: u,
                pageCount: pageCount,
                currentPage: currentPage,

            });

        })
    })


}






//--- kategori karir  
exports.kategorikarirpanel = function (req, res) {
    var userId = req.session.userId;
    if (userId == null) {
        res.redirect("/login");
        return;
    }


    var sql = "SELECT * FROM kategori_karir";
    db.query(sql, function (err, results) {
        message = '';

        var totalStudents = results.length,
            pageSize = 6,
            pageCount = Math.round(totalStudents / pageSize),
            currentPage = 1,
            students = [],
            studentsArrays = [],
            studentsList = [];

        for (var i = 0; i < totalStudents; i++) {
            students.push({
                kategori: results[i].nama_kategori_karir,
                id: results[i].id_kategori_karir
            });
        }

        while (students.length > 0) {
            studentsArrays.push(students.splice(0, pageSize));
        }

        if (typeof req.query.page !== 'undefined') {
            currentPage = +req.query.page;
        }

        studentsList = studentsArrays[+currentPage - 1];
        res.render('./panel/kategorikarirpanel', {
            data: studentsList,
            pageSize: pageSize,
            totalStudents: totalStudents,
            pageCount: pageCount,
            currentPage: currentPage
        });

        //   res.render('kategori',{data:results,message: message });
    });
    //console.log(query.sql);
};


//--- add new karir kategori

exports.addnewkategorikarirpanel = function (req, res) {
    var datas = req.params.data;


    db.query("INSERT INTO `kategori_karir` (`nama_kategori_karir`) VALUES ('" + datas + "')", function (err, results) {


        var sqls = "SELECT * FROM kategori_karir";
        db.query(sqls, function (err, results) {
            message = '';
            var totalStudents = results.length,
                pageSize = 6,
                pageCount = Math.round(totalStudents / pageSize),
                currentPage = 1,
                students = [],
                studentsArrays = [],
                studentsList = [];



            for (var i = 1; i < totalStudents; i++) {
                students.push({
                    kategori: results[i].nama_kategori_karir,
                    id: results[i].id_kategori_karir
                });
            }

            while (students.length > 0) {
                studentsArrays.push(students.splice(0, pageSize));
            }

            if (typeof req.query.page !== 'undefined') {
                currentPage = +req.query.page;
            }


            studentsList = studentsArrays[+currentPage - 1];

            res.render('./panel/kategorikarirpanel', {
                data: studentsList,
                pageSize: pageSize,
                totalStudents: totalStudents,
                pageCount: pageCount,
                currentPage: currentPage
            });


        });


    });

};


//--- edit karir panel 

exports.editkarirpanel = function (req, res) {
    var ids = req.params.kategori;
    var datas = req.params.data;

    db.query('UPDATE `kategori_karir` SET `nama_kategori_karir` = ? WHERE `id_kategori_karir` = ?', [datas, ids], function (err, results) {

        var sqls = "SELECT * FROM kategori_karir";
        db.query(sqls, function (err, results) {
            message = '';
            var totalStudents = results.length,
                pageSize = 6,
                pageCount = Math.round(totalStudents / pageSize),
                currentPage = 1,
                students = [],
                studentsArrays = [],
                studentsList = [];



            for (var i = 0; i < totalStudents; i++) {
                students.push({
                    kategori: results[i].nama_kategori_karir,
                    id: results[i].id_kategori_karir
                });
            }

            while (students.length > 0) {
                studentsArrays.push(students.splice(0, pageSize));
            }

            if (typeof req.query.page !== 'undefined') {
                currentPage = +req.query.page;
            }


            studentsList = studentsArrays[+currentPage - 1];

            res.render('./panel/kategorikarirpanel', {
                data: studentsList,
                pageSize: pageSize,
                totalStudents: totalStudents,
                pageCount: pageCount,
                currentPage: currentPage
            });


        });


    });

};

//-- delete karir kategori

exports.kategorikarirpanel_delete = function (req, res) {
    var userId = req.session.userId;
    if (userId == null) {
        res.redirect("/login");
        return;
    }
    var ids = req.params.id;
    var sql = "DELETE FROM kategori_karir  WHERE `id_kategori_karir`='" + ids + "'";
    db.query(sql, function (err, results) {

        var sqls = "SELECT * FROM kategori_karir";
        db.query(sqls, function (err, results) {
            message = '';
            var totalStudents = results.length,
                pageSize = 6,
                pageCount = Math.round(totalStudents / pageSize),
                currentPage = 1,
                students = [],
                studentsArrays = [],
                studentsList = [];



            for (var i = 0; i < totalStudents; i++) {
                students.push({
                    kategori: results[i].nama_kategori_karir,
                    id: results[i].id_kategori_karir
                });
            }

            while (students.length > 0) {
                studentsArrays.push(students.splice(0, pageSize));
            }

            if (typeof req.query.page !== 'undefined') {
                currentPage = +req.query.page;
            }


            studentsList = studentsArrays[+currentPage - 1];

            res.render('./panel/kategorikarirpanel', {
                data: studentsList,
                pageSize: pageSize,
                totalStudents: totalStudents,
                pageCount: pageCount,
                currentPage: currentPage
            });


        });

    });

    //console.log(query.sql);


};






//--- edit slide show 
exports.editslideshow = function (req, res) {
    var name = req.params.id;
    var k

    var x = /^(\+|-)?\d+$/;
    if (x.test(name)) {
        //integer
        console.log('bener')


    } else {
        //not an integer
        res.redirect('/home/slidepage');

        return

    }
    var sqldasa = "SELECT  * FROM  slide_front  WHERE id_slide=" + name;
    db.query(sqldasa, function (err, llss) {
        if (!llss.length) {
            res.redirect('/home/slidepage');

            return

        } else {

            message = ''
            res.render('./panel/halamaneditslide', {
                datas: llss

            });


        }
    });

}


exports.editslideshowposting = function (req, res) {
    const randomNumber = new Date().getTime() + Math.floor(Math.random() * 1000)

if(!req.body.title){
    
return    
}

    if (!req.files.sampleFile) {
        var tql = 'UPDATE `slide_front` SET  `deskrip_slide`= ?,  `title_slide`= ?  WHERE `id_slide` = ?'
        db.query(tql, [req.body.deskrip, req.body.title, req.body.idedit], function (err, results) {

res.send(200)

        })

    } else {

        let sampleFile = req.files.sampleFile;

        sampleFile.mv('./public/image/slide_image/' + randomNumber + req.files.sampleFile.name.replace(/ /g, "_"), function (err) {

            var t = randomNumber + '-' + req.files.sampleFile.name.replace(/ /g, "_")

            var sqld = "SELECT * FROM slide_front WHERE `id_slide`='" + req.body.idedit;
            db.query(sqld, function (err, resultsi) {


                if (fs.existsSync('./public/image/slide_image/min/' + resultsi[0].image_slide)) {
                    fs.unlink('./public/image/slide_image/min/' + resultsi[0].image_slide, (err) => {
                        if (err) {
                            console.log("failed to delete local image:" + err);
                        } else {
                            console.log('successfully deleted local image');
                        }
                    })
                }


               /* easyimg.resize({
                    src: './public/image/slide_image/' + randomNumber + req.files.sampleFile.name.replace(/ /g, "_"),
                    dst: './public/image/slide_image/min/' + randomNumber + req.files.sampleFile.name.replace(/ /g, "_"),
                    width: 650,
                }).then(function (file) {

                    fs.unlink('./public/image/slide_image/' + randomNumber + req.files.sampleFile.name.replace(/ /g, "_"), (err) => {
                        if (err) {

                        }
                    })

                });
*/


                var sqql = 'UPDATE `slide_front` SET `image_slide` = ? , `deskrip_slide`= ?, `title_slide`= ?  WHERE `id_slide` = ?';

                db.query(sqql, [t, req.body.deskrip, req.body.title, req.body.idedit], function (err, results) {
res.send(200)
                });


            });
        });
    }


}







exports.catcaree= function (req, res) {
        var name = req.params.id;

    var sqld = "SELECT * FROM kategori_karir";
    db.query(sqld, function (err, rowdata) {
         var x = /^(\+|-)?\d+$/;
        if (x.test(name)) {
            //integer
            console.log('bener')


        } else {
            
          res.render('karirkart', {
                    pagename: 'karir',
                    uri: req,
                    kategorikarir: rowdata,
                    datas: '',
kari: '',
kart: 'yes'
                });
            return
        }
        
         db.query("SELECT * FROM karir_data WHERE kategori_karir="+name , function (err, sld) {

           var t = sld.length
           
           console.log(t)
             if (t == 0) {
                res.render('karirkart', {
                    pagename: 'karir',
                    uri: req,
                    kategorikarir: rowdata,
                    datas: '',
kari: '',
kart: 'yes'
                });
                return

            } else {
                
                         db.query("SELECT * FROM kategori_karir WHERE id_kategori_karir="+name , function (err, slds) {

                
                
                res.render('karirkart', {
                    pagename: 'karir',
                    uri: req,
                    kategorikarir: rowdata,
                    datas: sld,
                    kars: slds[0].nama_kategori_karir,
                    kari: '',
                    kart: 'yes'
                });
                             
                              });
            }
        })
        
    })
    
}










exports.applys = function (req, res) {
        var name = req.params.id;

    var sqld = "SELECT * FROM kategori_karir";
    db.query(sqld, function (err, rowdata) {
         var x = /^(\+|-)?\d+$/;
        if (x.test(name)) {
            //integer
            console.log('bener')


        } else {
            
          res.render('karirapply', {
                    pagename: 'karir',
                    uri: req,
                    kategorikarir: rowdata,
                    datas: '',
kari: 'yes',
kart: ''
                });
            return
        }
        db.query("SELECT * FROM karir_data WHERE id_karir="+name , function (err, sld) {

           var t = sld.length
           
           console.log(t)
             if (t == 0) {
                res.render('karirapply', {
                    pagename: 'karir',
                    uri: req,
                    kategorikarir: rowdata,
                    datas: '',
kari: 'yes',
kart: ''
                });
                return

            } else {
                res.render('karirapply', {
                    pagename: 'karir',
                    uri: req,
                    kategorikarir: rowdata,
                    datas: sld,
                    kari: 'yes',
                    kart: ''
                });
            }
        })
    })
}



exports.careerpage = function (req, res) {
    var sqld = "SELECT * FROM kategori_karir";
    db.query(sqld, function (err, rowdata) {
        
        db.query("SELECT * FROM karir_data", function (err, sld) {

           var t = sld.length
           
           console.log(t)
             if (t == 0) {
                res.render('karir', {
                    pagename: 'karir',
                    uri: req,
                    kategorikarir: rowdata,
                    datas: '',
kari: 'yes',
kart: ''
                });
                return

            } else {
                res.render('karir', {
                    pagename: 'karir',
                    uri: req,
                    kategorikarir: rowdata,
                    datas: sld,
                    kari: 'yes',
                    kart: ''
                });
            }
        })
    })
}




exports.got = function (req, res) {


                            res.render('er');

}




exports.fronts = function (req, res) {
    var p = []
    var sqld = "SELECT * FROM kategori";
    db.query(sqld, function (err, rowdata) {
        var sqlda = "SELECT * FROM slide_front";
        db.query(sqlda, function (err, sld) {
            var sqldas = "SELECT * FROM artikel_data LIMIT 8";
            db.query(sqldas, function (err, artikel) {
                var sqldasv = "SELECT * FROM video_galery LIMIT 8";
                db.query(sqldasv, function (err, videos) {


                    /*
                    for(i = 0; i < videos.length; i++){
                    var t = videos[i].uri_video;
                             var video_id =t.split('v=')[1];
var ampersandPosition = video_id.indexOf('&');
if(ampersandPosition != -1) {
  video_id = video_id.substring(0, ampersandPosition);
} 
                                   
                        p.push(t)
                        
                    }
                    
              */

                    var sqldasvs = "SELECT * FROM photo_galery LIMIT 8";
                    db.query(sqldasvs, function (err, photo) {
                        db.query('SELECT * , (SELECT imageuri FROM gambar WHERE product.produk_id=gambar.produk_id LIMIT 1) AS gambars FROM product WHERE status=0', function (err, resultsa) {

                            res.render('index', {
                                kategori: rowdata,
                                slide: sld,
                                news: artikel,
                                data: resultsa,
                                video: videos,
                                poto: photo,
                                pagename: 'index',
                                uri: req
                            });
                        });
                    });
                    console.log(sld)
                });
            });
        })
    })
}








//--- new kategori panel video 


exports.addnewkategorivideopanel = function (req, res) {
    var datas = req.params.data;


    db.query("INSERT INTO `video_kategori` (`name_kat_v`) VALUES ('" + datas + "')", function (err, results) {
res.send(200)
   
     


    });

};
// edit video kategori
exports.editvideokatpanel = function (req, res) {
    var ids = req.params.kategori;
    var datas = req.params.data;

    db.query('UPDATE `video_kategori` SET `name_kat_v` = ? WHERE `id_kat_v` = ?', [datas, ids], function (err, results) {
        
            message = '';
res.send(200)


        })
    }

// delete video kategori
exports.kategorivideopanel_delete = function (req, res) {
    var userId = req.session.userId;
    if (userId == null) {
        res.redirect("/login");
        return;
    }
    var ids = req.params.id;
    var sql = "DELETE FROM video_kategori  WHERE `id_kat_v`='" + ids + "'";
    db.query(sql, function (err, results) {

     
            message = '';
               res.redirect("/home/kategori-video-panel");

    });

    //console.log(query.sql);


};


//--- kategori panel video 



exports.kategorivideopanel = function (req, res) {

    var sql = "SELECT * FROM video_kategori";
    db.query(sql, function (err, results) {
                message = '';

        var totalStudents = results.length,
            pageSize = 6,
            pageCount = Math.round(totalStudents / pageSize),
            currentPage = 1,
            students = [],
            studentsArrays = [],
            studentsList = [];

        for (var i = 0; i < totalStudents; i++) {
            students.push({
                kategori: results[i].name_kat_v,
                id: results[i].id_kat_v
            });
        }

        while (students.length > 0) {
            studentsArrays.push(students.splice(0, pageSize));
        }

        if (typeof req.query.page !== 'undefined') {
            currentPage = +req.query.page;
        }

        studentsList = studentsArrays[+currentPage - 1];
        res.render('./panel/kategorivideopanel', {
            data: studentsList,
            pageSize: pageSize,
            totalStudents: totalStudents,
            pageCount: pageCount,
            currentPage: currentPage
        });
        
        
    })
     
}












//video gallery

exports.galleryvideokategori = function (req, res) {

   var name = req.params.name;
    var na;
    var sqldasa = "SELECT  * FROM video_kategori";
    db.query(sqldasa, function (err, llss) {
        var x = /^(\+|-)?\d+$/;
        if (x.test(name)) {
            //integer
            console.log('bener')


        } else {
            //not an integer
            na = 'Error'

            res.render('gallerivideo', {
                datas: null,
                pageSize: null,
                totalStudents: null,
                pageCount: null,
                currentPage: null,
                uri: req,
                title: na,
                 kategorv: llss,
                num: name,
                pagename: 'video'
                ,galv: ''
                   ,galkv: ''
            });
            return

        }
        var sqldass = "SELECT  name_kat_v FROM video_kategori WHERE id_kat_v=" + name;
        db.query(sqldass, function (err, llsa) {


            var sqldas = "SELECT * FROM video_galery WHERE kat_id=" + name;
            db.query(sqldas, function (err, lls) {
                if (!llsa.length) {
                    na = 'Error'

                    res.render('videogallery', {
                        datas: null,
                        pageSize: null,
                        totalStudents: null,
                        pageCount: null,
                        currentPage: null,
                        uri: req,
                        title: na,
                         kategorv: llss,
                        num: name,
                  pagename: 'video'
                ,galv: ''
                   ,galkv: ''
                    });
                    return
                } else if (llsa && !lls.length) {
                    na = 'Error'
                    res.render('videogallery', {
                        datas: null,
                        pageSize: null,
                        totalStudents: null,
                        pageCount: null,
                        currentPage: null,
                        uri: req,
                        title: na,
                         kategorv: llss,
                        num: name,
                     pagename: 'video'
                ,galv: ''
                   ,galkv: ''
                    });
                } else {
                    na = llsa[0].name_kat_v
                }
                console.log(na)
                if (!lls.length) {} else {
                    var totalStudents = lls.length,
                        pageSize = 4,
                        pageCount = Math.round(totalStudents / pageSize),
                        currentPage = 1,
                        studentsa = [],
                        studentsArrays = [],
                        studentsList = [];
                    for (var i = 0; i < totalStudents; i++) {
                        studentsa.push({
                            vurl: lls[i].uri_video,
                            deskrip: lls[i].title_video,
                            id: lls[i].id_video
                        });
                    }
                    while (studentsa.length > 0) {
                        studentsArrays.push(studentsa.splice(0, pageSize));
                    }
                    if (typeof req.query.page !== 'undefined') {
                        currentPage = +req.query.page;
                    }
                    studentsList = studentsArrays[+currentPage - 1];
                    console.log(na)
                    res.render('videogallery', {
                        datas: studentsList,
                        pageSize: pageSize,
                        totalStudents: totalStudents,
                        pageCount: pageCount,
                        currentPage: currentPage,
                        uri: req,
                        title: na,
                         kategorv: llss,
                        num: name,
                       pagename: 'video'
                ,galv: ''
                   ,galkv: 'yes'
                    });
                }
            })
        })
    })
    
}


