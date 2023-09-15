import mock from './mock'

import './auth/jwt'
import './apps/invoice'
import './pages/faq'
import './pages/pricing'

mock.onAny().passThrough()
