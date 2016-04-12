export const routes = {
  home: '/',
  about: '/about'
}

const getCurrentRoute = () => window.location.pathname

export const Router = () => {
  const route = new rx.BehaviorSubject(getCurrentRoute()) // BehaviorSubject can be given an initial value.

  return {
    route,
    paginate: (e) => {
      const pathname = e.target.getAttribute('href')
      window.history.pushState(null, 'Test', pathname)
      route.onNext(pathname)
      e.preventDefault()
      e.stopPropagation()
    },
    getCurrentRoute
  }
}
