-- use client
module Components.Count where

import Data.Tuple (Tuple(..))
import Prelude (($), pure, show, (+))
import React.Basic.DOM as R
import React.Hooks (useState)
import React.Component (ReactComponent, createComponentImpl, text, div)

-- mkCounter :: Component Int
-- mkCounter = do
--   component "Count" $ \initialCount -> Hooks.do
--     count /\ setCount <- useState initialCount
--
--     pure $ R.div
--       { className: "place-self-start self-start font-medium text-orange-500"
--       , children:
--           [ R.text $ show count
--           , R.button
--               { onClick: handler_ do
--                   setCount (_ + 1)
--               , children: [ R.text "+" ]
--               }
--           ]
--       }

counter :: ReactComponent { count :: Int }
counter = createComponentImpl $ \props -> 
  let Tuple count setCount = useState props.count 
  in
  div { children: [text (show count)] }
  
