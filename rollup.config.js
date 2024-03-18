import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import { terser } from "rollup-plugin-terser";
import preserveDirectives from "rollup-preserve-directives";
import { mkdirSync, rmdirSync, readFileSync } from "fs";
import { readdir, readFile, writeFile } from "fs/promises";
import path from "path";

const tempFolderPath = "./temp";
mkdirSync(tempFolderPath, { recursive: true }, (err) => {});
try {
  rmdirSync("./app", { recursive: true });
} catch {}

mkdirSync("./app", { recursive: true }, (err) => {});

const getEntrypoints = async () => {
  const files = await readdir("./output");
  const routeFiles = files.filter((file) => file.startsWith("Routes"));

  const entrypoints = {};

  for (let name of routeFiles) {
    const split = name.split(".");
    const filename = split[split.length - 1].toLowerCase();

    split.pop();
    split.shift();

    const partialDir = split.join("/").toLowerCase();
    const outdir = `${tempFolderPath}/` + partialDir;
    mkdirSync(outdir, { recursive: true }, (err) => {});

    const text = await readFile(`./output/${name}/index.js`, "utf8").then(
      (text) => text.replaceAll("../", path.resolve("./output/") + "/"),
    );

    await writeFile(`${outdir}/${filename}.js`, text);

    entrypoints[`${partialDir ? partialDir + "/" : ""}${filename}`] =
      `${outdir}/${filename}.js`;
  }

  return entrypoints;
};

const getFilesInDir = async (dir) => {
  const files = await readdir(dir);
  return files;
};

const clientEntryPoints = {};

const getSeparateClientComponentEntrypoints = async () => {
  // we need to go through src folder, and find all files which contain useClient

  const files = await readdir("./src");
  const routeFiles = files.filter((file) => !file.startsWith("Routes"));

  for (let name of routeFiles) {
    if (name.endsWith(".purs")) {
      const text = await readFile(name, "utf8");
      if (text.includes("useClient")) {
        clientEntryPoints[name] = text;
      }
      continue;
    }

    await getSeparateClientComponentEntrypoints(name);
    // const partialDir = split.join("/").toLowerCase();
    // const outdir = `${tempFolderPath}/` + partialDir;
    // mkdirSync(outdir, { recursive: true }, (err) => {});
    // const text = await readFile(`./src/${name}`, "utf8");
    // if (text.includes("useClient")) {
    //   await writeFile(`${outdir}/${filename}.js`, text);
    //   entrypoints[`${partialDir ? partialDir + "/" : ""}${filename}`] =
    //     `${outdir}/${filename}.js`;
    // }
  }
};

getSeparateClientComponentEntrypoints();
console.log(clientEntryPoints);

// eslint-disable-next-line import/no-anonymous-default-export
export default async () => {
  const entrypoints = await getEntrypoints();

  return {
    input: entrypoints,
    onwarn(warning, warn) {
      if (warning.code === "MODULE_LEVEL_DIRECTIVE") {
        return;
      }
      warn(warning);
    },
    output: {
      dir: "app",
      entryFileNames: "[name].js",
      chunkFileNames: "chunks/[name]-[hash].js",
      format: "esm",
    },
    plugins: [
      preserveDirectives.default(),
      // {
      //   name: "modify-files",
      //   resolveFileUrl: console.log,
      //   async transform(code, id) {
      //     if (id.includes("output/Routes")) {
      //       if (id.includes("layout.js")) {
      //         code = `import '@/globals.css';\n` + code;
      //       }
      //     }
      //
      //     if (code.includes("useClient")) {
      //       code = `'use client'\n` + code;
      //     }
      //
      //     return code;
      //   },
      // },
      resolve(),
      // commonjs(),
      // terser(),
    ],
    external: ["react", "react-dom"],
  };
};
