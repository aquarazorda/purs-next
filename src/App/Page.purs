module App.Page (default) where

import Fetch
import Prelude

import Components.Count (mkCounter)
import Effect.Aff (Aff)
import Effect.Class (liftEffect)
import Fetch.Yoga.Json (fromJSON)
import React.Basic (JSX)
import React.Basic.DOM as R
import React.Basic.Server (AsyncComponent, defaultExport)

type NewsItem =
  { id :: Int
  , title :: String
  , url :: String
  , points :: Int
  , user :: String
  , time_ago :: String
  , comments_count :: Int
  }

type NewsResponse = Array NewsItem

item :: (Int -> JSX) -> NewsItem -> JSX
item counter { title, points, url, user, time_ago, comments_count } =
  R.div
    { className: "flex items-center space-x-4 p-4"
    , children:
        [ R.div_
            [ counter points
            , R.h3
                { className: "text-gray-700"
                , children: [ R.a { href: url, children: [ R.text title ] } ]
                }
            , R.div
                { className: "flex space-x-1.5 text-xs text-gray-500"
                , children:
                    [ R.span_ [ R.text "by ", R.a { href: "#", className: "hover:underline", children: [ R.text user ] } ]
                    , R.span_ [ R.text time_ago ]
                    , R.a { href: "#", className: "hover:underline", children: [ R.text $ show comments_count, R.text " comments" ] }
                    ]
                }
            ]
        ]
    }

comp :: forall props. props -> Aff JSX
comp _ = do
  { json } <- fetch "https://node-hnapi.herokuapp.com/news" {}
  jsonArr :: NewsResponse <- fromJSON json
  counter <- liftEffect mkCounter

  pure $ R.div_ $ map (item counter) jsonArr

default :: forall props. AsyncComponent props
default = defaultExport comp
