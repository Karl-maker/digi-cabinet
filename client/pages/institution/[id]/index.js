import { useRouter } from "next/router";
import Head from "next/head";
import { fetchAPI } from "../../../api/connect";
import { createContext, useEffect, useState } from "react";
import getConfig from "../../../config/config";
import { MdVerified } from "react-icons/md";
import DotLoader from "react-spinners/DotLoader";
import DisplayUnknownObject from "../../../utils/tools/displayUnknownObject";
import { capitalizeFirstLetter } from "../../../utils/tools/characterManipulation";

const config = getConfig();

const Institution = () => {
  const router = useRouter();
  const { id } = router.query;

  const [institution, setInstitution] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState({});

  useEffect(async () => {
    const results = await fetchAPI(`api/institution/${id}`, { method: "get" })
      .then((results) => {
        return results;
      })
      .catch((error) => {
        setError(error);
      });

    if ((await results.status) !== 200) {
      setError(await results.json());
    } else {
      var res = await results.json();
      res.institution.registered_date = new Date(
        res.institution.registered_date
      );
      setInstitution(res.institution);
      setIsLoading(false);
    }
  }, []);

  return (
    <div>
      <Head>
        <title>Digi Cabinet | Institution</title>
      </Head>
      <div className="main-container">
        <h2>Institution</h2>
        {!isLoading ? (
          <div className="container primary">
            <div className="institution-header">
              <img src={`${config.api.BASE_URL}${institution.school_logo}`} />
              <div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <h3 style={{ marginRight: "0.8em" }}>
                    {capitalizeFirstLetter(institution.name)}
                  </h3>
                  {institution.verified ? (
                    <MdVerified style={{ color: "#74b9ff" }} />
                  ) : (
                    <div></div>
                  )}
                </div>
                <p>{institution.description}</p>
              </div>
            </div>
            <hr></hr>
            <div>
              <p style={{ fontSize: "0.7em" }}>{`Id: ${id}`}</p>
              <ul style={{ display: "flex", marginLeft: "-2.5em" }}>
                <li
                  style={{ fontSize: "0.7em", marginRight: "1em" }}
                >{`Country: ${institution.country}`}</li>
                <li
                  style={{ fontSize: "0.7em", marginRight: "1em" }}
                >{`Type: ${institution.type}`}</li>
                <li
                  style={{ fontSize: "0.7em", marginRight: "1em" }}
                >{`Level: ${institution.level}`}</li>
                <li
                  style={{ fontSize: "0.7em", marginRight: "1em" }}
                >{`Profile Created: ${
                  institution.registered_date.getMonth() +
                  "/" +
                  institution.registered_date.getDate() +
                  "/" +
                  institution.registered_date.getFullYear()
                }`}</li>
              </ul>
            </div>
            <div className="container secondary">
              <h5>More Info</h5>
              <DisplayUnknownObject object={institution.info} />
            </div>
          </div>
        ) : (
          <div>
            {error.message ? (
              <div className="container primary">
                <p>{error.message}</p>
              </div>
            ) : (
              <div
                style={{
                  margin: "0 auto",
                  textAlign: "center",
                  height: "100%",
                }}
              >
                <DotLoader color="#ffff" loading={isLoading} size={100} />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Institution;
