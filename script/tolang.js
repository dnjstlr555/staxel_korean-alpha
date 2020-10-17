const fs = require('fs'); 
const readline = require('readline'); 
const path = require('path');
const DIRECTORY = 'sta'

fs.readdirSync(DIRECTORY).forEach(file => {
  LangToJSON(path.join(DIRECTORY,file));
});

JSONToLang("./VorlenBestFriend_ko_KR.json")
function JSONToLang(dir) {
	let pathInfo = path.parse(dir);
	if(pathInfo.ext!=".json") return;
	let tolangDir=path.join(pathInfo.dir,`ko_tolang`);
	fs.mkdirSync(tolangDir, {recursive:true});
	const datafile = fs.readFileSync(dir, {encoding:"utf8"});
	const data = JSON.parse(datafile);
	const stream=fs.createWriteStream(dataInfo,{encoding:"utf8"});
	for (const [key, value] of Object.entries(data)) {
		stream.write(`${key}=${value}\n`);
	}
	stream.end();
}