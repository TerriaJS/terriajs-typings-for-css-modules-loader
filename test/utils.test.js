// @ts-check
const { filenameToPascalCase, getCssModuleKeys } = require("../src/utils");

describe("filenameToPascalCase", () => {
  it("camelCase", () => {
    const actual = filenameToPascalCase("reactDatePicker");
    expect(actual).toBe("ReactDatePicker");
  });

  it("PascalCase", () => {
    const actual = filenameToPascalCase("reactDatePicker");
    expect(actual).toBe("ReactDatePicker");
  });

  it("snake_case", () => {
    const actual = filenameToPascalCase("_React_date_picker");
    expect(actual).toBe("ReactDatePicker");
  });

  it("_mixed-case", () => {
    const actual = filenameToPascalCase("_React-date_picker");
    expect(actual).toBe("ReactDatePicker");
  });
});

describe("getCssModuleKeys", () => {
  it("empty CSS module", () => {
    const content = `
      exports = module.exports = require("../node_modules/css-loader/dist/runtime/api.js")(false);
      // Module
      exports.push([module.id, "", ""]);
    `;
    const actual = getCssModuleKeys(content);
    expect(actual).toEqual([]);
  });

  it("CJS CSS module with one class", () => {
    const content = `exports.locals = {
      "test": "test"
    };`;
    const actual = getCssModuleKeys(content);
    expect(actual).toEqual(["test"]);
  });

  it("ESM CSS module with one class", () => {
    const content = `export var test = "test";`;
    const actual = getCssModuleKeys(content);
    expect(actual).toEqual(["test"]);
  });

  it("CJS CSS module with multiple classes", () => {
    const content = `exports.locals = {
      "test1": "test1",
      "test2": "test2"
    };`;
    const actual = getCssModuleKeys(content);
    expect(actual).toEqual(["test1", "test2"]);
  });

  it("ESM CSS module with multiple classes", () => {
    const content = `
      export var test1 = "test1";
      export var test2 = "test2";
    `;
    const actual = getCssModuleKeys(content);
    expect(actual).toEqual(["test1", "test2"]);
  });

  it("CSS module with :root pseudo-class only", () => {
    const content = `
      exports = module.exports = require("../node_modules/css-loader/dist/runtime/api.js")(false);
      // Module
      exports.push([module.id, ":root {\n  --background: green; }\n", ""]);
    `;
    const actual = getCssModuleKeys(content);
    expect(actual).toEqual([]);
  });

  it("CJS CSS module with special class names", () => {
    const content = `.locals = {
      "øæå": "nordic",
      "+~@": "special",
      "f\\'o\\'o": "escaped",
    };`;
    const actual = getCssModuleKeys(content);
    expect(actual).toEqual(["øæå", "+~@", "f\\'o\\'o"]);
  });

  it("ESM CSS module with special class names", () => {
    const content = `
      var _1 = "nordic";
      export { _1 as "øæå" };
      var _2 = "special";
      export { _2 as "+~@" };
      var _3 = "escaped";
      export { _3 as "f\\'o\\'o" };
    };`;
    const actual = getCssModuleKeys(content);
    expect(actual).toEqual(["øæå", "+~@", "f\\'o\\'o"]);
  });

  it("CSS module with newline in class names should be ignored", () => {
    const content = `.locals = {
      "line1
line2": "twolinesdoesnotmakesense"
    };`;
    const actual = getCssModuleKeys(content);
    expect(actual).toEqual([]);
  });
});
