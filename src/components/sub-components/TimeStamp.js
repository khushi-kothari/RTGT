export function convertTime(timestamp) {
  const currentTime = new Date();
  const pastTime = new Date(timestamp);

  const timeDifference = Math.floor((currentTime - pastTime) / 1000); // in seconds

  const timeAgoHours = Math.floor(timeDifference / 3600); // convert to hours
  const timeAgoDays = Math.floor(timeAgoHours / 24); // convert to days

  const options = { month: "long", day: "numeric", year: "numeric" };
  const formattedDate = pastTime.toLocaleDateString("en-US", options);

  if (timeAgoDays > 0) {
    return `${formattedDate} - ${
      timeAgoDays === 1 ? "1 day ago" : `${timeAgoDays} days ago`
    }`;
  } else {
    return `${formattedDate} - ${
      timeAgoHours === 0
        ? "less than an hour ago"
        : timeAgoHours === 1
        ? "1 hour ago"
        : `${timeAgoHours} hours ago`
    }`;
  }
}
