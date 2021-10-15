import fs from 'fs'
import path from "path"
import imagemin from 'imagemin'

var myArgs = process.argv.slice(2);

const root = myArgs[0]

// images minify
const getAllDirectories = function(dirPath, arrayOfDirectories) {
  const files = fs.readdirSync(dirPath)

  files.forEach(function(file) {
    if (fs.statSync(dirPath + "/" + file).isDirectory()) {
      arrayOfDirectories.push(path.join(dirPath, "/", file))
      arrayOfDirectories = getAllDirectories(dirPath + "/" + file, arrayOfDirectories)
    }
  })

  return arrayOfDirectories
}

const dirs = getAllDirectories(root, [root])
for(let dir in dirs){
	imagemin([dirs[dir] + ".{jpg,jpeg,png,gif,svg}"], {
		destination: dirs[dir],
		progressive: true,
	    optimizationLevel: 3
	})
}