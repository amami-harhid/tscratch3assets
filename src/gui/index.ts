import costumesJson from '../assetJsons/costumes.json';
import backdropsJson from '../assetJsons/backdrops.json';
import soundsJson from '../assetJsons/sounrds.json';
import { SoundSvgData } from './soundSvg';
import { SoundPlayData, SoundStopData } from './soundSvg';
import audioBufferToWav from 'audiobuffer-to-wav';

import { loadingGif } from './loadingGif';
import { Timer } from './timer';
import { Sound } from './sound';

declare global {
  interface Window {
    webkitAudioContext?: typeof AudioContext;
  }
}

const css = `
    html, body {
        height: 100%;
    }
    .border {
        border: 1px solid black;
        border-radius: 10px;
    }
    div.header {
        position: relative;
        display: flex;
        margin: 0 auto;
        height:50px;
        width:100%;
        background-color:#fea0a0;
        align-items: center;
    }
    div.typeDiv {
        display: flex;
        padding-left:10px;
        align-items: center;
    }
    div.hidden {
        visibility: hidden;
    }
    .container {
        position: relative;
        margin: 0 auto;
        top: 50;
        width:100%;
        height:100%;
    }
    div.container_inner {
        position: relative;
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
        opacity: 0.9;
        background-color:#fefefe;
        margin:2px;
    }
    div.element {
        background-color: #fafafa;
        border: 1px solid #505050;
        display: flex;
        justify-content: center;
        align-items: center;
        width:150px;
        height:150px;
    }
    .fit {
        width: fit-content;
    }
    img.thumbnail {
        opacity: 1.0;
    }
    .play-element {
        position:relative;
        display: flex;
        justify-content: center;
        align-items: center;

    }
    .play-button {
        right:0.5rem;
    }
    .play-button {
        display:flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
        width:2.5rem;
        height: 2.5rem;
        background-color: hsla(300,53%,60%,1);
        color: hsla(0, 100%, 100%, 1);
        border-radius:50%;
        
    }
    .play-button {
        position: absolute;
        top: 0.5rem;
        z-index: auto;
    }
    .elem-name {
        position: absolute;
        top: 100px;
        font-size: 0.8rem;  
    }
`;

