import "./App.css";

function App() {
  const weatherImg = <img className="weather-img" src={process.env.PUBLIC_URL + '/cloud.png'} alt='weatherImg' />;

  return (
    <div className="App">
      <header>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Weather React App</title>
        <link
          href="https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css"
          rel="stylesheet"
        ></link>
      </header>

      <body>
        <div className="container">
          <div className="search-wrapper">
          <div className="search-box">
            <div class="input-wrapper">
              <input type="text" id="search" className="search-bar" />
              <label for="search" className="placeholder-label">
                Country
              </label>
            </div>
            <div className='search-btn'>
            <i className="bx bx-search"></i>
            </div>
          </div>
          </div>

   <div className="weather-wrapper">
          <div className="weather-box">
            <div className="info">
            <div className="left-info">
              <div className="title">Today's Weather</div>
              <div className="temp">26°</div>
              <div className="temp-gap">H:16° L:26°</div>
              <div className="location">Johnor, MY</div>
              </div>
  
              <div className="right-info">
              <div className="cloud-contain">{weatherImg}</div>
              <div className="weather">Clouds</div>
              <div className="Humidity">Humidity:58%</div>
              <div className="time">Johnor, MY</div>
              </div>
            </div>
            </div>
</div>
        </div>
      </body>
    </div>
  );
}

export default App;
