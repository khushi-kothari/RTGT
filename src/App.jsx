import './styles/App.css'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faBarsStaggered, faMagnifyingGlass, faCircleUser, faArrowsRotate, faCodeFork, faStar, faEye, faFilter, faFilterCircleXmark, faArrowsUpDown, faSort } from '@fortawesome/free-solid-svg-icons'
import { faGithubAlt } from '@fortawesome/free-brands-svg-icons'
import Fetch from './components/pages/Fetch'
library.add(faBarsStaggered, faMagnifyingGlass, faCircleUser, faArrowsRotate, faCodeFork, faStar, faEye, faFilter, faFilterCircleXmark, faArrowsUpDown, faGithubAlt, faSort)
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Issues from './components/pages/Issues'

function App() {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<Fetch />} />
        <Route path="/issue-search" element={<Issues />} />
        {/* Other routes */}
      </Routes>
    </Router>
  );
}

export default App
