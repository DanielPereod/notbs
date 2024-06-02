export const isUrlAbsolute = (url: string) =>
  url.indexOf("//") === 0
    ? true
    : url.indexOf("://") === -1
    ? false
    : url.indexOf(".") === -1
    ? false
    : url.indexOf("/") === -1
    ? false
    : url.indexOf(":") > url.indexOf("/")
    ? false
    : url.indexOf("://") < url.indexOf(".")
    ? true
    : false;
export function isLocalURL(string: string) {}
