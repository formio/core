/**
 * Performs a fast clone deep operation.
 *
 * @param obj
 */
export function fastCloneDeep(obj: any) {
  try {
    return JSON.parse(JSON.stringify(obj));
  } catch (err: any) {
    console.log(`Clone Failed: ${err.message}`);
    return null;
  }
}
