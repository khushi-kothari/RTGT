import React, { useEffect, useState } from 'react'
import List from './List'
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import db from './firebase.js' //can import default export with any name
import { onSnapshot, collection } from "firebase/firestore";


function Fetch() {
    const [results, setResults] = useState([])
    const [callFetch, setCallFetch] = useState(true);

    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, 'results'), (snapshot) => {
            console.log('snapshot : ', snapshot);
            // setColors(snapshot.docs.map((doc) => doc.data()));
        });

        // Cleanup function to unsubscribe when component unmounts
        return () => unsubscribe();
    }, [db]);


    useEffect(() => {
        if (callFetch) {
            // console.log('callfetch changed : ', callFetch)
            const search = async () => {
                try {
                    const accessToken = import.meta.env.ACCESS_TOKEN;
                    let apiUrl = `https://api.github.com/search/repositories?q=js&language=javascript`;
                    const response = await axios.get(apiUrl, {
                        headers: {
                            'Authorization': `${accessToken}`,
                        },
                    });
                    setResults(response.data.items);
                    console.log("data items: ", response.data.items);
                } catch (error) {
                    console.error('Error:', error);
                    setResults([]);
                }
                setCallFetch(false);
            }
            search(); // Call the search function when the component mounts or when query or sort_var changes
        }
    }, [callFetch]);

    return (
        <>
            {results.length > 0 ?
                results.slice(0, 5).map((r, k) => (
                    < List data={r} key={k} />
                ))
                :
                <List />
            }
            <div
                onClick={() => {
                    setCallFetch(true)
                }}
                className={`flex flex-row items-center justify-center bg-neutral-200 hover:bg-neutral-300 my-20 py-3 rounded-md ${callFetch ? 'cursor-default' : 'cursor-pointer'} text-md`}
                style={{ pointerEvents: callFetch ? 'none' : 'auto' }}
            >
                <FontAwesomeIcon icon="fa-solid fa-arrows-rotate" className='px-2' />
                Refresh</div>
        </>
    )
}

export default Fetch