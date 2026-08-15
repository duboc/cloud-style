export function createRouter({ initialState, onChange }) {
  let state = { ...initialState };

  return {
    getState: () => ({ ...state }),
    go(next) {
      state = { ...state, ...next };
      onChange({ ...state });
    },
  };
}
