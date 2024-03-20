import { cp, mkdir, rmdirSync } from "fs";
import { readdir } from "fs/promises";
import path from "path";
import { clientImportReplacer } from "./client-import-replacer";

const tempFolderPath = "temp";
mkdir("./" + tempFolderPath, { recursive: true }, (err) => {});
rmdirSync("./app", { recursive: true });
mkdir("./app", { recursive: true }, (err) => {});

const entrypoints: string[] = [];

type File = {
  path: string;
  isClient: boolean;
  isPage: boolean;
};

const entryFiles: File[] = [];
const clientEntryFiles: Map<string, File> = new Map();

const readFolderAndCheck = async (dir: string) => {
  dir = "./" + dir;
  const files = await readdir(dir);

  for (let file of files) {
    if (path.extname(file) === ".js") {
      continue;
    }
    if (path.extname(file) === ".purs") {
      const fullPath = path.join(dir, file);
      const text = await Bun.file(fullPath).text();
      const isClient = text.includes("-- use client");
      const isPage =
        fullPath.endsWith("Page.purs") || fullPath.endsWith("Layout.purs");

      const entry = {
        path: fullPath.replace("src/", "").replace(".purs", ""),
        isClient,
        isPage,
      };

      if (entry.isClient) {
        clientEntryFiles.set(entry.path, entry);
      }

      if (entry.isPage) {
        entryFiles.push(entry);
      }
    } else {
      await readFolderAndCheck(path.join(dir, file));
    }
  }
};

const generateTempPath = (chunks: string[]) => {
  let cs = chunks.slice(0, -1);

  if (chunks[0] === "app") {
    cs = cs.slice(1);
  }

  return `${tempFolderPath}/${cs.length ? cs.join("/") : ""}`;
};

const readAndCheckJs = async (dir: string) => {
  const files = await readdir(dir);

  for (let file of files) {
    if (path.extname(file) === ".jsx") {
      const fullPath = path.join(dir, file);
      entrypoints.push(fullPath);
    }

    if (!path.extname(file)) {
      await readAndCheckJs(path.join(dir, file));
    }
  }
};

const markUseClient = async (dir: string) => {
  const files = await readdir(dir);

  for (let f of files) {
    if (path.extname(f) === ".jsx") {
      const fullPath = path.join(dir, f);
      let file = await Bun.file(fullPath).text();

      if (fullPath.includes("temp/layout.jsx")) {
        file = `import '@/globals.css';\n` + file;
      }

      // if (f.includes("chunk")) {
      //   file = file.replace("~/chunk-", "~/chunks/chunk-");
      //   await Bun.write(fullPath, file);
      //   continue;
      // }

      file = file.replaceAll("/temp/", "/app/");

      await Bun.write(fullPath, file);
    }
    if (!path.extname(f)) {
      await markUseClient(path.join(dir, f));
    }
  }
};

const modifyMainFiles = async () => {
  for (let { path } of entryFiles) {
    let file = await Bun.file(
      `./output-es/${path.replaceAll("/", ".")}/index.js`,
    ).text();

    file = file.replaceAll("../", import.meta.dir + "/output-es/");

    for (let path of Array.from(clientEntryFiles.keys())) {
      file = await clientImportReplacer(file, path);
    }

    const outdirChunks = path.toLowerCase().split("/");
    const outdir = "./" + generateTempPath(outdirChunks);

    await Bun.write(
      `${outdir}/${outdirChunks[outdirChunks.length - 1]}.jsx`,
      file,
    );
  }
};

const modifyClientFiles = async () => {
  Array.from(clientEntryFiles.keys()).forEach(async (path) => {
    let file = await Bun.file(
      `./output-es/${path.replaceAll("/", ".")}/index.js`,
    ).text();
    file = `'use client';\n` + file;
    file = file.replaceAll("../", import.meta.dir + "/output-es/");

    const chunks = path.toLowerCase().split("/");

    file = file.replaceAll(
      `output-es/${path.replaceAll("/", ".")}/index.js`,
      generateTempPath(chunks) + `/${chunks[chunks.length - 1]}.js`,
    );

    await Bun.write(
      `./${generateTempPath(chunks)}/${chunks[chunks.length - 1]}.jsx`,
      file,
    );
  });
};

const main = async () => {
  await readFolderAndCheck("src");
  await modifyClientFiles();
  await modifyMainFiles();
  await readAndCheckJs(tempFolderPath);

  // const res = await Bun.build({
  //   entrypoints,
  //   outdir: "./app",
  //   splitting: false,
  //   naming: {
  //     asset: "[dir]/[name].[ext]",
  //     chunk: "chunks/[name]-[hash].[ext]",
  //   },
  //   external: ["react", "react-dom"],
  // });

  await markUseClient("./temp");
  await cp("./temp", "./app", { recursive: true }, (err) => {
    /* callback */
  });
  // rmdirSync(tempFolderPath, { recursive: true });
};

main();
