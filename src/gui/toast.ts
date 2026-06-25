const toastCss = `
  #toast-container {
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 9999;
    display: flex;
    flex-direction: column;
    gap: 10px;
    font-size:12px;
  }

  /* 個々の Toast */
  .toast {
    min-width: 220px;
    padding: 12px 18px;
    background: #333;
    color: #fff;
    border-radius: 6px;
    opacity: 0;
    transform: translateY(-10px);
    transition: opacity 0.3s, transform 0.3s;
  }

  /* 表示アニメーション */
  .toast.show {
    opacity: 1;
    transform: translateY(0);
  }    
`;

export class Toast {
    private static instance: Toast;
    public static getInstance(): Toast {
        if(Toast.instance == undefined) {
            Toast.instance = new Toast();
            Toast.instance.insertCss();
        }
        return Toast.instance;
    } 
    private insertCss() {
        const style = document.createElement('style');
        style.innerHTML = toastCss;
        const head = document.getElementsByTagName('head');
        head[0].appendChild(style);
    }
    show (message:string, duration:number = 3000) {
        showToast(message, duration);
    }

}

const showToast = (message:string, duration:number = 3000): void =>{
    let container = document.querySelector("#toast-container");
    if(container==undefined){
        container = document.createElement('div');
        container.id = 'toast-container';
        const body = document.querySelector('body');
        body?.appendChild(container);
    }
    const toast = document.createElement("div");
    toast.className = "toast";
    toast.textContent = message;
    container?.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add("show"));
    setTimeout(() => {
        toast.classList.remove("show");
        setTimeout(() => {
            toast.remove();
        },300);
    }, duration );
}