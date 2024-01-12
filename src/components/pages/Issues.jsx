import React, { useEffect, useState } from 'react'
import Header from '../sub-components/Header'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import axios from 'axios';
import List from '../sub-components/List'
import { convertTime } from '../sub-components/TimeStamp';
import { isDark } from '../sub-components/isDark';
import { doc, writeBatch } from 'firebase/firestore';


function Issues() {
    const [results, setResults] = useState([]);
    const [repos, setRepos] = useState([]);
    const [callFetch, setCallFetch] = useState(false);
    const [urls, setUrls] = useState();
    const [url, setUrl] = useState('https://api.github.com/search/issues?q=label:goodfirstissue&sort=updated&order=desc')

    useEffect(() => {
        //console.log("url, and urls: ", url, urls);
        console.log('url Changed : "', url, '"');
        // console.log("Results : ", results)
        setCallFetch(true);
    }, [url])

    useEffect(() => {
        if (callFetch) {
            const search = async () => {
                try {
                    const accessToken = import.meta.env.ACCESS_TOKEN;
                    const response = await axios.get(url, {
                        headers: {
                            'Authorization': `${accessToken}`,
                        },
                    });

                    const link = response.headers.get("link");
                    console.log('link : ', link)
                    const links = link.split(", ");
                    const urls = links.map(a => {
                        return {
                            url: a.split(';')[0].replace(">", "").replace("<", ""),
                            title: a.split(';')[1].substring(6, a.split(';')[1].length - 1)
                        }
                    })
                    setUrls(urls);
                    console.log('links', links, urls);
                    // setCallFetch(true);

                    const data = response.data.items;
                    const reposResult = data.map(async (d) => {
                        const secondResponse = await fetch(d.repository_url);
                        const secondData = await secondResponse.json();
                        return secondData;
                    });

                    const secondResults = await Promise.all(reposResult);
                    // setResults((prevResults) => [
                    //     // ...prevResults,
                    //     data.map((item, index) => ({
                    //         item,
                    //         repos: secondResults[index],
                    //     })),
                    // ]);
                    setResults(data);
                    console.log("data items: ", data, "type : ", Array.isArray(data));
                } catch (error) {
                    console.error('Error:', error);
                    setResults([]);
                }
                setCallFetch(false);
            }
            search();
        }
    }, [callFetch, urls]);

    useEffect(() => {
        console.log('results ', results);
        // const batch = writeBatch(db);
        // const addRepos = async () => {
        //     try {
        //         results.map((r) => {
        //             // console.log("single item ", r);
        //             const id = (r.id).toString();
        //             const docRef = doc(db, "issues", id);
        //             const payload = {
        //                 id: r.id,
        //                 assignees: r.assignees.length,
        //                 created_at: r.created_at,
        //                 updated_at: r.updated_at,
        //                 html_url: r.html_url,
        //                 state: r.state,
        //                 title: r.title,
        //                 labels: r.labels,
        //                 repo: {

        //                 },
        //                 user: {
        //                     avatar_url: r.user.avatar_url,
        //                     login: r.user.login
        //                 }
        //             }
        //             // console.log('payload : ', payload);
        //             batch.set(docRef, payload);
        //         });
        //         await batch.commit();
        //     } catch (err) {
        //         console.error(err);
        //     }
        // }
        // addRepos();

    }, [results])

    return (
        <>
            <div className='m-4'>
                <Header />
                {results.length > 0 ?
                    results.map((r, k) => (
                        <React.Fragment key={k}>
                            <div className='my-10 mx-12'>
                                <h1>{r.title}</h1>
                                <p className=' text-gray-300'>{convertTime(r.updated_at)}</p>
                                {r.labels.length > 0 &&
                                    r.labels.map((l, index) => (
                                        <React.Fragment key={index}>
                                            {/* backgroundColor : #${l[i].color};  */}
                                            <button
                                                style={{ 'backgroundColor': `#${l.color}`, }}
                                                className={`${isDark(l.color) ? "text-white " : "text-black "}bg-opacity-95 mr-4 p-2 my-2 rounded-md`}
                                            >{l.name}</button>
                                        </React.Fragment>
                                    ))
                                }
                                <br></br>
                                <p>{r.state}</p>
                                <a href={r.html_url} className='underline text-blue-600'>Go to issue <sup>↗</sup></a>
                                <div className='flex'>
                                    <img src={r.user.avatar_url}
                                        className='h-8 w-8 rounded-full mr-2' />
                                    <p>{r.user.login}</p>
                                </div>
                                <p>{r.assignees.length} assignee{r.assignees.length > 1 ? 's' : ''}</p>
                            </div>
                            <hr />
                        </React.Fragment>
                    ))
                    :
                    <>Loading...</>
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

                {urls?.map((u) => {
                    return (
                        <button key={u.title}
                            className='my-10 px-4 py-2 bg-gray-300 rounded-md mx-2 cursor-pointer'
                            onClick={() => setUrl(u.url.trim())}>
                            {u.title}
                        </button>
                    );
                })}
            </div>
        </>
    )
}

export default Issues