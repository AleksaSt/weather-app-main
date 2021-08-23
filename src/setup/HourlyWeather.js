import React, {useState} from 'react'
import {Card, Spinner, Modal, Button} from 'react-bootstrap'
// import indexCSS from './index.module.css'
import hourlyCSS from './hourly.module.css'


const api = {
  key: 'c3512f3ec8bd5a8b7c26d9756efd841c',
  base: 'https://api.openweathermap.org/data/2.5/' 
}

const HourlyWeather = () => {

  const [weather, setWeather] = useState({});
  const [query, setQuery] = useState('');
  const [hourly, setHourly] = useState([]);
  const [error, setError] = useState(null)
  const [show, setShow] = useState(false)
  const [loading, setLoading] = useState(false)

  const search = evt => {
    if(evt.key === 'Enter'){
      setLoading(true)
      fetch(`${api.base}weather?q=${query}&units=metric&APPID=${api.key}`)
      .then(res => res.json())
      .then(result => {
        fetch(`${api.base}onecall?lat=${result.coord.lat}&lon=${result.coord.lon}&appid=${api.key}`)
        .then(res => res.json())
        .then(resultDaily => {
          setWeather(resultDaily)
          setShow(true)
          setLoading(false)
          console.log(resultDaily)
          resultDaily.hourly.length = 24
          setHourlyFiltered(resultDaily.hourly, 3)
        })
      }).catch(err => {
        setError(err.message);
        setWeather({})
        setLoading(false)
      })     
    }
  }

  
  const hourlyFiltered = (hourly, nth) => {
    return hourly.filter((e, i) => i % nth === nth - 1);
  }

  const setHourlyFiltered = function(hourly, nth){
    let filteredHourly = hourlyFiltered(hourly, nth)
    setHourly(filteredHourly)
  }


  function Example() {
    return (
      <>
        <Modal show={error}>
          <Modal.Header>
            <Modal.Title>Unexpected Error</Modal.Title>
          </Modal.Header>
          <Modal.Body>Location does not exist</Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={() => setError(null)} >
              close
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  }

  const dateBuilder = (d) => {
    let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
    let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  
    let day = days[d.getDay()]
    let date = d.getDate()
    let month = months[d.getMonth()]
    let year = d.getFullYear()
  
    return `${day}, ${date}th ${month}, ${year}`
  }

  const WeatherCard = () => {
    return <>
     <Card style={{ width: '18rem' }} className={hourlyCSS.hourlyWeatherCard}>
      <Card.Img variant="top" src="holder.js/100px180" />
      <Card.Body>
        <Card.Title>Hourly Weather</Card.Title>
          {(typeof hourly != 'undefined') ? (
            <div>{hourly.map(hour => (
              <div>
                <div>Temperature: {Math.round(hour.temp - 273.15)}°C</div>
                <div>Feels Like: {hour.feels_like}°C</div>
                <div>Pressure: {hour.pressure }hPa</div>
                <div>Humidity: {hour.humidity}%</div>
                <div>Visibility: {hour.visibility }m</div>
                <div>Wind Speed: {hour.wind_speed}m/s</div>
              </div>
            ))}</div>
          ) : ('')}
        </Card.Body>
    </Card>    
      </>
  }
  
  return (
    <>   
      <div>
        <input type="text" placeholder='Search...' onChange={e => setQuery(e.target.value)} value={query} onKeyPress={search}/>
      </div>
      <div className={hourlyCSS.hourlyDateBuilder}>
        {dateBuilder(new Date())}
      </div>
      {/* {loading ? <div className={indexCSS.spinnerContainer}><Spinner animation="border" variant="dark" className={indexCSS.spinner} /></div> : null} */}
      {show && <WeatherCard />}
      {error && <Example />}
    </>
  );
}

export default HourlyWeather;


