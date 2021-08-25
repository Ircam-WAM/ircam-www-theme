import sassMagicImporter from 'node-sass-magic-importer'
import fs from 'fs'
import sass from 'sass'
import path from 'path'

sass.render(
	{
		file: "/srv/app/ircam_www_theme/static/src/sass/index.scss",
		includePaths: [
			'/srv/app/ircam_www_theme/static/vendors',
			'/srv/app/ircam_www_theme/static/src/sass'
		],
        precision: 10,
        importer: sassMagicImporter({
        	disableImportOnce: true
      	}),
    }, function(err, result) {
	  	if(!err){
		    fs.writeFile(
		    	"/tmp/index.css",
		    	result.css,
		    	function(err){
			        if(err){
			          console.log(err)
			        }
			    }
			)
	    }else{
	    	console.log(err)
	    }
	}
)