/*
* GET home page.
*/
 
exports.index = function(req, res){
    var message = '';
  res.render('./panel/frontadm',{message: message});
 
};
