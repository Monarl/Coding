import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { store } from './redux/store.js'
import Movie from './Movie.jsx'
import 'E:/Coding/styles/index.css'

createRoot(document.getElementById('section')).render(
  <StrictMode>
    <Provider store={store}>
      <Movie />
    </Provider>
  </StrictMode>,
)
