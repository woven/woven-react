import Rx from 'rx'

export const routes = {
  home: '/',
  about: '/about',
  events: '/events'
}

export const Router = (options = {}) => {
  const getCurrentRoute = () => options.pathname || window.location.pathname

  const route = new Rx.BehaviorSubject(getCurrentRoute())

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
