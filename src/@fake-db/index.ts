import mock from './mock' 

 import './auth/jwt' 
 import './apps/invoice'

 mock.onAny().passThrough()