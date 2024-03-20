-- use client
module Components.Count where

import Data.Tuple.Nested ((/\))
import Prelude (show, ($), (+))
import React.Component (ReactComponent, createComponentImpl, text, div, button)
import React.Hooks (useState)

counter :: ReactComponent { count :: Int }
counter = createComponentImpl $ \props -> do
  let count /\ setCount = useState props.count 
  div { className: "place-self-start self-start font-medium text-orange-500"
      , children:
          [ text $ show count
          , button
              { onClick: \_ ->
                  setCount (_ + 1)
              , children: [ text "+" ]
              }
          ]
      }  
