import { Component } from 'react'

export default class ErrorBoundary extends Component {
  state = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error, info) {
    console.error('Unhandled error in the app', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className='rh-empty'>
          <p>Something went wrong. Try reloading the page.</p>
          <button className='rh-retry' onClick={() => window.location.reload()}>
            Reload
          </button>
        </div>
      )
    }
    return this.props.children
  }
}
