'use strict';
const mongoose = require('mongoose');
const mongourl = 'mongodb+srv://admin:lkpsmmv@cluster0.nmn3s.mongodb.net/test?authSource=admin&replicaSet=atlas-cz2iwc-shard-0&readPreference=primary&appname=MongoDB%20Compass&ssl=true';
mongoose.connect(mongourl, {}, err =>{
  if(err) {
    console.log(err);
  }
  else {
    console.log("connected to DB");
  }
})
var SwaggerExpress = require('swagger-express-mw');
var app = require('express')();
module.exports = app; // for testing

var config = {
  appRoot: __dirname // required config
};

SwaggerExpress.create(config, function(err, swaggerExpress) {
  if (err) { throw err; }

  // install middleware
  swaggerExpress.register(app);

  
  var port = process.env.PORT || 8090;
  app.listen(port, (err) => {
		if (!err) {

			console.log('Server started on port ' + port);
		} else
			console.log(err);
	});

});
