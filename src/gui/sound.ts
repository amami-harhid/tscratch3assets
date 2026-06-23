import { default as AudioEngine} from 'scratch-audio';
import type { IAudioEngine, TSoundPlayerOption } from './IAudioEngine';
import type { ISoundPlayer } from './ISoundPlayer';
import { SoundPlayer } from './soundPlayer';
export class Sound {

    private static _audioEngine: IAudioEngine;
    private _soundPlayer!: ISoundPlayer;
    private _url:string;
    private _data!:Uint8Array<ArrayBuffer>;
    constructor(url: string) {
        if(Sound._audioEngine == undefined){
            Sound._audioEngine = new AudioEngine();
        } 
        this._url = url;
    }
    private async load() : Promise<Uint8Array<ArrayBuffer>> {
        return new Promise<Uint8Array<ArrayBuffer>>(async resolve=>{
            let responce = await fetch(this._url);
            let buffer = await responce.arrayBuffer();
            let data =  new Uint8Array(buffer);
            this._data = data;
            resolve(data);
        });
    }
    async makeSoundPlayer() : Promise<ISoundPlayer> {
        await this.load();
        const decodeSoundPlayer = await Sound._audioEngine.decodeSoundPlayer({data: this._data});
        const _effects = Sound._audioEngine.createEffectChain();
        const options: TSoundPlayerOption = {};
        options.effects = _effects;
        const soundPlayer = new SoundPlayer(decodeSoundPlayer, options);
        this._soundPlayer = soundPlayer;
        soundPlayer.connect(); 
        return soundPlayer as ISoundPlayer;    
    }
    play() : void {
        this._soundPlayer.play();
    }
    stop() : void {
        this._soundPlayer.stop();
    }

}