export const StringUtils = {
  CamelCaseToUnderscore: (str: string) => {
    return str.replace(/([a-z])([A-Z])/g, '$1_$2').toLowerCase();
  },
  UnderscoreToCamelCase: (str: string) => {
    return str.replace(/(\_\w)/g, (m) => m[1].toUpperCase());
  },
  Capitalize: (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  },
};
