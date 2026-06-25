import { clipboard } from "./clipboard";
import { ClipboardSvg } from "./clipboardSvg";

export interface JsonElement {
    readonly name: string;
    readonly url: string;
}
const URL_VIEW_LENGTH = 70;

export const imageModal = (imageElement: JsonElement)=>{

            const modalOverlay = document.querySelector('#modalOverlayElem') as HTMLDivElement;
            const modalContentInner = modalOverlay.querySelector('#modalContentInnerElem') as HTMLDivElement;
            const _imageDiv = document.createElement('div') as HTMLDivElement;
            _imageDiv.classList.add('modalImageDiv')
            modalContentInner.appendChild(_imageDiv);
            const _imageDivInner = document.createElement('div') as HTMLDivElement;
            _imageDivInner.classList.add('modalImageDivInner');
            _imageDiv.appendChild(_imageDivInner);
            const _infoDiv = document.createElement('div') as HTMLDivElement;
            _infoDiv.classList.add('modalImageInfoDiv')
            modalContentInner.appendChild(_infoDiv);



            const _imageNameDiv = document.createElement('div') as HTMLDivElement;
            _imageNameDiv.style = 'font-size:1.2rem;text-align:left;';

            const _nameCopyButton = document.createElement('button') as HTMLButtonElement;
            _imageNameDiv.appendChild(_nameCopyButton);
            _nameCopyButton.classList.add('copyButton');
            const _imgName = document.createElement('img');
            _imgName.src = ClipboardSvg;

            _nameCopyButton.appendChild(_imgName);
            _nameCopyButton.innerHTML += '<span>Copy Name</s>';
            const _spanName = document.createElement('span');
            _spanName.classList.add('copy-name')
            _spanName.innerText = `${imageElement.name}`;
            _imageNameDiv.appendChild(_spanName);
            //_imageNameDiv.innerText = imageElement.name;

            _infoDiv.appendChild(_imageNameDiv);
            _infoDiv.classList.add('copyButtonInfo');
            _imageNameDiv.addEventListener('click', ()=>{
                clipboard(imageElement.name);
            }) 

            const _imageUrlDiv = document.createElement('div') as HTMLDivElement;
            _imageUrlDiv.style = 'margin-top:10px;';

            const _urlCopyButton = document.createElement('button') as HTMLButtonElement;
            _imageUrlDiv.appendChild(_urlCopyButton);
            _urlCopyButton.classList.add('copyButton');

            const _imgUrl = document.createElement('img');
            _imgUrl.src = ClipboardSvg;
            //_imgUrl.setAttribute('height', '15px');
            _urlCopyButton.appendChild(_imgUrl);
            _urlCopyButton.innerHTML += '<span>Copy URL&nbsp;</s>';
            const _spanUrl = document.createElement('span');
            _spanUrl.innerText = `${imageElement.url.slice(0, URL_VIEW_LENGTH)}.....`;
            _imageUrlDiv.appendChild(_spanUrl);
            _infoDiv.appendChild(_imageUrlDiv);
            _imageUrlDiv.addEventListener('click', ()=>{
                clipboard(imageElement.url);
            }) 

            //_imageUrlDiv.innerText = imageElement.url;
            _infoDiv.appendChild(_imageUrlDiv);

            const _image = document.createElement('img') as HTMLImageElement;
            _image.setAttribute('oncontextmenu', 'return false;');
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
}