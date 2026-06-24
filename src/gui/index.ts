import costumesJson from '../assetJsons/costumes.json';
import backdropsJson from '../assetJsons/backdrops.json';
import soundsJson from '../assetJsons/sounrds.json';
import { SoundSvgData } from './soundSvg';
import { SoundPlayData, SoundStopData } from './soundSvg';
import audioBufferToWav from 'audiobuffer-to-wav';

import { loadingGif } from './loadingGif';
import { Timer } from './timer';
import { Sound } from './sound';
import { license } from './license';
import { clipboard } from './clipboard';

declare global {
  interface Window {
    webkitAudioContext?: typeof AudioContext;
  }
}
const TITLE = 'Scratch3 アセット一覧';
const APP = '説明';
const css = `
    html, body {
        height: 100%;
        overflow: hidden;
        scrollbar-gutter: stable; /* .containerスクロールバー表示幅によるレイアウト崩れを防止する */
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
    div.header > div {
        margin-left: 10px;
    }
    div.typeDiv {
        display: flex;
        padding-left:clamp(1vw, 2vw, 2vw);
        align-items: center;
    }
    .pullDown {
        border: none; /*1px solid black;*/    
    }
    .radius10 {
        border-radius: 5px;    
    }
    .license {
        border: none; /*1px solid black;*/
        width: 6rem;
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
        overflow-y: auto;
        scrollbar-gutter: stable; /* スクロールバー表示幅によるレイアウト崩れを防止する */
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
        padding-bottom: 20px;
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
        top: 115px;
        font-size: 0.8rem;  
    }
    #modalOverlay, #modalOverlayElem {
        display: none;               /* JS で display:block にして表示 */
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.5); /* 半透明の黒背景 */
        justify-content: center;
        align-items: center;
    }

    /* モーダル本体 */
    #modalContent, #modalContentElem {
        background: #fff;
        padding: 20px;
        border-radius: 8px;
        width: fit-content;
        height:50%;
        overflow:auto;
        text-align: center;
        box-shadow: 0 0 10px rgba(0,0,0,0.3);
    }
    #modalContentInner, #modalContentInnerElem {
        position: relative;
        width: 100%;
        text-align: center;
        font-size: 0.8rem; 
    }
    div.modalImageDiv {
        display: flex;
        width: 100%;
        height: 180px;
        justify-content: center;
        align-items: center;
        font-size: 0.8rem;  
    }
    div.modalImageDivInner {
        display: flex;
        width: 180px;
        justify-content: center;
        align-items: center;
        border-radius: 8px;
        border: 1px solid #505050;
    }
    .modalImageInfoDiv {
        text-align: center;
        
    }
    .modalImageInfoDiv > div {
        overflow-wrap: anywhere;
        margin-right: 20px;
    }
    .responsive-text {
        font-size: clamp(10px, 2.0vw, 20px);
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

        // モーダル
        if(body){
            const modalOverlay = document.createElement('div') as HTMLDivElement;
            body.appendChild(modalOverlay);
            modalOverlay.id = 'modalOverlay';
            const modalContent = document.createElement('div') as HTMLDivElement;
            modalOverlay.appendChild(modalContent);
            modalContent.id = 'modalContent';
            const modalTitle = document.createElement('div') as HTMLParagraphElement;
            modalContent.appendChild(modalTitle);
            modalTitle.innerHTML = '<h1>Scratch3に関わるライセンス(License)</h1>';
            modalOverlay.addEventListener('click', (event:Event)=>{
                if(event.target === modalOverlay){
                    modalOverlay.style.display = 'none';
                }
            });
            const modalContentInner = document.createElement('div') as HTMLDivElement;
            modalContentInner.id = 'modalContentInner';
            modalContent.appendChild(modalContentInner);
            license(modalContentInner);
        }
        // モーダル２
        if(body){
            const modalOverlay = document.createElement('div') as HTMLDivElement;
            body.appendChild(modalOverlay);
            modalOverlay.id = 'modalOverlayElem';
            const modalContent = document.createElement('div') as HTMLDivElement;
            modalOverlay.appendChild(modalContent);
            modalContent.id = 'modalContentElem';
            const modalTitle = document.createElement('div') as HTMLParagraphElement;
            modalContent.appendChild(modalTitle);
            modalTitle.innerHTML = '<h1>アセット情報</h1>';
            modalOverlay.addEventListener('click', (event:Event)=>{
                if(event.target === modalOverlay){
                    modalOverlay.style.display = 'none';
                    const _modalContentInner = document.querySelector('#modalContentInnerElem') as HTMLDivElement;
                    _modalContentInner?.querySelectorAll('div').forEach(div=>{
                        const parent = div.parentElement;
                        if(parent && parent.id == 'modalContentInnerElem')
                            _modalContentInner.removeChild(div);
                    });
                }
            });
            const modalContentInner = document.createElement('div') as HTMLDivElement;
            modalContentInner.id = 'modalContentInnerElem';
            modalContent.appendChild(modalContentInner);
        }

    }
    static addHeaderControl(): void {
        const header = document.querySelector('#header');
        const pageTitle = document.createElement('p') as HTMLParagraphElement;
        pageTitle.innerHTML = `<p style="margin-left:10px;" class="responsive-text">${TITLE}</p>`;
        header?.appendChild(pageTitle);
        const typePullDiv = document.createElement('div');
        header?.appendChild(typePullDiv);
        typePullDiv.classList.add('typeDiv');
        //typePullDiv.classList.add('fit');
        const typePull = document.createElement('select') as HTMLSelectElement;
        typePull.classList.add('responsive-text');
        typePull.classList.add('pullDown');
        typePull.classList.add('radius10');
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

        const licenseDiv = document.createElement('div') as HTMLDivElement;
        header?.appendChild(licenseDiv);
        const licenseButton = document.createElement('button') as HTMLButtonElement;
        licenseButton.classList.add('responsive-text');
        licenseButton.classList.add('license');
        licenseButton.classList.add('radius10');
        licenseButton.innerText = `${APP}`;
        licenseDiv.appendChild(licenseButton);
        licenseButton.addEventListener('click', ()=>{
            const modalOverlay = document.querySelector('#modalOverlay') as HTMLDivElement;
            if(modalOverlay)
                modalOverlay.style.display = 'flex';
        });


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
        typePull.selectedIndex = 0; // Coustume;
        Gui.viewCostumes();

    }
    static viewAll(): void {
        Gui.viewCostumes();
        Gui.viewBackdrops();   
    }
    static viewCostumes(): void {
        for(const element of costumesJson) {
            Gui.addImageElement(element);
        }
    }
    static addImageElement(imageElement:JsonElement): void {
        const containerInner = document.querySelector('#containerInner');
        const elemDivOuter = document.createElement('div');
        elemDivOuter.classList.add('play-element');
        containerInner?.appendChild(elemDivOuter);
        const elemDiv = document.createElement('div');
        elemDivOuter?.appendChild(elemDiv);
        elemDiv.classList.add('element');
        elemDiv.classList.add('border');
        elemDiv.classList.add('lazy-load');
        const image = document.createElement('img') as HTMLImageElement;
        image.classList.add('thumbnail');
        image.src = loadingGif;
        image.setAttribute('data-src', imageElement.url);
        image.setAttribute('height', '100px');
        elemDiv.appendChild(image);
        const p = document.createElement('p') as HTMLParagraphElement;
        elemDivOuter.appendChild(p);
        p.classList.add('elem-name');
        p.innerText = imageElement.name;

        elemDiv.addEventListener('click', ()=>{
            const modalOverlay = document.querySelector('#modalOverlayElem') as HTMLDivElement;
            const modalContentInner = modalOverlay.querySelector('#modalContentInnerElem') as HTMLDivElement;
            const _imageDiv = document.createElement('div') as HTMLDivElement;
            _imageDiv.classList.add('modalImageDiv')
            modalContentInner.appendChild(_imageDiv);
            const _imageDivInner = document.createElement('div') as HTMLDivElement;
            _imageDivInner.classList.add('modalImageDivInner');
            _imageDiv.appendChild(_imageDivInner);
            const _imageInfoDiv = document.createElement('div') as HTMLDivElement;
            _imageInfoDiv.classList.add('modalImageInfoDiv')
            modalContentInner.appendChild(_imageInfoDiv);
            //_imageInfoDiv.innerHTML = `<span style='font-size:1.2rem;'>Name</span><span>${costume.name}</span><br/><span style='font-size:1.2rem;'>URL</span><span>${costume.url}</span>`;
            // const _nameButton = document.createElement('button') as HTMLButtonElement;
            // _nameButton.innerText = 'Copy→';
            // _imageInfoDiv.appendChild(_nameButton);
            // _nameButton.style = 'font-size:0.8rem;margin-right:10px;';
            const _nameValueDiv = document.createElement('div') as HTMLDivElement;
            _nameValueDiv.style = 'font-size:1.2rem;';
            _nameValueDiv.innerText = imageElement.name;
            _imageInfoDiv.appendChild(_nameValueDiv);
            _nameValueDiv.addEventListener('click', ()=>{
                clipboard(imageElement.name);
            }) 

            // const _br = document.createElement('br');
            // _imageInfoDiv.appendChild(_br);
            // const _urlButton = document.createElement('button') as HTMLButtonElement;
            // _urlButton.innerText = 'Copy→';
            // _urlButton.style = 'font-size:0.8rem;margin-right:10px;';
            // _imageInfoDiv.appendChild(_urlButton);
            const _urlValueDiv = document.createElement('div') as HTMLDivElement;
            _urlValueDiv.style = 'margin-top:10px;';
            _urlValueDiv.addEventListener('click', ()=>{
                clipboard(imageElement.url);
            }) 
            _urlValueDiv.innerText = imageElement.url;
            _imageInfoDiv.appendChild(_urlValueDiv);

            const _image = document.createElement('img') as HTMLImageElement;
            _image.onload = ()=>{
                if(_image.width < _image.height){
                    _image.setAttribute('height', '150px');
                }else{
                    _image.setAttribute('width', '150px');
                }
            }
            _image.src = imageElement.url;
            _imageDivInner.appendChild(_image);  
            
            if(modalOverlay)
                modalOverlay.style.display = 'flex';
        })
    }
    static viewBackdrops(): void {
        for(const element of backdropsJson) {
            Gui.addImageElement(element);
        }
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

        elemDiv.addEventListener('click', ()=>{
            const modalOverlay = document.querySelector('#modalOverlayElem') as HTMLDivElement;
            const modalContentInner = modalOverlay.querySelector('#modalContentInnerElem') as HTMLDivElement;
            const _soundDiv = document.createElement('div') as HTMLDivElement;
            _soundDiv.classList.add('modalImageDiv')
            modalContentInner.appendChild(_soundDiv);
            const _soundDivInner = document.createElement('div');
            _soundDivInner.classList.add('modalImageDivInner')
            _soundDiv.appendChild(_soundDivInner);
            const _soundInfoDiv = document.createElement('div') as HTMLDivElement;
            _soundInfoDiv.classList.add('modalImageInfoDiv');
            modalContentInner.appendChild(_soundInfoDiv);
            //_soundInfoDiv.innerHTML = `<span style='font-size:1.2rem;'>Name</span><span>${sound.name}</span><br/><span style='font-size:1.2rem;'>URL</span><span>${sound.url}</span>`;

            const _soundName = document.createElement('div') as HTMLDivElement;
            _soundName.style = 'font-size:1.2rem;';
            _soundName.innerText = sound.name;
            _soundInfoDiv.appendChild(_soundName);
            _soundName.addEventListener('click',()=>{
                clipboard(sound.name);
            });
            const _soundUrl = document.createElement('div') as HTMLDivElement;
            _soundUrl.style = 'margin-top:10px;';
            _soundUrl.innerText = sound.url;
            _soundInfoDiv.appendChild(_soundUrl);
            _soundUrl.addEventListener('click',()=>{
                clipboard(sound.url);
            });
            const _image = document.createElement('img') as HTMLImageElement;
            _image.src = SoundSvgData;
            _image.setAttribute('height', '150px');
            _soundDivInner.appendChild(_image);  
            _image.addEventListener('mouseenter', ()=>{
                sounder.play();
            });
            _image.addEventListener('mouseleave', ()=>{
                sounder.stop();
            })
            if(modalOverlay)
                modalOverlay.style.display = 'flex';



        });
        
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