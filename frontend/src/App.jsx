import {Routes, Route} from 'react-router-dom'
import About from './pages/About'
import Cart from './pages/Cart'
import NavBar from './components/NavBar'
import Login from './pages/Login'
import Item from './pages/Item'
import Home from './pages/Home'

const App = () => {
  return (
    <div>
      <NavBar />
      <Routes>
        <Route path='/' element={<Home/>} />
        <Route path='/about' element={<About/>} />
        <Route path='/item' element={<Item/>} />
        <Route path='/cart' element={<Cart/>} />
        <Route path='/login' element={<Login/>} />
      </Routes>
    </div>
  )
}

export default App