// copied from https://github.com/auth0/jwt-decode

function b64DecodeUnicode(str: string) {
  return decodeURIComponent(
    atob(str).replace(/(.)/g, function (m, p) {
      let code = p.charCodeAt(0).toString(16).toUpperCase();
      if (code.length < 2) {
        code = '0' + code;
      }
      return '%' + code;
    }),
  );
}

function b64UrlDecode(str: string) {
  let output = str.replace(/-/g, '+').replace(/_/g, '/');
  switch (output.length % 4) {
    case 0:
      break;
    case 2:
      output += '==';
      break;
    case 3:
      output += '=';
      break;
    default:
      throw new Error('base64 string is not of the correct length');
  }

  try {
    return b64DecodeUnicode(output);
  } catch (ignoreErr) {
    return atob(output);
  }
}

export function jwtDecode(token: string, options: { header?: boolean } = {}) {
  if (typeof token !== 'string') {
    throw new Error('Invalid token specified: must be a string');
  }

  const pos = options.header === true ? 0 : 1;

  const part = token.split('.')[pos];
  if (typeof part !== 'string') {
    throw new Error('Invalid token specified: missing part #' + (pos + 1));
  }
  let decoded;
  try {
    decoded = b64UrlDecode(part);
  } catch (e: any) {
    throw new Error(
      'Invalid token specified: invalid base64 for part #' + (pos + 1) + ' (' + e.message + ')',
    );
  }

  try {
    return JSON.parse(decoded);
  } catch (e: any) {
    throw new Error(
      'Invalid token specified: invalid json for part #' + (pos + 1) + ' (' + e.message + ')',
    );
  }
}
