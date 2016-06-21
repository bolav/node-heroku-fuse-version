var express = require('express');
var app = express();
var https = require('https');
YAML = require('yamljs');

app.set('port', (process.env.PORT || 5000));

app.get('/', function(request, response) {
  // https://github.com/bolav/fuse-sqlite
  // https://raw.githubusercontent.com/bolav/fuse-sqlite/master/.travis.yml
  var repo = request.query["repo"];
  repo = repo.replace('/github.com/', '/raw.githubusercontent.com/');
  repo = repo + '/master/.travis.yml';
  console.log(repo);
  var req = https.get(repo, function(hres) {
  	var data = '';
  	hres.on('data', function(d) {
  		data = data + d;
  	});
  	hres.on('end', function() {
  		var travis = YAML.parse(data);
  		// console.log(travis.env.global);
  		var arrayLength = travis.env.global.length;
  		for (var i = 0; i < arrayLength; i++) {
  		    var ver = /^FUSE\_VERSION\=(\d+\.\d+\.\d+)/.exec(travis.env.global[i]);
  		    if (ver) {
  		    	response.send(ver[1]);
  		    	return;
  		    }
  		    //Do something
  		} 
  		response.send('unknown');
  	});
  });
  req.end();
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});


