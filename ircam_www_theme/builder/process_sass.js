import sassMagicImporter from 'node-sass-magic-importer'
import fs from 'fs'
import sass from 'sass'
import path from 'path'

let dest_path = "/tmp/index.css"
if(process.argv.slice(2).length != 0) dest_path = process.argv.slice(2)[0]

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
		    	dest_path,
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