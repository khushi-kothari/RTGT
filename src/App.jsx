import { useState } from 'react'
import './styles/App.css'
import Header from './components/Header'
import List from './components/List'
import Refresh from './components/Refresh'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faBarsStaggered, faMagnifyingGlass, faCircleUser, faArrowsRotate, faCodeFork, faStar, faEye } from '@fortawesome/free-solid-svg-icons'
import Fetch from './components/Fetch'
library.add(faBarsStaggered, faMagnifyingGlass, faCircleUser, faArrowsRotate, faCodeFork, faStar, faEye)

function App() {
  return (
    <div className='m-4'>
      <Header />
      <Fetch />
      {/* <Refresh /> */}
    </div>
  )
}

export default App
