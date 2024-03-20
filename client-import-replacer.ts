export const clientImportReplacer = async (
  mainString: string,
  matchString: string,
) => {
  let updatedMainString = mainString;

  if (mainString.includes(matchString.replaceAll("/", ".") + "/index.js")) {
    // Extract the module name from the import statement
    const importRegex = /import \* as (\w+) from "[^"]+"/;
    const match = mainString.match(importRegex);
    const moduleName = match ? match[1] : null;

    if (moduleName) {
      // Find all occurrences of the module usage
      const moduleRegex = new RegExp(
        `${moduleName}\\.([\\w]+)\\({[^}]+}\\)`,
        "g",
      );
      const matches = [...mainString.matchAll(moduleRegex)];

      const importReplacements = new Set();

      // Loop through the matches and replace the import and function calls
      for (const match of matches) {
        const functionName = match[1];
        importReplacements.add(
          `${functionName} as ${functionName
            .charAt(0)
            .toUpperCase()}${functionName.slice(1)}`,
        );
        const functionReplacement = `<${functionName
          .charAt(0)
          .toUpperCase()}${functionName.slice(1)} {...${match[0]
          .split("(")[1]
          .replace(")", "")}} />`;

        updatedMainString = updatedMainString.replace(
          match[0],
          functionReplacement,
        );
      }

      const importReplacementString = Array.from(importReplacements).join(", ");

      updatedMainString = updatedMainString.replace(
        importRegex,
        `import { ${importReplacementString} } from "${
          import.meta.dir
        }/app/${matchString.toLowerCase()}.jsx"`,
      );

      console.log(matchString, updatedMainString);
      return updatedMainString;
    }
  }

  return updatedMainString;
};
