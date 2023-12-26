import "./App.css";
import { useState, useReducer } from "react";

function App() {
  // const [errorMessage, setErrorMessage] = useState("");
  // const [weatherDescription, setWeatherDescription] = useState("");
  // const [isLoading, setIsLoading] = useState(true);
  // const [hasSearched, setHasSearched] = useState(false);
  // const [history, setHistory] = useState([]);
  // const [searchTerm, setSearchTerm] = useState("");
  const [weatherData, setWeatherData] = useState({
    temp: "",
    tempGap: "",
    name: "",
    description: "",
    humidity: "",
    sunrise: "",
  });

  const initialState = {
    errorMessage: "",
    weatherDescription: "",
    isLoading: true,
    hasSearched: false,
    history: [],
    searchTerm: "",
    weatherData: {
      temp: "",
      tempGap: "",
      name: "",
      description: "",
      humidity: "",
      sunrise: "",
    },
  };

  const reducer = (state, action) => {
    switch (action.type) {
      case "SET_ERROR_MESSAGE":
        return { ...state, errorMessage: action.payload };
      case "SET_WEATHER_DESCRIPTION":
        return { ...state, weatherDescription: action.payload };
      case "SET_IS_LOADING":
        return { ...state, isLoading: action.payload };
      case "SET_HAS_SEARCHED":
        return { ...state, hasSearched: action.payload };
      case "SET_HISTORY":
        return { ...state, history: action.payload };
      case "SET_SEARCH_TERM":
        return { ...state, searchTerm: action.payload };
      case "SET_WEATHER_DATA":
        return { ...state, weatherData: action.payload };
      default:
        return state;
    }
  };

  const [state, dispatch] = useReducer(reducer, initialState);
  const {
    errorMessage,
    weatherDescription,
    isLoading,
    hasSearched,
    history,
    searchTerm,
  } = state;
  // Example of dispatch usage
  const setSearchTerm = (search) => {
    dispatch({ type: "SET_SEARCH_TERM", payload: search });
  };

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

  const performSearch = (query) => {
    dispatch({ type: "SET_HAS_SEARCHED", payload: true });
    dispatch({ type: "SET_IS_LOADING", payload: true });

    fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${query}&appid=b43eaa8e92d8de618a731658c86573ca`
    )
      .then((response) => response.json())
      .then((data) => {
        dispatch({ type: "SET_IS_LOADING", payload: false });
        updateWeatherInfo(data);
        dispatch({ type: "SET_ERROR_MESSAGE", payload: "" });
        dispatch({
          type: "SET_WEATHER_DESCRIPTION",
          payload: data.weather[0].description.toLowerCase(),
        });

        const newRecord = {
          query: data.name + ", " + data.sys.country,
          time: new Date().toLocaleString(),
        };

        if (!history.some((record) => record.query === newRecord.query)) {
          dispatch({ type: "SET_HISTORY", payload: [...history, newRecord] });
        }
      })

      .catch((error) => {
        console.error("Error:", error);
        dispatch({ type: "SET_ERROR_MESSAGE", payload: error.message });
        dispatch({ type: "SET_IS_LOADING", payload: false });
      });
  };

  const deleteFromHistory = (index) => {
    dispatch({
      type: "SET_HISTORY",
      payload: history.filter((_, i) => i !== index),
    });
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

      <div className="container">
        <div className="search-wrapper">
          <div className="search-box">
            <div className="input-wrapper">
              <input
                type="text"
                id="search"
                className="search-bar"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) =>
                  e.key === "Enter" && performSearch(searchTerm)
                }
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
              {history.length === 0 ? (
                <div className="record">No Record</div>
              ) : (
                <table>
                  <tbody>
                    {history.map((item, index) => (
                      <div className="history-row">
                        <tr key={index} className="tr-container">
                          <div className="left">
                            <td>{item.query}</td>
                          </div>
                          <div className="right">
                            <td>{item.time}</td>
                            <td>
                              <button
                                className="iconBtn"
                                onClick={() => searchFromHistory(item.query)}
                              >
                                <i className="bx bx-search"></i>{" "}
                              </button>
                            </td>
                            <td>
                              <button
                                className="iconBtn"
                                onClick={() => deleteFromHistory(index)}
                              >
                                <i className="bx bx-trash"></i>{" "}
                              </button>
                            </td>
                          </div>
                        </tr>
                      </div>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
