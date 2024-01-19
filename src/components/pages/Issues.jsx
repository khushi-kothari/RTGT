import React, { useEffect, useState } from 'react'
import Header from '../sub-components/Header'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import axios from 'axios';
import List from '../sub-components/List'
import { convertTime } from '../sub-components/TimeStamp';
import { isDark } from '../sub-components/isDark';
import { doc, writeBatch, getDocs, collection, query, orderBy, limit } from 'firebase/firestore';
import db from '../../firebase.js' //can import default export with any name

function Issues() {
    const [issues, setIssues] = useState([]);
    const [fsData, setFsData] = useState([]);
    const [callFetch, setCallFetch] = useState(false);
    const [urls, setUrls] = useState();
    const [url, setUrl] = useState('https://api.github.com/search/issues?q=label:goodfirstissue&sort=updated&order=desc')
    const [language, setLanguage] = useState([]);
    const [labels, setLabels] = useState([]);


    //Get all Data from firestore - also set language and label lists
    useEffect(() => {
        const getUniqueLanguagesAndLabelsCount = async () => {
            try {
                const snapshot = await getDocs(collection(db, 'issue'), orderBy('timestamp'));
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

                return { languageCounts, labelCounts };
            } catch (error) {
                console.error('Error fetching data from Firestore:', error);
                throw error;
            }
        };

        getUniqueLanguagesAndLabelsCount();
    }, [callFetch]);


    //Set CallFetch to true when page changes
    useEffect(() => {
        console.log('url Changed : "', url, '"');
        setCallFetch(true);
    }, [url])

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

    // All github api fetch calls and handling of pagination links
    useEffect(() => {
        if (callFetch) {
            const search = async () => {
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

            search();
        }
    }, [callFetch, url]);

    //Storing data to firestore
    useEffect(() => {
        // Assuming you have Firebase Firestore initialized as 'db'
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

        if (issues.length > 0) {
            saveDataToFirestore();
        }
    }, [issues]);

    return (
        <>
            <div className='m-4'>
                <Header langOptions={language} labelOptions={labels} />
                {fsData.length > 0 ?
                    fsData.slice(0, 11).map((r, k) => (
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
                                <a href={r.html_url}
                                    className='underline text-blue-600'
                                    target='_blank'>Go to issue <sup>↗</sup></a>
                                <div className='flex'>
                                    <img src={r.user.avatar_url}
                                        className='h-8 w-8 rounded-full mr-2' />
                                    <p>{r.user.login}</p>
                                </div>
                                <p>{r.assignees} assignee{r.assignees > 1 ? 's' : ''}</p>
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