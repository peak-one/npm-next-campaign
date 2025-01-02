function wrapMethod(method: Function, before: () => void, after: () => void) {
  return function (this: any, ...args: any[]) {
    before(); // Execute the "before" logic
    const result = method.apply(this, args); // Call the original method
    after(); // Execute the "after" logic
    return result;
  };
}

export default wrapMethod;
