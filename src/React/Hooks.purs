module React.Hooks where

import Prelude

import Data.Tuple (Tuple)
import Effect (Effect)

foreign import useState :: forall state. state -> Tuple state (state -> state -> Effect Unit)
