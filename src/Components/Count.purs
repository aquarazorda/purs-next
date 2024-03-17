module Components.Count where

import Data.Tuple.Nested
import Prelude

import React.Basic.DOM as R
import React.Basic.Events (handler_)
import React.Basic.Hooks as React

useClient :: Boolean
useClient = true

mkCounter :: React.Component Int
mkCounter = do
  React.component "Count" $ \initialCount -> React.do
    count /\ setCount <- React.useState initialCount

    pure $ R.div
      { className: "place-self-start self-start font-medium text-orange-500"
      , children:
          [ R.text $ show count
          , R.button
              { onClick: handler_ do
                  setCount (_ + 1)
              , children: [ R.text "+" ]
              }
          ]
      }
