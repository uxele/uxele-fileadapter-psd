import * as core from "psdetch-core";
import * as path from "path";
import { artboardPsd } from "./artboardPsd";
import { singlePagePsd } from "./singlePagePsd";
import { IProject, IPage } from "psdetch-core";
import "./vendor/psd.min.js";
const psdLib = (window as any)["require"]("psd");
export class PSDAdapter implements core.IFileAdapter {
  private decodePages(projectRaw: any, fileName: string): IPage[] {
    const tree = projectRaw.tree();
    const children = tree.children();
    let useArtboard = false;
    children.forEach((c: any) => {
      if (c.layer.artboard) {
        useArtboard = true;
      }
    });
    if (useArtboard) {
      return artboardPsd(projectRaw);
    } else {
      return singlePagePsd(projectRaw, fileName);
    }
  }

  acceptExtensions: string[] = [".psd", ".psb"];
  fileTypeName: string = "Adobe Photoshop";
  async decodeProject(designFile: core.IFileBlob): Promise<IProject> {
    const file = designFile.file;
    designFile.meta.mime = file.type;
    const p = await psdLib.fromDroppedFile(file);
    // parsedFiles[designFile.id] = p;
    let pages: IPage[];
    return {
      name: designFile.meta.name,
      fileMeta: designFile.meta,
      getPages: () => {
        if (!pages) {
          pages = this.decodePages(p, designFile.meta.name);
        }
        return Promise.resolve(pages);
      },
    };
  }
  checkFileMeta(meta: core.IFileMeta): boolean {
    const name = meta.name;
    const mime = meta.mime;
    if (mime.toLowerCase().indexOf("photoshop") > -1 || this.acceptExtensions.indexOf(path.extname(name).toLowerCase()) > -1) {
      return true;
    }
    return false;
  }
}
