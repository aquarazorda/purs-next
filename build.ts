import { mkdir, rmdirSync } from "fs";
import { readdir } from "fs/promises";
import path from "path";

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

const readFolderAndCheck = async (dir: string) => {
  dir = "./" + dir;
  const files = await readdir(dir);

  for (let file of files) {
    if (path.extname(file) === ".purs") {
      const fullPath = path.join(dir, file);
      const text = await Bun.file(fullPath).text();
      const isClient = text.includes("useClient");
      const isPage =
        fullPath.endsWith("Page.purs") || fullPath.endsWith("Layout.purs");

      const entry = {
        path: fullPath.replace("src/", "").replace(".purs", ""),
        isClient,
        isPage,
      };

      if (entry.isClient || entry.isPage) {
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
    if (path.extname(file) === ".js") {
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
    if (path.extname(f) === ".js") {
      const fullPath = path.join(dir, f);
      let file = await Bun.file(fullPath).text();

      if (fullPath.includes("app/layout.js")) {
        file = `import '@/globals.css';\n` + file;
      }

      // if (f.includes("chunk")) {
      //   file = file.replace("~/chunk-", "~/chunks/chunk-");
      //   await Bun.write(fullPath, file);
      //   continue;
      // }

      if (file.includes("useClient")) {
        file = `'use client'\n` + file;
      }

      await Bun.write(fullPath, file);
    }
    if (!path.extname(f)) {
      await markUseClient(path.join(dir, f));
    }
  }
};

const main = async () => {
  await readFolderAndCheck("src");

  for (let { path, isClient, isPage } of entryFiles) {
    let file = await Bun.file(
      `./output/${path.replaceAll("/", ".")}/index.js`,
    ).text();

    file = file.replaceAll("../", import.meta.dir + "/output/");

    const outdirChunks = path.toLowerCase().split("/");
    const outdir = "./" + generateTempPath(outdirChunks);

    const clientFiles = entryFiles.filter((f) => f.isClient);

    clientFiles.forEach(({ path }) => {
      const chunks = path.toLowerCase().split("/");

      file = file.replaceAll(
        `output/${path.replaceAll("/", ".")}/index.js`,
        generateTempPath(chunks) + `/${chunks[chunks.length - 1]}.js`,
      );
    });

    await Bun.write(
      `${outdir}/${outdirChunks[outdirChunks.length - 1]}.js`,
      file,
    );
  }

  await readAndCheckJs(tempFolderPath);

  const res = await Bun.build({
    entrypoints,
    outdir: "./app",
    splitting: true,
    naming: {
      asset: "[dir]/[name].[ext]",
      chunk: "chunks/[name]-[hash].[ext]",
    },
    external: ["react", "react-dom"],
  });

  await markUseClient("./app");
  // rmdirSync(tempFolderPath, { recursive: true });
  console.log(res);
};

main();
