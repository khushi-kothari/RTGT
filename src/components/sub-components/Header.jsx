import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useState } from "react";
import Dropdown from './Dropdown';

function Header() {
  const [starsSort, setStarsSort] = useState(false);
  const [forksSort, setForksSort] = useState(false);
  // const options = ['Option 1', 'Javascript', 'Option 3'];
  const options = [
    { label: 'Option 1', subtext: 12 },
    { label: 'Javascript', subtext: 320 },
    { label: 'Option 3' },
    // Add more options as needed
  ];


  return (
    <>
      <div className="flex justify-between items-center px-6 h-20 text-white bg-green-700 rounded-t-md">
        <FontAwesomeIcon icon="fa-brands fa-github-alt" className='text-5xl' />
        <h1 className='text-3xl font-semibold'>Github Explore</h1>
        {/* <FontAwesomeIcon icon="fa-solid fa-magnifying-glass" className='text-2xl' /> */}
        <FontAwesomeIcon icon="fa-solid fa-bars-staggered" className='text-2xl' />
      </div>
      <div className='flex px-6 h-16 items-center bg-green-600 rounded-b-md text-white font-semibold'>
        <FontAwesomeIcon icon="fa-solid fa-filter-circle-xmark" className='text-3xl text-white pr-4' />
        <div className='px-4'>
          <label className='pr-2 text-lg'>Language: </label>
          <Dropdown options={options} defaultSelected={'Javascript'} />
        </div>
        <div className='px-4'>
          <label className='pr-2 text-lg'>Issue Label: </label>
          <Dropdown options={options} />
        </div>
        <div className='px-4'>
          <label className='pr-2 text-lg'>Repository: </label>
          <Dropdown options={options} />
        </div>
        <button
          className={`${starsSort ? 'bg-zinc-300 hover:shadow-none' : 'bg-white hover:shadow-xl'} hover:bg-zinc-300 border border-gray-300 rounded py-2 px-4 mx-2 text-gray-700 `}
          onClick={() => {
            setStarsSort(!starsSort);
            if (forksSort) setForksSort(!forksSort)
          }}
          disabled={starsSort}
        >
          <FontAwesomeIcon icon="fa-solid fa-arrows-up-down" className='text-xl pr-2' />
          Stars</button>
        <button
          className={`${forksSort ? 'bg-zinc-300 hover:shadow-none' : 'bg-white hover:shadow-xl'} hover:bg-zinc-300 border border-gray-300 rounded py-2 px-4 mx-2 text-gray-700`}
          onClick={() => {
            setForksSort(!forksSort);
            if (starsSort) setStarsSort(!starsSort)
          }}
          disabled={forksSort}>
          <FontAwesomeIcon icon="fa-solid fa-arrows-up-down" className='text-xl pr-2' />
          Forks</button>
      </div >
    </>
  );
}

export default Header;
