"use client";

export const useState = (initial) => {
  const [state, setState] = US(initial);

  return { value0: state, value1: setState };
};
