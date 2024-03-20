module React.Component where

import Prelude hiding (div)

import Control.Promise (Promise)
import Effect (Effect)
import Unsafe.Coerce (unsafeCoerce)

foreign import data ReactElement :: Type
type ReactComponent props = props -> ReactElement

foreign import createElementImpl :: forall props. String -> ReactComponent props
foreign import createComponentImpl :: forall props. ReactComponent props -> ReactComponent props

createEffectComponent :: forall props. (props -> Effect (Promise ReactElement)) -> ReactComponent props
createEffectComponent = unsafeCoerce createComponentImpl

text :: String -> ReactElement
text = unsafeCoerce

div :: forall props. ReactComponent props
div = createElementImpl "div"

h3 :: forall props. ReactComponent props
h3 = createElementImpl "h3"

a :: forall props. ReactComponent props
a = createElementImpl "a"

span :: forall props. ReactComponent props
span = createElementImpl "span"

button :: forall props. ReactComponent props
button = createElementImpl "button"

