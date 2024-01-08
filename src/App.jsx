import './styles/App.css'
import Header from './components/sub-components/Header'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faBarsStaggered, faMagnifyingGlass, faCircleUser, faArrowsRotate, faCodeFork, faStar, faEye, faFilter, faFilterCircleXmark, faArrowsUpDown, faSort } from '@fortawesome/free-solid-svg-icons'
import { faGithubAlt } from '@fortawesome/free-brands-svg-icons'
import Fetch from './components/pages/Fetch'
// import Activity from './components/Activity'
library.add(faBarsStaggered, faMagnifyingGlass, faCircleUser, faArrowsRotate, faCodeFork, faStar, faEye, faFilter, faFilterCircleXmark, faArrowsUpDown, faGithubAlt, faSort)

function App() {
  return (
    <div className='m-4'>
      <Header />
      <Fetch />
    </div>
  )
}

export default App
