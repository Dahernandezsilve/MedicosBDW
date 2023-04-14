import { storeonDevtools } from 'storeon/devtools'
import { createStoreon } from 'storeon'
import user from './user'

const store = createStoreon([
  user,
  storeonDevtools,
])

export default store
