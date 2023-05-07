import React, { useState } from "react";
import { useFetch } from "../hooks/useFetch";

// -- Just for Demo purposes --

const URLS = {
  USERS: "https://jsonplaceholder.typicode.com/users",
  POSTS: "https://jsonplaceholder.typicode.com/posts",
  COMMENTS: "https://jsonplaceholder.typicode.com/comments",
};

export function Home() {
  const [url, setUrl] = useState(URLS.USERS);
  const { data, isLoading, isError, refresh } = useFetch({ url });

  return (
    <>
      <header>
        <h1>Custom Hooks</h1>
      </header>
      <>
        <div>
          <label>
            <input type='radio' checked={url === URLS.USERS} onChange={() => setUrl(URLS.USERS)} />
            Users
          </label>
          <label>
            <input type='radio' checked={url === URLS.POSTS} onChange={() => setUrl(URLS.POSTS)} />
            Posts
          </label>
          <label>
            <input
              type='radio'
              checked={url === URLS.COMMENTS}
              onChange={() => {
                setUrl(URLS.COMMENTS);
                refresh(URLS.COMMENTS);
              }}
            />
            Comments
          </label>
        </div>
        {isLoading ? <h1>Loading...</h1> : isError ? <h1>Error</h1> : <pre>{JSON.stringify(data, null, 2)}</pre>}
      </>
    </>
  );
}
