module Routes.About.Page where

import Prelude

import React.Basic.DOM as R
import React.Basic.Events (handler_)
import React.Basic.Hooks (Component, component, useState, (/\))
import React.Basic.Hooks as React

default :: Component Int
default = component "MainPage" \_ -> React.do
  counter /\ setCounter <- useState 0

  pure $ R.div_
    [ R.h1_ [ R.text "Hello, world!" ]
    , R.p_ [ R.text "You clicked ", R.text (show counter), R.text " times" ]
    , R.button { onClick: handler_ (setCounter \v -> v + 1), children: [ R.text "Click me" ] }
    ]
