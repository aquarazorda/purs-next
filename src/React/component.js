import { createElement as CE } from "react";

export const createElementImpl = (type) => (props) => CE(type, props);
export const createComponentImpl = (fn) => (props) => CE(fn, props);
