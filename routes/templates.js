var express = require('express');
var router = express.Router();
var utils = require('../utils/utils');
var EJS = require('ejs');
var fs = require('fs');
var Building = require('../models/building');
var Floorplan = require('../models/floorplan');
var async = require('async');


function renderEJS(url, data) {
	var html = "";
	try {
		var templateString = null;
		fs.readFile('test.ejs', 'utf-8', function(err, data) {
		    if(!err) {
		    	console.log('data after reading file');
		    	console.log(data);
		        templateString = data;
		        html = EJS.render(templateString);
		        return html;
		    }
		});
		

		//html = new EJS({url:'/Users/Dirk/MIT/5th_Semester/6.811/repo/ppat_project/views/test.ejs'}).render();
		//it thinks EJS is a function
	}
	catch (err) {
		console.log('err in renderEJS: ' + err);
	}
	
	//return html;
}


function compareFloorplans(a,b) {
	if (a.number > b.number) {
		return 1;
	}
	else if (a.number < b.number) {
		return -1;
	}
	return 0
}


/*
  Renders an ejs template

  POST /templates/renderbuilding
  Request body:
    - building: an object to be passed into the ejs template
  Response:
    - success: rendered html
    - err: an error message
*/
router.post('/renderbuilding', function (req,res) {
	var dir = __dirname.split('/routes');
	var buildingIn = req.body;
	var url = dir[0] + req.body.url;

	Building.findById(buildingIn.id).populate('floorplans').exec(function (err,building) {

		building.floorplans = building.floorplans.sort(compareFloorplans);

		fs.readFile(url, 'utf-8', function(err, template) {
		    if(!err) {

		        templateString = template;
		        html = EJS.render(templateString, {building: building});
		        //console.log('rendered html: ');
		        //console.log(html);
		        res.send({html:html});
		    }
		    else {
		    	console.log('Error in reading file: ' + err);
		    }
		});
	});
});

/*
  Renders an ejs template

  POST /templates/render
  Request body:
    - data: data to render
  Response:
    - success: rendered html
    - err: an error message
*/
router.post('/render', function (req,res) {
	var data = req.body;

	var dir = __dirname.split('/routes');
	var url = dir[0] + req.body.url;

	var html = "";
	var templateString = null;
	fs.readFile(url, 'utf-8', function(err, template) {
	    if(!err) {
	        templateString = template;
	        html = EJS.render(templateString, {data: data});
	        res.send({html:html});
	    }
	});
});



module.exports = router;