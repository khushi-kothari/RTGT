import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

function convertTime(timestamp) {
    const currentTime = new Date();
    const pastTime = new Date(timestamp);

    const timeDifference = Math.floor((currentTime - pastTime) / 1000); // in seconds

    const timeAgoHours = Math.floor(timeDifference / 3600); // convert to hours
    const timeAgoDays = Math.floor(timeAgoHours / 24); // convert to days

    const options = { month: 'long', day: 'numeric', year: 'numeric' };
    const formattedDate = pastTime.toLocaleDateString('en-US', options);

    if (timeAgoDays > 0) {
        return `${formattedDate} - ${timeAgoDays === 1 ? '1 day ago' : `${timeAgoDays} days ago`}`;
    } else {
        return `${formattedDate} - ${timeAgoHours === 0 ? 'less than an hour ago' : timeAgoHours === 1 ? '1 hour ago' : `${timeAgoHours} hours ago`}`;
    }
}

function List({ data }) {
    let formattedTime = null;
    // console.log(data)
    if (data) {
        formattedTime = convertTime(data.updated_at);
    }

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
                                <p className='text-gray-500 '>
                                    {formattedTime ? formattedTime :
                                        `Updated ${data.updated_at}`
                                    }
                                </p>
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