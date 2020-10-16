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
	console.log(`${pathInfo.name} does ${(data.hasOwnProperty("language"))?`have language with ${data["language"]}`:"NOT have language"} and ${data.hasOwnProperty("language.code")?`Codes good with ${data["language.code"]}`:"code missing"}`)
	if(!data.hasOwnProperty("language")) {
		const found = Object.values(data).indexOf("한국어");
		if(found>=0) delete data[found];
		data["language"]="한국어";
	} else {
		if(data["language"]!="한국어") {
			data["language"]="한국어";
		}
	}
	if(!data.hasOwnProperty("language.code")) {
		const found = Object.values(data).indexOf("ko-KR");
		if(found>=0) delete data[found];
		data["language.code"]="ko-KR";
	} else {
		if(data["language.code"]!="ko-KR") {
			data["language.code"]="ko-KR";
		}
	}
	
	
	const stream=fs.createWriteStream(tolangDir,{encoding:"utf8"});
	for (const [key, value] of Object.entries(data)) {
		stream.write(`${key}=${value}\n`);
	}
	stream.end();
	
}
