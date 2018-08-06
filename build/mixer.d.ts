export interface IMixer {
    mix(rawImg: any, chanData: Uint8Array[]): Uint8ClampedArray;
}
export declare const RGBAMix: IMixer;
