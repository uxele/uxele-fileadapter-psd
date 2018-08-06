import * as core from "psdetch-core";
import { IProject } from "psdetch-core";
import "./vendor/psd.min.js";
export declare class PSDAdapter implements core.IFileAdapter {
    private decodePages;
    acceptExtensions: string[];
    fileTypeName: string;
    decodeProject(designFile: core.IFileBlob): Promise<IProject>;
    checkFileMeta(meta: core.IFileMeta): boolean;
}
