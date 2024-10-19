import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { store } from './redux/store.js'
import Movie from './Movie.jsx'
import Review from './Review.jsx'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'E:/Coding/styles/index.css'

createRoot(document.getElementById('section')).render(
  <StrictMode>
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/" element={<Movie />} />
          <Route path="/reviews" element={<Review />} />
        </Routes>
      </Router>
    </Provider>
  </StrictMode>,
)
