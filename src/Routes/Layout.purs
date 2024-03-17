module Routes.Layout where

import React.Basic (JSX)
import React.Basic.DOM (html, body_)

default :: { children :: JSX } -> JSX
default { children } = html { lang: "en", children: [ body_ [ children ] ] }
