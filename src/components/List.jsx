import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'


function List({ data }) {
    // console.log(data)
    return (
        <>
            {data ? (
                <>
                    {/* Line */}
                    <div className='absolute ml-10 border-r-4 border-gray-300 h-80 xs:h-72 md:h-48 w-8 -z-50'></div>
                    {/* List */}
                    <div className='flex justify-between items-center m-8 mt-14 mb-12'>
                        <div className='flex items-center'>
                            {/* <div className='circle h-20 w-20'> */}
                            {/* <FontAwesomeIcon icon="fa-solid fa-circle-user" className=' text-6xl' /> */}
                            <img alt="avatar" src={data.owner.avatar_url} className='rounded-full h-16 w-16' />
                            {/* </div> */}
                            <div className='ml-4'>
                                <p className='text-gray-500 '>Updated {data.updated_at}</p>
                                <h1 className=' font-medium'>{data.full_name}</h1>
                                <p className='font-light pt-1 max-w-[66vw] line-clamp-2 pr-4'>{data.description} </p>

                            </div>
                        </div>
                        <div className='text-sm flex flex-wrap justify-end'>
                            <button className='p-3 bg-neutral-100 rounded-lg m-2'>
                                <FontAwesomeIcon icon="fa-solid fa-code-fork" className='px-2 text-xl' />
                                {data.forks_count}</button>
                            <button className='p-3 bg-neutral-100 rounded-lg m-2'>
                                <FontAwesomeIcon icon="fa-solid fa-star" className='px-2 text-xl' />
                                {data.stargazers_count}</button>
                            <button className='p-3 bg-neutral-100 rounded-lg m-2'>
                                <FontAwesomeIcon icon="fa-solid fa-eye" className='px-2 text-xl' />
                                {data.watchers_count}</button>
                        </div>
                    </div>
                </>
            ) : <>Loading...</>}
        </>
    )
}

export default List