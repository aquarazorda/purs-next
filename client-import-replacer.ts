export const clientImportReplacer = async (
  mainString: string,
  matchString: string,
) => {
  let updatedMainString = mainString;

  if (mainString.includes(matchString.replaceAll("/", ".") + "/index.js")) {
    // Extract the module name from the import statement
    const importRegex = /import \* as (\w+\$[a-z]\w+) from "[^"]+"/;
    const match = mainString.match(importRegex);
    const moduleName = match ? match[1] : null;

    if (moduleName) {
      // Escape the special characters in the module name
      const escapedModuleName = moduleName.replace(/\$/g, "\\$");

      // Find all occurrences of the module usage
      const moduleRegex = new RegExp(
        `${escapedModuleName}\\.([\\w]+)\\({([^}]+)}\\)`,
        "g",
      );

      const matches = [...mainString.matchAll(moduleRegex)];

      const importReplacements = new Set();

      // Loop through the matches and replace the import and function calls
      for (const match of matches) {
        const functionName = match[1];
        const functionArguments = match[2].trim();
        importReplacements.add(
          `${functionName} as ${functionName
            .charAt(0)
            .toUpperCase()}${functionName.slice(1)}`,
        );
        const functionReplacement = `<${functionName
          .charAt(0)
          .toUpperCase()}${functionName.slice(
          1,
        )} {...{${functionArguments}}} />`;

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

      return updatedMainString;
    }
  }

  return updatedMainString;
};
