import { BunPlugin } from "bun";
import { mkdir, rmdirSync } from "fs";
import { readdir } from "fs/promises";
import path from "path";

const tempFolderPath = "./temp";
mkdir(tempFolderPath, { recursive: true }, (err) => {});
rmdirSync("./app", { recursive: true });
mkdir("./app", { recursive: true }, (err) => {});

const files = await readdir("./output");
const routeFiles = files.filter((file) => file.startsWith("Routes"));

for (let name of routeFiles) {
  const split = name.split(".");
  let file = await Bun.file(`./output/${name}/index.js`).text();
  file = file.replaceAll("../", import.meta.dir + "/output/");
  file;

  const filename = split[split.length - 1].toLowerCase();

  split.pop();
  split.shift();

  const outdir = `${tempFolderPath}/` + split.join("/").toLowerCase();

  const foreign = Bun.file(`./output/${name}/foreign.js`);

  if (await foreign.exists()) {
    await Bun.write(`${outdir}/foreign.js`, foreign);
  }

  await Bun.write(`${outdir}/${filename}.js`, file);
}

const entrypoints: string[] = [];

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

await readAndCheckJs(tempFolderPath);

const res = await Bun.build({
  entrypoints,
  outdir: "./app/",
  splitting: true,
  naming: {
    asset: "[dir]/[name].[ext]",
    chunk: "chunks/[name]-[hash].[ext]",
  },
  publicPath: "~/",
  target: "node",
  external: ["react", "react-dom"],
});

const markUseClient = async (dir: string) => {
  const files = await readdir(dir);

  for (let f of files) {
    if (path.extname(f) === ".js") {
      const fullPath = path.join(dir, f);
      let file = await Bun.file(fullPath).text();

      if (fullPath.includes("app/layout.js")) {
        file = `import '@/globals.css';\n` + file;
      }

      if (f.includes("chunk")) {
        file = file.replace("~/chunk-", "~/chunks/chunk-");
        await Bun.write(fullPath, file);
        continue;
      }

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

await markUseClient("./app");

rmdirSync(tempFolderPath, { recursive: true });

console.log(res);
