import { Gui } from "./gui";
Gui.createLayout();

import costumesJson from './assetJsons/costumes.json';
let counter = 0;
for(const costume of costumesJson) {
    Gui.addCostume(costume);
    counter+=1;
    if(counter>20) break;
}