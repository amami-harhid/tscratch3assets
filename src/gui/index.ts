const css = `
    html, body {
        height: 100%;
    }
    .border {
        border: 2px solid black;
        border-radius: 20px;
    }
    .header {
        position: relative;
        display: flex;
        margin: 0 auto;
        height:50px;
        width:95%;
        background-color:#fea0a0;
    }
    .container {
        position: relative;
        margin: 0 auto;
        top: 50;
        width:95%;
        height:50%;

        flex-wrap: wrap;
        gap: 10px;
        opacity: 0.9;
        background-color:#fefefe;
    }

`;


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
        container.classList.add('border');
        body?.appendChild(container);


    }


}