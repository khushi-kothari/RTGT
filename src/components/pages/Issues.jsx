import React, { useEffect, useState } from 'react'
import Header from '../sub-components/Header'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import axios from 'axios';
import List from '../sub-components/List'
import { convertTime } from '../sub-components/TimeStamp';
import { isDark } from '../sub-components/isDark';


function Issues() {
    const [results, setResults] = useState([])
    const [callFetch, setCallFetch] = useState(false);
    const [urls, setUrls] = useState();
    const [url, setUrl] = useState('https://api.github.com/search/issues?q=label:goodfirstissue&sort:updatedat')

    useEffect(() => {
        if (callFetch) {
            const search = async () => {
                try {
                    const accessToken = import.meta.env.ACCESS_TOKEN;
                    let apiUrl = { url };
                    const response = await axios.get(apiUrl, {
                        headers: {
                            'Authorization': `${accessToken}`,
                        },
                    });

                    const link = response.headers.get("link");
                    const links = link.split(",");
                    const urls = links.map(a => {
                        return {
                            url: a.split(';')[0].replace(">", "").replace("<", ""),
                            title: a.split(';')[1].substring(6, 10)
                        }
                    })
                    setUrls(urls);
                    console.log('links', urls)


                    const data = response.data.items;
                    setResults(data);
                    console.log("data items: ", data, "type : ", Array.isArray(data));
                    // console.log("Link in the header", response.headers.get("link"));
                } catch (error) {
                    console.error('Error:', error);
                    setResults([]);
                }
                setCallFetch(false);
            }
            search();
        }
    }, [callFetch]);

    return (
        <>
            <Header />
            {results.length > 0 ?
                results.slice(0, 5).map((r, k) => (
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
                            <a href={r.url} className='underline text-blue-600'>Go to issue <sup>↗</sup></a>
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

            {urls.map((u) => {
                <button
                    onClick={(e) => setUrl(u.url)}
                >{u.title}</button>
            })}
        </>
    )
}

export default Issues