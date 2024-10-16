import createDOMPurify from 'dompurify';
let DOMPurify: any = null;
const getDOMPurify = () => {
  if (DOMPurify) {
    return DOMPurify;
  }
  if (window) {
    DOMPurify = createDOMPurify(window);
    return DOMPurify;
  }
  return null;
};

/**
 * Sanitize an html string.
 *
 * @param string
 * @returns {*}
 */
export function sanitize(string: string, options: any): TrustedHTML | string {
  const dompurify = getDOMPurify();
  if (!dompurify) {
    console.log('DOMPurify unable to sanitize the contents.');
    return string;
  }
  // Dompurify configuration
  const sanitizeOptions: any = {
    ADD_ATTR: ['ref', 'target', 'within'],
    USE_PROFILES: { html: true },
  };
  // Add attrs
  if (
    options.sanitizeConfig &&
    Array.isArray(options.sanitizeConfig.addAttr) &&
    options.sanitizeConfig.addAttr.length > 0
  ) {
    options.sanitizeConfig.addAttr.forEach((attr: any) => {
      sanitizeOptions.ADD_ATTR.push(attr);
    });
  }
  // Add tags
  if (
    options.sanitizeConfig &&
    Array.isArray(options.sanitizeConfig.addTags) &&
    options.sanitizeConfig.addTags.length > 0
  ) {
    sanitizeOptions.ADD_TAGS = options.sanitizeConfig.addTags;
  }
  // Allow tags
  if (
    options.sanitizeConfig &&
    Array.isArray(options.sanitizeConfig.allowedTags) &&
    options.sanitizeConfig.allowedTags.length > 0
  ) {
    sanitizeOptions.ALLOWED_TAGS = options.sanitizeConfig.allowedTags;
  }
  // Allow attributes
  if (
    options.sanitizeConfig &&
    Array.isArray(options.sanitizeConfig.allowedAttrs) &&
    options.sanitizeConfig.allowedAttrs.length > 0
  ) {
    sanitizeOptions.ALLOWED_ATTR = options.sanitizeConfig.allowedAttrs;
  }
  // Allowd URI Regex
  if (options.sanitizeConfig && options.sanitizeConfig.allowedUriRegex) {
    sanitizeOptions.ALLOWED_URI_REGEXP = options.sanitizeConfig.allowedUriRegex;
  }
  // Allow to extend the existing array of elements that are safe for URI-like values
  if (
    options.sanitizeConfig &&
    Array.isArray(options.sanitizeConfig.addUriSafeAttr) &&
    options.sanitizeConfig.addUriSafeAttr.length > 0
  ) {
    sanitizeOptions.ADD_URI_SAFE_ATTR = options.sanitizeConfig.addUriSafeAttr;
  }
  return dompurify.sanitize(string, sanitizeOptions);
}
