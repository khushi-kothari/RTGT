import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from "react";
import Dropdown from './Dropdown';
import { Link } from 'react-router-dom';

const options = [
  { label: 'Option 1', subtext: 12 },
  { label: 'Javascript', subtext: 320 },
  { label: 'Option 3' },
];

function Header({ langOptions = options, labelOptions = options, onFilterChange }) {
  const [starsSort, setStarsSort] = useState(false);
  const [forksSort, setForksSort] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false); // State to manage mobile menu toggle

  return (
    <>
      {/* Main Header */}
      <div className="flex justify-between items-center px-4 sm:px-6 h-20 text-white bg-green-700 rounded-t-md">
        <Link to="/"><FontAwesomeIcon icon="fa-brands fa-github-alt" className='text-5xl' /></Link>
        <h1 className='text-xl sm:text-3xl font-semibold'>Github Explore</h1>
        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="sm:hidden text-2xl">
          <FontAwesomeIcon icon={isMenuOpen ? "fa-solid fa-xmark" : "fa-solid fa-bars-staggered"} />
        </button>
        <div className="hidden sm:flex">
          {/* Insert desktop menu items here */}
          <FontAwesomeIcon icon="fa-solid fa-bars-staggered" className='text-2xl' />
        </div>
      </div>

      {/* Responsive Sub Header */}
      {/* This section will be hidden on small screens and displayed when the menu is toggled */}
      <div className={`${isMenuOpen ? 'flex' : 'hidden'} py-2 sm:flex flex-col sm:flex-row px-4 sm:px-6 h-auto items-center bg-green-600 rounded-b-md text-white font-semibold`}>
        <FontAwesomeIcon icon="fa-solid fa-filter-circle-xmark" className='hidden sm:flex text-3xl text-white pr-4' />
        <div className='px-4 py-2 sm:py-0'>
          <label className='pr-2 text-lg'>Language: </label>
          <Dropdown label={'languages'} options={langOptions} onOptionSelect={onFilterChange} />
        </div>
        <div className='px-4 py-2 sm:py-0'>
          <label className='pr-2 text-lg'>Issue Label: </label>
          <Dropdown label={'labels'} options={labelOptions} onOptionSelect={onFilterChange} />
        </div>
        {/* Buttons for sorting */}
        <div className="flex flex-row my-1">
          <button
            className={`${starsSort ? 'bg-zinc-300 hover:shadow-none' : 'bg-white hover:shadow-xl'} hover:bg-zinc-300 border border-gray-300 rounded-full py-2 px-3 mx-2 text-gray-700`}
            onClick={() => {
              setStarsSort(!starsSort);
              if (forksSort) setForksSort(!forksSort)
              onFilterChange('sortBy', 'stars')
            }}
            disabled={starsSort}>
            {/* <FontAwesomeIcon icon="fa-solid fa-arrows-up-down" className='text-xl pr-2' /> Stars */}
            <FontAwesomeIcon icon="fa-solid fa-star" />
          </button>
          <button
            className={`${forksSort ? 'bg-zinc-300 hover:shadow-none' : 'bg-white hover:shadow-xl'} hover:bg-zinc-300 border border-gray-300 rounded-full py-2 px-3 mx-2 text-gray-700`}
            onClick={() => {
              setForksSort(!forksSort);
              if (starsSort) setStarsSort(!starsSort)
              onFilterChange('sortBy', 'forks')
            }}
            disabled={forksSort}>
            {/* <FontAwesomeIcon icon="fa-solid fa-arrows-up-down" className='text-xl pr-2' /> Forks */}
            <FontAwesomeIcon icon="fa-solid fa-code-fork" />
          </button>
        </div>
      </div>
    </>
  );
}

export default Header;
