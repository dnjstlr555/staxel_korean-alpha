const fs = require('fs'); 
const readline = require('readline'); 
const path = require('path');
const isEnglish = require("is-english");
const otherDIR = 'ko-KR';
const ourDIR = './'
let odt = {};
/* 
1. 기존 디렉터리에서 파일 이름으로 key, value는 중복되고 다른사람이 만들어둔 번역 데이터
2. 1) refer와 비교, 같으면 opt out
   2) 아예 없음 opt out
3. ko 디렉토리 우리꺼에 들어가서 확인
4. 해당 파일의 키가 있는지 확인
5. 있으면 먼저 json parse
6. asign between
7. save again.
*/
const dinfo = fs.readdirSync(otherDIR)
let requests = dinfo.map((item) => {
    return new Promise((resolve) => {
      OtherData(path.join(otherDIR,item), resolve);
    });
})
let req;
Promise.all(requests).then(() => {
	const ourinfo = fs.readdirSync(ourDIR);
	console.log("DONE")
	console.log(odt);
	ourinfo.forEach(file => {
	  OurDataUpdate(path.join(ourDIR,file));
	});
});

function OtherData(dir, promise) {
	let pathInfo = path.parse(dir);
	if(pathInfo.ext!=".lang") return;
	let dataInfo=path.join(pathInfo.dir,`ko`, `${pathInfo.name}.json`);
	let refInfo=path.join(pathInfo.dir, `ref`,`${pathInfo.name}.json`);
	const file = readline.createInterface({ 
		input: fs.createReadStream(dir, {encoding:"utf8"}), 
		output: process.stdout, 
		terminal: false
	}); 
	let data={};
	let temp, isNextNeedsValidated=false, isNextReferencing=false, isTODO=false, ref='';
	file.on('line', (l) => {
		if(l.includes(`=`)) {
			temp=l.split(`=`);
			if(temp[0]!='') {
				if(ref!=''&&!(temp[1].includes(ref))&&temp[1]!='') {
					if(!isEnglish(temp[1])) {
						data[temp[0]]=temp[1];
						console.log(`${temp[1]} logged as not english`)
					} else {
						console.log(`${temp[1]} ------------opted out`)
					}
				} else {
					let key = temp[0].split(`.`);
					if(key[0].includes('language') || key[0].includes('font')) {
						// data[temp[0]]=temp[1]
					}
				}
				
				if(isNextReferencing) {
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
		odt[pathInfo.name]=data;
		promise();
		console.log("saved");
	});
}

function OurDataUpdate(dir) {
	let pathInfo = path.parse(dir);
	let dataInfo=path.join(pathInfo.dir,`ko_combined`, `${pathInfo.name}.json`);
	if(pathInfo.ext!=".lang" || !odt.hasOwnProperty(pathInfo.name)) return;
	let jsonDt = JSON.parse(fs.readFileSync(dir));
	jsonDt = Object.assign(jsonDt, odt[pathInfo.name]);
//	fs.writeFileSync(dataInfo,JSON.stringify(jsonDt));
	console.log(`WRITED ${dataInfo}`)
}

