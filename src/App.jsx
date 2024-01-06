import { useState } from 'react'
import './styles/App.css'
import Header from './components/Header'
import List from './components/List'
import Refresh from './components/Refresh'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faBarsStaggered, faMagnifyingGlass, faCircleUser, faArrowsRotate, faCodeFork, faStar, faEye, faFilter, faFilterCircleXmark, faArrowsUpDown, faSort } from '@fortawesome/free-solid-svg-icons'
import { faGithubAlt } from '@fortawesome/free-brands-svg-icons'
import Fetch from './components/Fetch'
// import Activity from './components/Activity'
library.add(faBarsStaggered, faMagnifyingGlass, faCircleUser, faArrowsRotate, faCodeFork, faStar, faEye, faFilter, faFilterCircleXmark, faArrowsUpDown, faGithubAlt, faSort)

function App() {
  return (
    <div className='m-4'>
      <Header />
      <Fetch />
      {/* <Activity /> */}
      {/* <Refresh /> */}
    </div>
  )
}

export default App
