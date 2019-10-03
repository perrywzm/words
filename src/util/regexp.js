const nonAlphanumericRegExp = /[^a-zA-Z0-9]/g;

class RegExpUtil {
  static isAlphanumeric(str) {
    return !str.match(nonAlphanumericRegExp);
  }
  static removeNonAlphanumeric(str) {
    return str.replace(nonAlphanumericRegExp, "");
  }
}

export default RegExpUtil;
