import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from "react";

function Header() {
  return (
    <>
      <div className="flex justify-between items-center px-6 h-20 text-white bg-green-600 rounded-md">
        <FontAwesomeIcon icon="fa-solid fa-bars-staggered" className='text-2xl' />
        <h1 className='text-3xl font-semibold'>Github Activity</h1>
        <FontAwesomeIcon icon="fa-solid fa-magnifying-glass" className='text-2xl' />
      </div>
    </>
  );
}

export default Header;
