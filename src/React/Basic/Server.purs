module React.Basic.Server where

import Prelude

import Control.Promise (fromAff, Promise)
import Effect.Aff (Aff)
import Effect.Unsafe (unsafePerformEffect)
import React.Basic (JSX)
import React.Component (ReactComponent, ReactElement, createComponentImpl, createEffectComponent)

type AsyncComponent props = props -> Promise JSX

defaultExport :: forall props. (props -> Aff JSX) -> AsyncComponent props
defaultExport render props = unsafePerformEffect $ fromAff (render props)

type AsyncComponent' props = props -> Promise ReactElement 

defaultExport' :: forall props. (props -> Aff ReactElement) -> props -> ReactElement
defaultExport' render = createEffectComponent $ fromAff <<< render
