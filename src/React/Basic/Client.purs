module React.Basic.Client where

import Effect.Unsafe (unsafePerformEffect)
import React.Basic (JSX)
import React.Basic.Hooks (Component)

defaultExport :: forall props. Component props -> (props -> JSX)
defaultExport = unsafePerformEffect
