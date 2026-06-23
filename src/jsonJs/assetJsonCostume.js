
import fs from 'fs';
import { resolve, dirname } from "path";
import { glob } from 'glob';
import { fileURLToPath } from 'url';

const ScratchFoundationAssetsURL = 'https://cdn.assets.scratch.mit.edu/internalapi/asset';


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const _srcAssetsPath = resolve(__dirname, '../assetJsons/scratchFoundation');

const fsProimse = fs.promises;

const costumesFile = `${_srcAssetsPath}/costumes.json`;

const costumeData = await fsProimse.readFile(costumesFile, 'utf-8');

const costumeJson = JSON.parse(costumeData);

const assetNames = [];

const json = [];


console.log(costumeJson.keys())
for(const key of costumeJson.keys()){
    const elem = costumeJson[key];
    const asset = {};
    asset['name'] = elem.name.replace(/\s([a-z])/g, m => m.toUpperCase()).replace(/\s/g, '').replace(/\-/g, '_');
    asset['creater'] =  'Scratch-Foundation';
    asset['tags'] =  elem.tags;
    asset['url'] = ScratchFoundationAssetsURL+'/'+elem.md5ext + '/get';
    asset['dataFormat'] = elem.dataFormat;
    json.push(asset);
}

const jsonStr = JSON.stringify(json, null, 4);
//console.log(jsonStr);
const srcAssetsPath = resolve(__dirname, '../assetJsons');
fs.writeFileSync(`${srcAssetsPath}/costumes.json`, jsonStr, 'utf8');