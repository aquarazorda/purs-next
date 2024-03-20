"use client";
import { useState as US } from "react";

export const useState = (initial) => {
  const [state, setState] = US(initial);

  return { _1: state, _2: setState };
};
