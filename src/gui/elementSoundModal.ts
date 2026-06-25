import { clipboard } from "./clipboard";
import { ClipboardSvg } from "./clipboardSvg";
import { Sound } from "./sound";
import { SoundPlayData, SoundSvgData } from "./soundSvg";

export interface JsonElement {
    readonly name: string;
    readonly url: string;
}
const URL_VIEW_LENGTH = 70;

export const soundModal = (sound: JsonElement, sounder: Sound)=>{

            const modalOverlay = document.querySelector('#modalOverlayElem') as HTMLDivElement;
            const modalContentInner = modalOverlay.querySelector('#modalContentInnerElem') as HTMLDivElement;
            const _soundDiv = document.createElement('div') as HTMLDivElement;
            _soundDiv.classList.add('modalImageDiv');
            modalContentInner.appendChild(_soundDiv);
            const _soundDivInner = document.createElement('div');
            _soundDivInner.classList.add('modalImageDivInner')
            _soundDivInner.style = 'position:relative;height:180px;';
            _soundDiv.appendChild(_soundDivInner);
            const _infoDiv = document.createElement('div') as HTMLDivElement;
            _infoDiv.classList.add('modalImageInfoDiv');
            modalContentInner.appendChild(_infoDiv);

            const _soundNameDiv = document.createElement('div') as HTMLDivElement;
            _soundNameDiv.style = 'font-size:1.2rem;text-align:left;';

            const _nameCopyButton = document.createElement('button') as HTMLButtonElement;
            _soundNameDiv.appendChild(_nameCopyButton);
            _nameCopyButton.classList.add('copyButton');
            const _imgName = document.createElement('img');
            _imgName.src = ClipboardSvg;

            _nameCopyButton.appendChild(_imgName);
            _nameCopyButton.innerHTML += '<span>Copy Name</s>';
            const _spanName = document.createElement('span');
            _spanName.classList.add('copy-name')
            _spanName.innerText = `${sound.name}`;
            _soundNameDiv.appendChild(_spanName);
            
            _infoDiv.appendChild(_soundNameDiv);
            _infoDiv.classList.add('copyButtonInfo');
            _soundNameDiv.addEventListener('click',()=>{
                clipboard(sound.name);
            });

            const _soundUrlDiv = document.createElement('div') as HTMLDivElement;
            _soundUrlDiv.style = 'margin-top:10px;';
            const _urlCopyButton = document.createElement('button') as HTMLButtonElement;
            _soundUrlDiv.appendChild(_urlCopyButton);
            _urlCopyButton.classList.add('copyButton');

            const _imgUrl = document.createElement('img');
            _imgUrl.src = ClipboardSvg;
            //_imgUrl.setAttribute('height', '15px');
            _urlCopyButton.appendChild(_imgUrl);
            _urlCopyButton.innerHTML += '<span>Copy URL</s>';
            const _spanUrl = document.createElement('span');
            _spanUrl.innerText = `${sound.url.slice(0, URL_VIEW_LENGTH)}.....`;
            _soundUrlDiv.appendChild(_spanUrl);
            _infoDiv.appendChild(_soundUrlDiv);
            _soundUrlDiv.addEventListener('click',()=>{
                clipboard(sound.url);
            });
            const _image = document.createElement('img') as HTMLImageElement;
            _image.classList.add('soundImage');
            _image.setAttribute('oncontextmenu', 'return false;');

            _image.src = SoundSvgData;
            _image.setAttribute('height', '150px');
            _soundDivInner.appendChild(_image);  
            const _control = document.createElement('div');
            _control.classList.add('play-button');
            _soundDivInner.appendChild(_control);
            _control.style = 'position:absolute; top:2px;';
            const _playMark = document.createElement('img') as HTMLImageElement;
            _playMark.setAttribute('width', '50%');
            _control.appendChild(_playMark);
            _playMark.src = SoundPlayData;
            _control.addEventListener('mouseenter', ()=>{
                sounder.play();
            });
            _control.addEventListener('mouseleave', ()=>{
                sounder.stop();
            })
            if(modalOverlay)
                modalOverlay.style.display = 'flex';
}