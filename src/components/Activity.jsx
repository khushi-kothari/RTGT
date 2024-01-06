// import React, { useEffect } from 'react'
// import axios from 'axios';

// useEffect(() => {
//     if (callFetch) {
//         // console.log('callfetch changed : ', callFetch)
//         const search = async () => {
//             try {
//                 const accessToken = import.meta.env.ACCESS_TOKEN;
//                 let apiUrl = `https://api.github.com/search/repositories?q=js&language=javascript`;
//                 const response = await axios.get(apiUrl, {
//                     headers: {
//                         'Authorization': `${accessToken}`,
//                     },
//                 });
//                 const data = response.data.items;
//                 setResults(data);
//                 console.log("data items: ", data, "type : ", Array.isArray(data));
//             } catch (error) {
//                 console.error('Error:', error);
//                 setResults([]);
//             }
//             setCallFetch(false);
//         }
//         search(); // Call the search function when the component mounts or when query or sort_var changes
//     }
// }, [callFetch]);

// function Activity() {
//     return (
//         <div>Activity</div>
//     )
// }

// export default Activity