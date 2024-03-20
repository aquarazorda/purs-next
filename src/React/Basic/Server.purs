module React.Basic.Server where

import Prelude

import Control.Promise (fromAff, Promise)
import Effect.Aff (Aff)
import Effect.Unsafe (unsafePerformEffect)
import React.Component (ReactElement)

type AsyncComponent props = props -> Promise ReactElement

defaultExport :: forall props. (props -> Aff ReactElement) -> AsyncComponent props
defaultExport render =  unsafePerformEffect <<< fromAff <<< render
