import React, { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Fetch from '../pages/Fetch'

function Refresh() {
    const [callFetch, setCallFetch] = useState(false);

    return (
        <>
            <Fetch callFetch={callFetch} />
            <div
                onClick={() => {
                    setCallFetch(true)
                    setTimeout(() => {
                        setCallFetch(false);
                    }, 200);
                }}
                className={`flex flex-row items-center justify-center bg-neutral-200 hover:bg-neutral-300 my-20 py-3 rounded-md ${callFetch ? 'cursor-default' : 'cursor-pointer'} text-md`}
                style={{ pointerEvents: callFetch ? 'none' : 'auto' }}
            >
                <FontAwesomeIcon icon="fa-solid fa-arrows-rotate" className='px-2' />
                Refresh</div>
        </>
    )
}

export default Refresh