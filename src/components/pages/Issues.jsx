import React, { useEffect, useState } from 'react'
import Header from '../sub-components/Header'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import axios from 'axios';
import List from '../sub-components/List'
import { convertTime } from '../sub-components/TimeStamp';
import { isDark } from '../sub-components/isDark';
import { doc, writeBatch, getDocs, collection, query, orderBy, limit, where } from 'firebase/firestore';
import db from '../../firebase.js' //can import default export with any name

function Issues() {
    const [issues, setIssues] = useState([]);
    const [fsData, setFsData] = useState([]);
    const [callFetch, setCallFetch] = useState(false);
    const [urls, setUrls] = useState();
    const [url, setUrl] = useState('https://api.github.com/search/issues?q=label:goodfirstissue&sort=updated&order=desc');
    const [language, setLanguage] = useState([]);
    const [labels, setLabels] = useState([]);
    const [filterQuery, setFilterQuery] = useState({
        languages: [], // An array for multi-select languages
        labels: [],    // An array for multi-select labels
        sortBy: '',
    });
    const [filteredData, setFilteredData] = useState();
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const [currentItems, setCurrentItems] = useState([]);

    const handleFilterChange = (key, value) => {
        setFilterQuery(prevState => ({
            ...prevState,
            [key]: value,
        }));
        console.log("selected Option from dropdown: ", key, ": ", value);
    }

    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const totalPages = Math.ceil(filteredData?.length / itemsPerPage);
    let visiblePages = []; // Initialize with no pages.

    // Always show the first page.
    visiblePages.push(1);

    // Logic to add ellipses and intermediate pages
    if (totalPages <= 5) {
        // If there are 5 or fewer total pages, show them all directly.
        for (let i = 2; i < totalPages; i++) {
            visiblePages.push(i);
        }
    } else {
        // More complex case: more than 5 total pages.
        if (currentPage <= 3) {
            // If on one of the first three pages, show pages up to 4.
            for (let i = 2; i <= 4; i++) {
                visiblePages.push(i);
            }
            visiblePages.push('...');
        } else if (currentPage >= totalPages - 2) {
            // If on one of the last three pages, show ellipsis and the last three pages.
            visiblePages.push('...');
            for (let i = totalPages - 3; i < totalPages; i++) {
                visiblePages.push(i);
            }
        } else {
            // In the middle of the pagination range, show current page surrounded by ellipses.
            visiblePages.push('...', currentPage - 1, currentPage, currentPage + 1, '...');
        }
    }

    // Always show the last page if more than 1 page exists.
    if (totalPages > 1) {
        visiblePages.push(totalPages);
    }




    // Recursive function to fetch repo data for each issue
    const fetchAdditionalData = async (item) => {
        try {
            const response = await axios.get(item.repository_url); // Replace with your actual endpoint URL
            const additionalData = response.data;
            const repo = {
                id: additionalData.id,
                updated_at: additionalData.updated_at,
                avatar_url: additionalData.owner.avatar_url,
                name: additionalData.name,
                full_name: additionalData.full_name,
                description: additionalData.description,
                forks_count: additionalData.forks_count,
                stargazers_count: additionalData.stargazers_count,
                watchers_count: additionalData.watchers_count,
                language: additionalData.language,
                topics: additionalData.topics
            }
            return { ...item, repo };
        } catch (error) {
            console.error('Error fetching additional data:', error);
            return item;
        }
    };

    const fetchApiData = async () => {
        try {
            const accessToken = import.meta.env.ACCESS_TOKEN;
            const response = await axios.get(url, {
                headers: {
                    Authorization: `${accessToken}`,
                },
            });

            const link = response.headers.get('link');
            const links = link.split(', ');
            const urls = links.map((a) => {
                return {
                    url: a.split(';')[0].replace('>', '').replace('<', ''),
                    title: a.split(';')[1].substring(6, a.split(';')[1].length - 1),
                };
            });
            setUrls(urls);
            const data = response.data.items;

            // Fetch additional data for each item in the response array in parallel
            const updatedData = await Promise.all(data.map((u) => fetchAdditionalData(u)));

            setIssues(updatedData);
            console.log('API data:', updatedData);
        } catch (error) {
            console.error('Error:', error);
            setIssues([]);
        }
        setCallFetch(false);
    };

    const saveDataToFirestore = async () => {
        const batch = writeBatch(db);

        try {
            issues.forEach((issue) => {
                const docRef = doc(db, 'issue', issue.id.toString());
                const labels = issue.labels.map((label) => ({
                    color: label.color,
                    name: label.name,
                }));
                const timestamp = new Date(issue.updated_at).getTime();
                const payload = {
                    assignees: issue.assignees.length,
                    created_at: issue.created_at,
                    html_url: issue.html_url,
                    id: issue.id,
                    labels: labels,
                    repo: {
                        id: issue.repo.id,
                        updated_at: issue.repo.updated_at,
                        avatar_url: issue.repo.avatar_url,
                        name: issue.repo.name,
                        full_name: issue.repo.full_name,
                        description: issue.repo.description,
                        forks_count: issue.repo.forks_count,
                        stargazers_count: issue.repo.stargazers_count,
                        watchers_count: issue.repo.watchers_count,
                        language: issue.repo.language,
                        topics: issue.repo.topics
                    },
                    state: issue.state,
                    title: issue.title,
                    updated_at: issue.updated_at,
                    timestamp: timestamp,
                    user: {
                        avatar_url: issue.user.avatar_url,
                        login: issue.user.login,
                    },
                };

                batch.set(docRef, payload);
            });

            await batch.commit();
            console.log('Data saved to Firestore.');
        } catch (error) {
            console.error('Error saving data to Firestore:', error);
        }
    };

    const getLanguagesLabelsFromFirestore = async () => {
        try {
            // const snapshot = await getDocs(query(collection(db, 'issue'), where('repo.language', "==", 'Python'), orderBy('timestamp', 'desc'), limit(15)));
            // const snapshot = await getDocs(query(collection(db, 'issue'), where('repo.topics', 'array-contains', 'goodfirstissue'), orderBy('timestamp', 'desc'), limit(15)));
            const snapshot = await getDocs(query(collection(db, 'issue'), orderBy('timestamp', 'desc')));
            const data = snapshot.docs.map((doc) => ({
                ...doc.data(),
            }));
            setFsData(data);
            console.log('Firestore sorted Data: ', data);

            const languageCounts = [];
            const labelCounts = [];

            data.forEach((dataItem) => {
                const language = dataItem.repo.language;
                if (language) {
                    // Check if the language is already in languageCounts
                    const existingLanguage = languageCounts.find((item) => item.label === language);

                    if (existingLanguage) {
                        existingLanguage.subtext++;
                    } else {
                        // If not, add it to languageCounts with a count of 1
                        languageCounts.push({ label: language, subtext: 1 });
                    }
                }

                const labels = dataItem.labels;

                if (labels && labels.length > 0) {
                    labels.forEach((labelObj) => {
                        const labelName = labelObj.name;

                        // Check if the label is already in labelCounts
                        const existingLabel = labelCounts.find((item) => item.label === labelName);

                        if (existingLabel) {
                            existingLabel.subtext++;
                        } else {
                            // If not, add it to labelCounts with a count of 1
                            labelCounts.push({ label: labelName, subtext: 1 });
                        }
                    });
                }
            });

            console.log('Languages and counts: ', languageCounts);
            console.log('Labels and counts: ', labelCounts);

            setLanguage(languageCounts);
            setLabels(labelCounts);

            return { data, languageCounts, labelCounts };
        } catch (error) {
            console.error('Error fetching data from Firestore:', error);
            throw error;
        }
    };

    //Get all Data from firestore - also set language and label lists
    //Fetching it only once now because of more read requests
    useEffect(() => {
        getLanguagesLabelsFromFirestore();
    }, []);

    // All github api fetch calls and handling of pagination links
    useEffect(() => {
        if (callFetch) {
            fetchApiData();
        }
    }, [callFetch]);

    //Storing data to firestore
    useEffect(() => {
        if (issues.length > 0) {
            saveDataToFirestore();
        }
    }, [issues]);

    //Set CallFetch to true when page changes
    useEffect(() => {
        console.log('url Changed : "', url, '"');
        setCallFetch(true);
    }, [url])

    useEffect(() => {
        setFilteredData(fsData);
    }, [fsData])

    // Filters
    useEffect(() => {
        let languageFiltered = [];
        let labelFiltered = [];

        // Apply language filter if necessary
        if (filterQuery.languages.length > 0) {
            languageFiltered = fsData.filter(item =>
                filterQuery.languages.includes(item.repo.language)
            );
        }

        // Apply label filter if necessary
        if (filterQuery.labels.length > 0) {
            labelFiltered = fsData.filter(item =>
                item.labels.some(label => filterQuery.labels.includes(label.name))
            );
        }

        // Combine filters results (union), remove duplicates
        let unionFiltered = [...languageFiltered, ...labelFiltered];
        let uniqueFiltered = Array.from(new Set(unionFiltered.map(item => JSON.stringify(item))))
            .map(item => JSON.parse(item));

        // Sort by stars or forks if applicable
        if (filterQuery.sortBy === 'stars') {
            uniqueFiltered.sort((a, b) => b.repo.stargazers_count - a.repo.stargazers_count);
        } else if (filterQuery.sortBy === 'forks') {
            uniqueFiltered.sort((a, b) => b.repo.forks_count - a.repo.forks_count);
        }
        setFilteredData(uniqueFiltered);
        setCurrentPage(1);
        console.log('filteredResults: ', filteredData, uniqueFiltered);
    }, [filterQuery]);

    useEffect(() => {
        // console.log('filteredResults: ', filteredData);
        // Any other actions that depend on the updated filteredData
        // Pagination 
        const indexOfLastItem = currentPage * itemsPerPage;
        const indexOfFirstItem = indexOfLastItem - itemsPerPage;
        const newCurrentItems = filteredData?.slice(indexOfFirstItem, indexOfLastItem);
        setCurrentItems(newCurrentItems);
    }, [filteredData]);


    return (
        <>
            <div className='m-4'>
                <Header langOptions={language} labelOptions={labels} onFilterChange={handleFilterChange} />
                {filteredData?.length > 0 ?
                    filteredData.slice(0, 15).map((r, k) => (
                        <React.Fragment key={k}>
                            <div className='my-10 mx-12'>
                                <div>
                                    <h1>{r.title}</h1>
                                    <p className='text-gray-300'>{convertTime(r.updated_at)}</p>
                                    <span className=' text-md font-semibold text-gray-600'>Language: </span><button className='p-2 rounded-md bg-gray-100 my-2 text-gray-800'>{r.repo.language}</button>
                                    <br />
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
                                    <div className='flex py-3'>
                                        <img src={r.user.avatar_url}
                                            className='h-8 w-8 rounded-full mr-2' />
                                        <p>{r.user.login}</p>
                                    </div>
                                    <div className='text-sm flex flex-col md:float-right'>
                                        <p className='pb-1 pl-2 md:pl-3'>{r.assignees} assignee{r.assignees > 1 ? 's' : ''}</p>
                                        <p className={`my-2 w-1/3 text-center md:w-full py-2 px-4 ${r.state === 'open' ? 'bg-yellow-400' : 'bg-red-300'} rounded-full`}>{r.state}</p>
                                        <a href={r.html_url}
                                            className='underline text-blue-600 pl-2'
                                            target='_blank'>Go to issue <sup>↗</sup></a>
                                    </div>
                                </div>
                                <div className='text-sm flex flex-wrap mt-3'>
                                    <button className='p-3 bg-neutral-100 rounded-lg m-2 ml-0'>
                                        <FontAwesomeIcon icon="fa-solid fa-code-fork" className='px-2 text-xl' />
                                        {r.repo.forks_count}</button>
                                    <button className='p-3 bg-neutral-100 rounded-lg m-2'>
                                        <FontAwesomeIcon icon="fa-solid fa-star" className='px-2 text-xl' />
                                        {r.repo.stargazers_count}</button>
                                    <button className='p-3 bg-neutral-100 rounded-lg m-2'>
                                        <FontAwesomeIcon icon="fa-solid fa-eye" className='px-2 text-xl' />
                                        {r.repo.watchers_count}</button>
                                </div>
                            </div>
                            <hr />
                        </React.Fragment>
                    ))
                    :
                    <>Loading...</>
                }

                {/* // Pagination controls */}
                {/* {currentItems.length > 0 && (  
                    <div className="pagination">
                        {Array(Math.ceil(filteredData.length / itemsPerPage)).fill().map((_, i) => (
                            <button key={i} onClick={() => paginate(i + 1)}>{i + 1}</button>
                        ))}
                    </div>
                )} */}

                <div className="flex justify-center items-center space-x-2 my-4">
                    <button
                        onClick={() => setCurrentPage((prevPage) => Math.max(prevPage - 1, 1))}
                        disabled={currentPage === 1}
                        className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 disabled:opacity-50"
                    >
                        Prev
                    </button>
                    {visiblePages.map((page, index) => (
                        <React.Fragment key={index}>
                            {page === '...' ? (
                                <span className="px-4 py-2 bg-gray-200 text-gray-800 rounded">...</span>
                            ) : (
                                <button
                                    className={`px-4 py-2 ${currentPage === page ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'} rounded hover:bg-blue-500 hover:text-white`}
                                    onClick={() => setCurrentPage(page)}
                                >
                                    {page}
                                </button>
                            )}
                        </React.Fragment>
                    ))}
                    <button
                        onClick={() => setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>


                {/* Fetch new Data */}
                {/* <div
                    onClick={() => {
                        setCallFetch(true)
                    }}
                    className={`flex flex-row items-center justify-center bg-neutral-200 hover:bg-neutral-300 my-20 py-3 rounded-md ${callFetch ? 'cursor-default' : 'cursor-pointer'} text-md`}
                    style={{ pointerEvents: callFetch ? 'none' : 'auto' }}
                >
                    <FontAwesomeIcon icon="fa-solid fa-arrows-rotate" className='px-2' />
                    Refresh
                </div>
                {urls?.map((u) => {
                    return (
                        <button key={u.title}
                            className='my-10 px-4 py-2 bg-gray-300 rounded-md mx-2 cursor-pointer'
                            onClick={() => setUrl(u.url.trim())}>
                            {u.title}
                        </button>
                    );
                })} */}
            </div>
        </>
    )
}

export default Issues

// const getRepoList = async () => {
//     try {
//         const data = await getDocs(query(collection(db, 'issue'), orderBy('updated_at', 'desc'), limit(10)));
//         const sortedData = data.docs.map((doc) => ({
//             ...doc.data(),
//         }));
//         setFsData(sortedData);
//         console.log('Data from firestore : ', sortedData);
//     } catch (err) {
//         console.error(err);
//     }
// };