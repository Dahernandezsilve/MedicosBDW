import { createStoreon } from 'storeon'
import user from './user'

const store = createStoreon([
  user,
])

export default store
