import { Toast } from "./toast";
export const clipboard = async (text: string): Promise<void> => {
    const toast = Toast.getInstance();
    try {
        console.log(text);
        await navigator.clipboard.writeText(text);
        toast.show(`Copied. ${text}`);

    }catch(e){
        toast.show('コピー失敗');

    }

}