interface JsonElement {
    readonly name: string;
    readonly url: string;
}
export class Gui {
    private static _observer: IntersectionObserver;
    static getObseerver(): IntersectionObserver {
        if(Gui._observer == undefined){
            const options = {
                root: null, // ビューポートを基準にする
                rootMargin: '0px',
                threshold: 0.1 // 画像が10%見えたら発火
            };
            Gui._observer = new IntersectionObserver((entries, observer)=>{
                entries.forEach(entry => {
                    // 画像が画面内に入った場合
                    if (entry.isIntersecting) {
                        const div = entry.target as HTMLDivElement;
                        div.classList.add('hidden');
                        const img = div.querySelector('img') as HTMLImageElement;
                        // data-srcの値を本来のsrcに代入
                        if(img && img.dataset && img.dataset.src){
                            img.src = img.dataset.src;
                            img.onload = async () => {
                                if(img.width < img.height) {
                                    img.setAttribute('height', '100px');
                                    img.removeAttribute('width');              
                                }else{
                                    img.setAttribute('width', '100px');                
                                    img.removeAttribute('height');                
                                }
                                img.classList.add('loaded');
                                await Timer.wait(500);
                                div.classList.remove('hidden');
                            }
                        }else{
                            div.classList.remove('hidden');
                        }
                        // 一度処理したら監視を解除
                        div.classList.remove('lazy-load')
                        observer.unobserve(div);
                    }
                });
            },options)
        }
        return Gui._observer;
    }
    static createLayout() :void {

        const style = document.createElement('style');
        style.innerHTML = css;
        const head = document.getElementsByTagName('head');
        head[0].appendChild(style);
        
        const body = document.querySelector('body');
        const header = document.createElement('div');
        header.id = 'header';
        header.classList.add('header');
        header.classList.add('border');
        body?.appendChild(header);
        Gui.addHeaderControl();
        
        const container = document.createElement('div');
        container.classList.add('container');
        container.id = 'container';
        body?.appendChild(container);

        const containerInner = document.createElement('div');
        containerInner.classList.add('container_inner');
        containerInner.classList.add('fit');
        containerInner.id = 'containerInner';
        container.appendChild(containerInner);

    }
    static addHeaderControl(): void {
        const header = document.querySelector('#header');
        const typePullDiv = document.createElement('div');
        header?.appendChild(typePullDiv);
        typePullDiv.classList.add('typeDiv');
        //typePullDiv.classList.add('fit');
        const typePull = document.createElement('select') as HTMLSelectElement;
        typePull.id = 'typePull';
        typePull.addEventListener('change', (event: Event)=>{
            if(event.currentTarget){
                const containerInner = document.querySelector('#containerInner');
                containerInner?.querySelectorAll('div').forEach(div=>{
                    const parent = div.parentElement;
                    if(parent && parent.id == 'containerInner')
                        containerInner.removeChild(div);
                });
                const changeVal = (event.currentTarget as HTMLOptionElement).value;
                if(changeVal == '01'){
                    Gui.viewCostumes();                
                }else if(changeVal == '02'){
                    Gui.viewBackdrops();
                }else if(changeVal == '03'){
                    Gui.viewAudios();
                }
                Gui.lazyLoad();
            }
        });
        typePullDiv.appendChild(typePull);
        {
            const option = document.createElement('option') as HTMLOptionElement;
            option.value = '01';
            option.text = 'コスチューム';
            typePull.appendChild(option);            
        }
        {
            const option = document.createElement('option') as HTMLOptionElement;
            option.value = '02';
            option.text = '背景';
            typePull.appendChild(option);            
        }
        {
            const option = document.createElement('option') as HTMLOptionElement;
            option.value = '03';
            option.text = '音';
            typePull.appendChild(option);            
        }

    }
    static lazyLoad(): void {
        Gui.unLazyLoad();
        const lazyImages = document.querySelectorAll('.lazy-load');
        const observer = Gui.getObseerver();
        // 取得した画像をすべて監視対象にする
        lazyImages.forEach(div => {            
            observer.observe(div);
        });
    }
    static unLazyLoad(): void {
        const observer = Gui.getObseerver();
        const lazyImages = document.querySelectorAll('.lazy-load');
        lazyImages.forEach(div => {
            observer.unobserve(div);
        });

    }
    static viewFirst(): void {
        const typePull = document.querySelector('#typePull') as HTMLSelectElement;
        typePull.selectedIndex = 1; // Coustume;
        Gui.viewCostumes();

    }
    static viewAll(): void {
        Gui.viewCostumes();
        Gui.viewBackdrops();   
    }
    static viewCostumes(): void {
        for(const element of costumesJson) {
            Gui.addCostume(element);
        }
    }
    static addCostume(costume:JsonElement): void {
        const containerInner = document.querySelector('#containerInner');
        const elemDiv = document.createElement('div');
        containerInner?.appendChild(elemDiv);
        elemDiv.classList.add('element');
        elemDiv.classList.add('border');
        elemDiv.classList.add('lazy-load');
        const image = document.createElement('img') as HTMLImageElement;
        image.classList.add('thumbnail');
        image.src = loadingGif;
        image.setAttribute('data-src', costume.url);
        image.setAttribute('height', '100px');
        elemDiv.appendChild(image);
    }
    static viewBackdrops(): void {
        for(const element of backdropsJson) {
            Gui.addBackdrop(element);
        }
    }
    static addBackdrop(costume:JsonElement): void {
        const containerInner = document.querySelector('#containerInner');
        const elemDiv = document.createElement('div');
        containerInner?.appendChild(elemDiv);
        elemDiv.classList.add('element');
        elemDiv.classList.add('border');
        elemDiv.classList.add('lazy-load');
        const image = document.createElement('img') as HTMLImageElement;
        image.classList.add('thumbnail')
        image.src = loadingGif;
        image.setAttribute('data-src', costume.url);
        image.setAttribute('height', '100px');
        elemDiv.appendChild(image);
    }
    static async viewAudios(): Promise<void> {
        for(const element of soundsJson) {
            await Gui.addSound(element);
        }
        
    }
    static async addSound(sound: JsonElement): Promise<void> {
        const containerInner = document.querySelector('#containerInner');
        const elemDivOuter = document.createElement('div');
        elemDivOuter.classList.add('play-element');
        containerInner?.appendChild(elemDivOuter);
        const elemDiv = document.createElement('div');
        elemDivOuter.appendChild(elemDiv);
        elemDiv.classList.add('element');
        elemDiv.classList.add('border');
        elemDiv.classList.add('lazy-load');
        const image = document.createElement('img') as HTMLImageElement;
        image.src = SoundSvgData;
        image.setAttribute('height', '100px');
        elemDiv.appendChild(image);

        const control = document.createElement('div');
        elemDivOuter.appendChild(control);
        control.classList.add('play-button');
        const playMark = document.createElement('img') as HTMLImageElement;
        playMark.src = SoundPlayData;
        control.appendChild(playMark);
        playMark.setAttribute('width', '50%');
        control.addEventListener('mouseenter', ()=>{
            playMark.src = SoundStopData;
            sounder.play();
        });
        control.addEventListener('mouseleave', ()=>{
            playMark.src = SoundPlayData;
            sounder.stop();
        });
        const p = document.createElement('p') as HTMLParagraphElement;
        elemDivOuter.appendChild(p);
        p.classList.add('elem-name');
        p.innerText = sound.name;
        const sounder = new Sound(sound.url);
        await sounder.makeSoundPlayer();
    }

    static async convertToPCM(url:string): Promise<string> {
        const ctx = new AudioContext();
        const buf = await fetch(url).then(r => r.arrayBuffer());
        const decoded = await ctx.decodeAudioData(buf);

        const wav = audioBufferToWav(decoded);
        const blob = new Blob([wav], { type: "audio/wav" });
        return URL.createObjectURL(blob);
    }
}