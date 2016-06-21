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
  		    	response.header("Content-Type", "image/svg+xml");
  		    	response.send('<svg height="20" width="90" xmlns="http://www.w3.org/2000/svg"><linearGradient id="a" x2="0" y2="100%"><stop offset="0" stop-color="#bbb" stop-opacity=".1"/><stop offset="1" stop-opacity=".1"/></linearGradient><rect fill="#555" height="20" rx="3" width="90"/><rect fill="#4c1" height="20" rx="3" width="53" x="37"/><path d="M37 0h4v20h-4z" fill="#4c1"/><rect fill="url(#a)" height="20" rx="3" width="90"/><g fill="#fff" font-family="DejaVu Sans,Verdana,Geneva,sans-serif" font-size="11" text-anchor="middle"><text fill="#010101" fill-opacity=".3" x="19.5" y="15">fuse</text><text x="19.5" y="14">fuse</text><text fill="#010101" fill-opacity=".3" x="62.5" y="15">'+ ver[1] +'</text><text x="62.5" y="14">' + ver[1] + '</text></g></svg>')
  		    	return;
  		    }
  		    //Do something
  		} 
  		response.header("Content-Type", "image/svg+xml");
	   	response.send('<svg height="20" width="90" xmlns="http://www.w3.org/2000/svg"><linearGradient id="a" x2="0" y2="100%"><stop offset="0" stop-color="#bbb" stop-opacity=".1"/><stop offset="1" stop-opacity=".1"/></linearGradient><rect fill="#555" height="20" rx="3" width="90"/><rect fill="#c41" height="20" rx="3" width="53" x="37"/><path d="M37 0h4v20h-4z" fill="#c41"/><rect fill="url(#a)" height="20" rx="3" width="90"/><g fill="#fff" font-family="DejaVu Sans,Verdana,Geneva,sans-serif" font-size="11" text-anchor="middle"><text fill="#010101" fill-opacity=".3" x="19.5" y="15">fuse</text><text x="19.5" y="14">fuse</text><text fill="#010101" fill-opacity=".3" x="62.5" y="15">unknown</text><text x="62.5" y="14">unknown</text></g></svg>')
  	});
  });
  req.end();
  // req.onerror?
  req.on('error', function(e) {
    console.error(e);
	response.header("Content-Type", "image/svg+xml");
   	response.send('<svg height="20" width="90" xmlns="http://www.w3.org/2000/svg"><linearGradient id="a" x2="0" y2="100%"><stop offset="0" stop-color="#bbb" stop-opacity=".1"/><stop offset="1" stop-opacity=".1"/></linearGradient><rect fill="#555" height="20" rx="3" width="90"/><rect fill="#c41" height="20" rx="3" width="53" x="37"/><path d="M37 0h4v20h-4z" fill="#c41"/><rect fill="url(#a)" height="20" rx="3" width="90"/><g fill="#fff" font-family="DejaVu Sans,Verdana,Geneva,sans-serif" font-size="11" text-anchor="middle"><text fill="#010101" fill-opacity=".3" x="19.5" y="15">fuse</text><text x="19.5" y="14">fuse</text><text fill="#010101" fill-opacity=".3" x="62.5" y="15">unknown</text><text x="62.5" y="14">unknown</text></g></svg>')
  });

});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});


