import { PSDAdapter } from "./PSDAdapter";
import { loadRemoteFile } from "psdetch-utils/build/loadRemoteFile";
import { IPixelLayer, IFolderLayer, IVectorLayer } from "psdetch-core";
describe("PSDAdapter", () => {
  const adapter = new PSDAdapter();
  it("should match with psd file", () => {
    expect(adapter.checkFileMeta({
      name: "file.psd",
      mime: "",
    })).toBe(true);
  });
  describe(`"PSD File: "base/testAssets/concept.psd"`, () => {
    async function decodeProject() {
      const f = await loadRemoteFile({ url: "base/testAssets/concept.psd" }).toPromise();
      if (f) {
        const project = await adapter.decodeProject(f);
        return project;
      }
    }
    async function getPages() {
      const project = await decodeProject();
      if (project) {
        return project.getPages();
      }
    }
    async function getLayers() {
      const pages = await getPages();
      if (pages) {
        return pages[0].getLayers();
      }
    }
    it("should decode a psd file", async () => {
      const project = await decodeProject();
      if (project) {
        expect(project.name).toEqual("concept.psd");
      } else {
        fail("Project is undefiend");
      }
    });
    it("should get pages from a project", async () => {
      const page = await getPages();
      if (page) {
        expect(page.length).toEqual(1);
        expect(page[0].name).toBe("concept.psd");
        expect(page[0].width).toBe(1024);
        expect(page[0].height).toBe(768);
      } else {
        fail("Page returned as undefined");
      }
    });
    it("should get preview", async () => {
      const page = await getPages();
      if (page) {
        const img = await page[0].getPreview(1);
        expect(img).toBeDefined();
      }
    });
    it("should get layers", async () => {
      const page = await getPages();
      if (page) {
        const layers = await page[0].getLayers();
        expect(layers.length).toBe(9);
        // console.log(layers);
        // expect(img).toBeDefined();
      }
    });
    it("should get img from pixel layers", async () => {
      const layers = await getLayers();
      if (layers) {
        const pixelLayer = layers[7];
        expect(await (pixelLayer as IPixelLayer).getPixelImg()).toBeDefined();
      }
    });
    it("should get svgString from vector layers", async () => {
      const layers = await getLayers();
      if (layers) {
        const vectorLayer = (await (layers[5] as IFolderLayer).children())[0];
        expect(await (vectorLayer as IVectorLayer).getSvgString()).toBeDefined();
      }
    });
  });
  describe(`"PSD File: "base/testAssets/login.psd"`, () => {
    async function decodeProject() {
      const f = await loadRemoteFile({ url: "base/testAssets/login.psd" }).toPromise();
      if (f) {
        const project = await adapter.decodeProject(f);
        return project;
      }
    }
    async function getPages() {
      const project = await decodeProject();
      if (project) {
        return project.getPages();
      }
    }
    async function getLayers() {
      const pages = await getPages();
      if (pages) {
        return pages[0].getLayers();
      }
    }
    it("should decode a psd file", async () => {
      const project = await decodeProject();
      if (project) {
        expect(project.name).toEqual("login.psd");
      } else {
        fail("Project is undefiend");
      }
    });
    it("should get pages from a project", async () => {
      const page = await getPages();
      if (page) {
        expect(page.length).toEqual(2);
        expect(page[0].name).toBe("Input");
        expect(page[0].width).toBe(1440);
        expect(page[0].height).toBe(2560);
      } else {
        fail("Page returned as undefined");
      }
    });
    it("should get preview", async () => {
      const page = await getPages();
      if (page) {
        const img = await page[0].getPreview(1);
        expect(img).toBeDefined();
      }
    });
    it("should get layers", async () => {
      const page = await getPages();
      if (page) {
        const layers = await page[0].getLayers();
        expect(layers.length).toBe(10);
        // console.log(layers);
        // expect(img).toBeDefined();
      }
    });
  });
});
