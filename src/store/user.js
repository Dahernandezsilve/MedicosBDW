const user = (store) => {
  store.on('@init', () => ({ user: { username: '', token: '', isLoggedIn: false } }))
  store.on('user/login', (_, { username, token }) => ({ user: { username, token, isLoggedIn: true } }))
  store.on('user/logout', (_) => ({ user: { username: '', token: '', isLoggedIn: false } }))
}

export default user
