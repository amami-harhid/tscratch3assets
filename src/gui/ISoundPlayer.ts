import type { IScratchSoundPlayer} from "./IAudioEngine";

/**
 * SoundPlayer
 */
export interface ISoundPlayer {
    /** 再生状態 */
    readonly isPlaying: boolean;
    /** Scratch SoundPlayer */
    readonly soundPlayer: IScratchSoundPlayer;
    /** 接続 */
    connect(): void;
    /** 再生 */
    play(): void;
    /** 再生して終わるまで待つ */
    startSoundUntilDone(): Promise<void>;
    /** 停止する */
    stop(): void;
    /** 即時に停止する */
    stopImmediately(): void;
}