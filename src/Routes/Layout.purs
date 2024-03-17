module Routes.Layout where

import React.Basic (JSX)
import React.Basic.DOM (div, body, h1, header, html, text)

metadata :: { title :: String }
metadata = { title: "Nextjs 14 with PureScript" }

default :: { children :: Array JSX } -> JSX
default { children } = html
  { lang: "en"
  , children:
      [ body
          { className: "bg-gray-100"
          , children:
              [ header
                  { className: "bg-orange-500 py-2"
                  , children:
                      [ div
                          { className: "mx-auto max-w-4xl px-8"
                          , children:
                              [ h1 { className: "text-lg font-semibold text-white", children: [ text "Hacker News" ] }
                              ]
                          }
                      ]
                  }

              , div
                  { className: "mx-auto mt-6 max-w-4xl px-8"
                  , children:
                      [ div { className: "rounded-sm bg-white shadow-sm", children: children } ]
                  }
              ]
          }

      ]
  }
