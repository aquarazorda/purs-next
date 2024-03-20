module App.Page (default) where

import Prelude hiding (div)

import Components.Count (counter)
import Control.Promise (Promise)
import Effect.Aff (Aff)
import Fetch (fetch)
import Fetch.Yoga.Json (fromJSON)
import React.Basic.Server (defaultExport')
import React.Component (ReactElement, ReactComponent, a, createComponentImpl, div, h3, span, text)

type NewsItem =
  { id :: Int
  , title :: String
  , url :: String
  , user :: String
  , time_ago :: String
  , comments_count :: Int
  }

type NewsResponse = Array NewsItem

item :: NewsItem -> ReactElement 
item { title, url, user, time_ago, comments_count } =
  div
    { className: "flex items-center space-x-4 p-4"
    , children:
    [ div { children: [
            counter { count: 10 },
             h3
                { className: "text-gray-700"
                , children: [ a { href: url, children: [ text title ] } ]
                }
            , div
                { className: "flex space-x-1.5 text-xs text-gray-500"
                , children:
                [ span {children: [ text "by ", a { href: "#", className: "hover:underline", children: [ text user ] } ]}
                    , span [ text time_ago ]
                    , a { href: "#", className: "hover:underline", children: [ text $ show comments_count, text " comments" ] }
                    ]
                }
            ]}
        ]
    }

-- counter :: ReactComponent { count :: Int }
-- counter = createComponent \{ count } -> do
--   R.div_ [ R.text $ show count ]

comp :: forall props. props -> Aff ReactElement
comp _ = do
  { json } <- fetch "https://node-hnapi.herokuapp.com/news" {}
  jsonArr :: NewsResponse <- fromJSON json
  -- counter <- liftEffect mkCounter


  pure $ div { children: text "SDA" }
  -- pure $ div {children: map item jsonArr}

-- default = createComponentImpl \_ -> div {children: [counter { count: 10 }]}
default :: forall props. ReactComponent props
default = defaultExport' comp
