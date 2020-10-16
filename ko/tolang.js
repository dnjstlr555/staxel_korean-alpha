const fs = require('fs'); 
const readline = require('readline'); 
const path = require('path');
const DIRECTORY = './'

fs.readdirSync(DIRECTORY).forEach(file => {
  JSONToLang(path.join(DIRECTORY,file));
});

function JSONToLang(dir) {
	let pathInfo = path.parse(dir);
	if(pathInfo.ext!=".json") return;
	let tolangDir=path.join(pathInfo.dir,`ko_tolang`, `${pathInfo.name}.lang`);
	fs.mkdirSync(path.join(pathInfo.dir, `ko_tolang`), {recursive:true});
	const datafile = fs.readFileSync(dir, {encoding:"utf8"});
	const data = JSON.parse(datafile);
	const stream=fs.createWriteStream(tolangDir,{encoding:"utf8"});
	for (const [key, value] of Object.entries(data)) {
		stream.write(`${key}=${value}\n`);
	}
	stream.end();
}
