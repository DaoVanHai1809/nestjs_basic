export const once = (fn) => {
    let cache = null;
    return () => (cache === null ? (cache = fn()) : cache);
  };