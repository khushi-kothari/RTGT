import React, { useEffect, useState } from 'react'
import List from './List'
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import db from './firebase.js' //can import default export with any name
import { onSnapshot, collection, setDoc, doc, writeBatch } from "firebase/firestore";


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
                    const data = response.data.items;
                    setResults(data);
                    console.log("data items: ", data, "type : ", Array.isArray(data));

                    const batch = writeBatch(db);
                    data.map((result) => {
                        console.log("single item ", result);
                        const docRef = doc(db, "001", result.id);
                        const payload = {
                            description: result.description,
                            forks_count: result.forks_count,
                            full_name: result.full_name,
                            id: result.id,
                            owner: {
                                avatar_url: result.owner.avatar_url,
                            },
                            stargazers_count: result.stargazers_count,
                            updated_at: result.updated_at,
                            watchers_count: result.watchers_count
                        }
                        console.log('payload : ', payload);
                        batch.set(docRef, payload);
                    });
                    await batch.commit();

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