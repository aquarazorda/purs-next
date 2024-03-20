module App.Page (default) where

import Prelude hiding (div)

import Components.Count (counter)
import Data.Maybe (Maybe, fromMaybe)
import Effect.Aff (Aff)
import Fetch (fetch)
import Fetch.Yoga.Json (fromJSON)
import React.Basic.Server (AsyncComponent, defaultExport)
import React.Component (ReactElement, a, div, h3, span, text)

type NewsItem =
  { id :: Int
  , title :: String
  , url :: String
  , user :: Maybe String
  , time_ago :: String
  , comments_count :: Int
  }

type NewsResponse = Array NewsItem

item :: NewsItem -> ReactElement
item { title, url, time_ago, user, comments_count } =
  div
    { className: "flex items-center space-x-4 p-4"
    , children:
        [ div
            { children:
                [ counter { count: 10 }
                , h3
                    { className: "text-gray-700"
                    , children: [ a { href: url, children: [ text title ] } ]
                    }
                , div
                    { className: "flex space-x-1.5 text-xs text-gray-500"
                    , children:
                        [ span { children: [ text "by ", a { href: "#", className: "hover:underline", children: [ text $ fromMaybe "" user ] } ] }
                        , span [ text time_ago ]
                        , a { href: "#", className: "hover:underline", children: [ text $ show comments_count, text " comments" ] }
                        ]
                    }
                ]
            }
        ]
    }

comp :: forall props. props -> Aff ReactElement
comp _ = do
  { json } <- fetch "https://node-hnapi.herokuapp.com/news" {}
  jsonArr :: NewsResponse <- fromJSON json

  pure $ div { children: map item jsonArr }

default :: forall props. AsyncComponent props
default = defaultExport comp
