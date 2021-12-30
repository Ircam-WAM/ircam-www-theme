import favicons from "favicons"
import fs from 'fs'

favicons(
	"/srv/app/ircam_www_theme/static/src/assets/favicon/favicon.png",
	
	{
	    background: "#ffffff",
	    path: "/favicons/",
	    replace: true,
	    icons: {
	        android: false,              // Create Android homescreen icon. `boolean`
	        appleIcon: true,            // Create Apple touch icons. `boolean`
	        appleStartup: false,         // Create Apple startup images. `boolean`
	        coast: false,                // Create Opera Coast icon. `boolean`
	        favicons: true,             // Create regular favicons. `boolean`
	        firefox: false,              // Create Firefox OS icons. `boolean`
	        opengraph: false,            // Create Facebook OpenGraph image. `boolean`
	        twitter: false,              // Create Twitter Summary Card image. `boolean`
	        windows: false,              // Create Windows 8 tile icons. `boolean`
	        yandex: false                // Create Yandex browser icon. `boolean`
	    }
    },
  	function (error, response) {
    	if (error) {
	      	console.log(error.message) // Error description e.g. "An unknown error has occurred"
	      	return
	    }
	    for(let image in response.images){
			fs.writeFile(
				'/srv/app/ircam_www_theme/static/img/favicons/' + response.images[image].name,
				response.images[image].contents,
				function(error, response){
					if(error){
						console.log(error)
					}
				}
			)
	    }
    }
)