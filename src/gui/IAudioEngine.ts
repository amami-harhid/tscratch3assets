/**
 * IAudioEngin
 */
import {EventEmitter} from 'events';
import type { IAudioContext } from './IAudioContext';
export interface IAudioEngine {
    /** Effectチェーンを生成する */
    createEffectChain(): TEffectChain;
    /** SoundPlayer をデコードする */
    decodeSoundPlayer(sound: {data: Uint8Array<ArrayBuffer>}): Promise<IScratchSoundPlayer>;
    /** Audioコンテキスト */
    readonly audioContext : IAudioContext;
}
export interface IScratchSoundPlayer extends EventEmitter {
    name: string;
    connect(effect:TEffectChain): void;
    finished(): Promise<void>;
    isPlaying: boolean;
    play(): void;
    setPlaybackRate(pitch:number): void;
    stop():void;
    stopImmediately():void;
    update(): void;
}
export type TSoundPlayerOption = {
    effects?: TEffectChain;
    volume?: number,
    pitch?: number,
}
export type TEffectChain = {
    volume?: IScratchSoundPlayer,
    pitch?: IScratchSoundPlayer,
    /**
     * Set an effect value by its name.
     * @param effect {string}
     * @param value {number}
     */
    set?(effect:string, value:number): void;
}