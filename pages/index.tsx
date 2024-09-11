import Head from "next/head";
import React, { useState, FormEvent, ChangeEvent } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import styles from "../styles/Home.module.css";

interface UrlObject {
  key: string;
  url: string;
  clicked: number;
}

interface HomeProps {
  urlList: UrlObject[];
}

const Home: React.FC<HomeProps> = ({ urlList }) => {
  const [data, setData] = useState<UrlObject[]>(urlList);
  const [newUrl, setNewUrl] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleOnSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null); 

    try {
      const response = await fetch("/api/url", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: newUrl }),
      });

      const content: UrlObject = await response.json();
      if (response.ok) {
        setData([content, ...data]); 
        setNewUrl(""); 
      } else {
        setError(content as unknown as string || "Something went wrong");
      }
    } catch (err) {
      setError("Failed to shorten the URL. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (shortUrl: string) => {
    navigator.clipboard.writeText(shortUrl).then(
      () => {
        alert("Short URL copied to clipboard!");
      },
      (err) => {
        console.error("Failed to copy: ", err);
      }
    );
  };

  return (
    <>
      <Head>
        <title>Url-Shorten</title>
      </Head>
      <main className="content">
        <div className="container">
          <h2 className="mb-3 text-center">URL Shortener</h2>

          {/* Form for inputting URL */}
          <form className="d-flex flex-column align-items-center mb-3" onSubmit={handleOnSubmit}>
            <div className="input-group mb-2 w-100 w-md-75">
              <input
                type="text"
                className="form-control"
                placeholder="Enter a long URL"
                value={newUrl}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setNewUrl(e.target.value)}
                required
              />
              <button type="submit" className="btn btn-dark ms-2">
                {loading ? "Shortening..." : "Shorten"}
              </button>
            </div>

            {/* Error message */}
            {error && <div className="alert alert-danger w-100 w-md-75 text-center">{error}</div>}
          </form>

          {/* Output Table */}
          <div className="table-responsive custom-table-responsive">
            <table className="table table-hover table-bordered text-center">
              <thead className="table-dark">
                <tr>
                  <th scope="col">Long URL</th>
                  <th scope="col">Short URL</th>
                  <th scope="col">Clicks</th>
                  <th scope="col">Action</th>
                </tr>
              </thead>
              <tbody>
                {data.map((urlObject) => (
                  <tr key={urlObject.key}>
                    <td className="text-truncate" style={{ maxWidth: "300px" }}>
                      <a href={urlObject.url} target="_blank" rel="noopener noreferrer">
                        {urlObject.url}
                      </a>
                    </td>
                    <td>
                      <a href={`/api/${urlObject.key}`} target="_blank" rel="noopener noreferrer">
                        {urlObject.key}
                      </a>
                    </td>
                    <td>{urlObject.clicked}</td>
                    <td>
                      <button
                        className="btn btn-outline-secondary"
                        onClick={() => handleCopy(`/api/${urlObject.key}`)}
                      >
                        Copy
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </>
  );
};

export async function getServerSideProps() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL; 
  const res = await fetch(`${apiUrl}/api/url`);
  const urlList: UrlObject[] = await res.json();

  return {
    props: {
      urlList,
    },
  };
}

export default Home;
