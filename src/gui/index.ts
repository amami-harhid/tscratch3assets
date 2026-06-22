const css = `
    html, body {
        height: 100%;
    }
    .border {
        border: 1px solid black;
        border-radius: 10px;
    }
    .header {
        position: relative;
        display: flex;
        margin: 0 auto;
        height:50px;
        width:100%;
        background-color:#fea0a0;
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

`;

interface JsonElement {
    readonly url: string;
}
export class Gui {

    static createLayout() :void {

        const style = document.createElement('style');
        style.innerHTML = css;
        const head = document.getElementsByTagName('head');
        head[0].appendChild(style);
        
        const body = document.querySelector('body');
        const header = document.createElement('div');
        header.classList.add('header');
        header.classList.add('border');
        body?.appendChild(header);
        
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

    static addCostume(costume:JsonElement): void {
        const containerInner = document.querySelector('#containerInner');
        const elemDiv = document.createElement('div');
        containerInner?.appendChild(elemDiv);
        elemDiv.classList.add('element');
        elemDiv.classList.add('border');
        const image = document.createElement('img') as HTMLImageElement;
        image.classList.add('thumbnail')
        image.src = costume.url;
        image.onload = () =>{
            if(image.width < image.height) {
                image.setAttribute('height', '100px');
            }else{
                image.setAttribute('width', '100px');                
            }
            elemDiv.appendChild(image);
        }        
    }
}