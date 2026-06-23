import "clsx";
function createDebounced(getSource, delay) {
  let value = getSource();
  return {
    get current() {
      return value;
    }
  };
}
export {
  createDebounced as c
};
