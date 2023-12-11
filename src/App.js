import "./App.css";
import { useState } from "react";

function App() {
  const [errorMessage, setErrorMessage] = useState("");
  const [weatherDescription, setWeatherDescription] = useState("");
  const [weatherData, setWeatherData] = useState({
    temp: "",
    tempGap: "",
    name: "",
    description: "",
    humidity: "",
    sunrise: "",
  });

  const [isLoading, setIsLoading] = useState(true);
  const [hasSearched, setHasSearched] = useState(false);
  const [history, setHistory] = useState([]);

  const weatherImg = (
    <img
      className="weather-img"
      src={
        process.env.PUBLIC_URL +
        (weatherDescription.includes("cloud") ? "/cloud.png" : "/sun.png")
      }
      alt="weatherImg"
    />
  );

  const performSearch = () => {
    setHasSearched(true);
    setIsLoading(true);
    const query = document.getElementById("search").value;
    const searchTerm = document.querySelector("#search").value;
    fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${searchTerm}&appid=b43eaa8e92d8de618a731658c86573ca`
    )
      .then((response) => response.json())
      .then((data) => {
        setIsLoading(false);
        updateWeatherInfo(data);
        setErrorMessage("");
        console.log(data);
        setWeatherDescription(data.weather[0].description.toLowerCase());
        setHistory([
          ...history,
          { query: query, time: new Date().toLocaleString() },
        ]);
      })
      .catch((error) => {
        console.error("Error:", error);
        setErrorMessage("Pls enter a valid country or city");
      });
  };

  const deleteFromHistory = (index) => {
    setHistory(history.filter((_, i) => i !== index));
  };

  const searchFromHistory = (query) => {
    performSearch(query);
  };
  
  function updateWeatherInfo(data) {
    setWeatherData({
      temp: Math.round(data.main.temp - 273.15) + "°",
      tempGap:
        "H:" +
        Math.round(data.main.temp_max - 273.15) +
        "° L:" +
        Math.round(data.main.temp_min - 273.15) +
        "°",
      name: data.name + "," + data.sys.country,
      description: data.weather[0].description,
      humidity: "Humidity: " + data.main.humidity + "%",
      sunrise:
        new Date(data.sys.sunrise * 1000).toLocaleDateString() +
        " " +
        new Date(data.sys.sunrise * 1000).toLocaleTimeString(),
    });
  }

  return (
    <>
      <header>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Weather React App</title>
        <link
          href="https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css"
          rel="stylesheet"
        ></link>
      </header>

      <div>
        <div className="container">
          <div className="search-wrapper">
            <div className="search-box">
              <div className="input-wrapper">
                <input
                  type="text"
                  id="search"
                  className="search-bar"
                  onKeyDown={(e) => e.key === "Enter" && performSearch()}
                />
                <label htmlFor="search" className="placeholder-label">
                  Country
                </label>
              </div>
              <div className="search-btn" onClick={performSearch}>
                <i className="bx bx-search"></i>
              </div>
            </div>
          </div>

          <div className="weather-container">
            <div className="weather-wrapper">
              {hasSearched ? (
                isLoading ? (
                  <div className="loading-container">
                    <div className="loading">Loading</div>
                  </div>
                ) : errorMessage ? (
                  <div className="error-container">
                    <div id="error">{errorMessage}</div>
                  </div>
                ) : (
                  <div className="weather-info">
                    <div className="weather-content">
                      <div className="title">Today's Weather</div>
                      <div className="cloud-contain">{weatherImg}</div>
                    </div>

                    <div className="temp">{weatherData.temp}</div>
                    <div className="temp-gap">{weatherData.tempGap}</div>
                    <div className="other-info">
                      <div id="info-text1">{weatherData.name}</div>
                      <div id="info-text2">{weatherData.description}</div>
                      <div id="info-text3">{weatherData.humidity}</div>
                      <div id="info-text4">{weatherData.sunrise}</div>
                    </div>
                  </div>
                )
              ) : null}

              <div className="history-container">
                <div>Search history</div>
                <table>
                  <tbody>
                    {history.map((item, index) => (
                      <tr key={index}>
                        <td>{item.query}</td>
                        <td>{item.time}</td>
                        <td>
                          <button onClick={() => searchFromHistory(item.query)}>
                            Search
                          </button>
                          <button onClick={() => deleteFromHistory(index)}>
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
