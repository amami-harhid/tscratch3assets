/**
 * Audio Context
 */
export interface IAudioContext {
    /**
     * 前回中断/一時停止した音声コンテキストの時間の進行を再開します
     */
    resume(): void;
    /**
     * 一時的に音声ハードウェアアクセスを停止します。
     */
    suspend(): void;
}