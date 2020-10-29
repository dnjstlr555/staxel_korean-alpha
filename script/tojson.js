const fs = require('fs'); 
const readline = require('readline'); 
const path = require('path');
const DIRECTORY = './'

let translatedDir=path.join(DIRECTORY,`ko`);
let refDir=path.join(DIRECTORY,`ref`);
fs.mkdirSync(translatedDir, {recursive:true});
fs.mkdirSync(refDir, {recursive:true});

fs.readdirSync(DIRECTORY).forEach(file => {
  LangToJSON(path.join(DIRECTORY,file));
});

function LangToJSON(dir) {
	let pathInfo = path.parse(dir);
	if(pathInfo.ext!=".lang") return;
	let dataInfo=path.join(pathInfo.dir,`ko`, `${pathInfo.name}.json`);
	let refInfo=path.join(pathInfo.dir, `ref`,`${pathInfo.name}.json`);
	
	const file = readline.createInterface({ 
		input: fs.createReadStream(dir, {encoding:"utf8"}), 
		output: process.stdout, 
		terminal: false
	}); 
	let data={}, refs={};
	let temp, isNextNeedsValidated=false, isNextReferencing=false, isTODO=false, ref='';
	file.on('line', (l) => {
		if(l.includes(`=`)) {
			temp=l.split(`=`);
			if(temp[0]!='') {
				if((ref!=''&&!(temp[1].includes(ref))) || (ref==''&&temp[1]!='')) {
					data[temp[0]]=temp[1];
				} else {
					let key = temp[0].split(`.`);
					data[temp[0]]=(key[0].includes('language') || key[0].includes('font'))?temp[1]:"";
				}
				
				if(isNextReferencing) {
					refs[temp[0]]=`${ref}`;
					isNextReferencing=false;
					isNextNeedsValidated=false;
					isTODO=false;
					ref="";
				}
			}
		} else if(l.includes(`//`)) {
			if(l.includes(`[Reference]`)) {
				ref=l.substring(l.indexOf(`'`)+1, l.lastIndexOf(`'`));
				isNextReferencing=true;
			} else if (l.includes(`[Validate]`)) {
				isNextNeedsValidated=true;
			} 
			if(l.includes(`TODO Translate`)) {
				isTODO=true;
			}
		}
	}); 
	file.on('close', () => {
		fs.writeFileSync(refInfo,JSON.stringify(refs));
		fs.writeFileSync(dataInfo,JSON.stringify(data));
		console.log("write complete");
	});
}
