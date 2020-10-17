const fs = require('fs'); 
const readline = require('readline'); 
const path = require('path');
const DIRECTORY = './'
console.log("현재 디렉토리에 번역된 json 파일이 있어야 합니다. lang 변환 결과물은 현재 디렉토리의 ko_tolang이라는 폴더로 저장됩니다.")
console.log(`작업이 다 끝나면 Staxel\content\staxel\StaxelTranslations\ko-KR 폴더를 만들어 ko_tolang폴더 내용물을 옮겨주세요`);
console.log(`그리고 Staxel\content\staxel\StaxelTranslations\Staxel.Translations.exe 파일을 실행시켜서 Work Complete라는 문구가 뜰때까지 기다려주세요`);
console.log(`다 됬으면 Staxel\content\staxel\StaxelTranslations\ko-KR 폴더를 Staxel\content\mods\ko-KR 이곳으로 옮겨주세요 (기존 공식 번역이 덜 된 채로 올라가서 이를 덮어 씌워야 합니다)`);
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
	if(!data.hasOwnProperty("language")) {
		const found = Object.values(data).indexOf("한국어");
		if(found>=0) delete data[found];
		data["language"]="한국어";
		console.log(`${pathInfo.name} invalid language name fixed`);
	} else {
		if(data["language"]!="한국어") {
			console.log(`${pathInfo.name} invalid language name value fixed`);
			data["language"]="한국어";
		}
	}
	if(!data.hasOwnProperty("language.code")) {
		const found = Object.values(data).indexOf("ko-KR");
		if(found>=0) delete data[found];
		data["language.code"]="ko-KR";
		console.log(`${pathInfo.name} invalid language code fixed`);
	} else {
		if(data["language.code"]!="ko-KR") {
			data["language.code"]="ko-KR";
			console.log(`${pathInfo.name} invalid language code value fixed`);
		}
	}
	
	
	const stream=fs.createWriteStream(tolangDir,{encoding:"utf8"});
	for (const [key, value] of Object.entries(data)) {
		stream.write(`${key}=${value}\n`);
	}
	stream.end();
	console.log(`${tolangDir} Writing Complete`)
}
