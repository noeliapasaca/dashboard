import { useEffect, useState } from 'react';

import './App.css'
import WeatherChart from './components/WeatherChart';
import Grid from '@mui/material/Unstable_Grid2'; // Grid version 2
import Indicator from './components/Indicator';
import Summary from './components/Summary';
import ControlPanel from './components/ControlPanel';
import BasicTable from './components/BasicTable';


function App() {
  const [count, setCount] = useState(0)
  let [indicators, setIndicators] = useState([])
  let [rowsTable, setRowsTable] = useState<
    { rangeHours: string; windDirection: string }[]>([]);
  let [datosGraficos, setDatosGraficos] = useState<any[][]>([]);

  var humidities: Array<[any, any]> = [["Hora", "Humedad"]];
  var nubosities: Array<[any, any]> = [["Hora", "Nubosidad"]];
  var temperatures: Array<[any, any]> = [["Hora", "Temperatura"]];



  {/* Hook: useEffect */ }

  useEffect(

    () => {
      (async () => {





        {/* Request */ }

        // let API_KEY = "d40b63a366fa600c76e1174e0a35caf9"
        // let response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=Guayaquil&mode=xml&appid=${API_KEY}`)
        // let savedTextXML = await response.text();



        {/* Del LocalStorage, obtiene el valor de las claves openWeatherMap y expiringTime */ }

        let savedTextXML = localStorage.getItem("openWeatherMap")!
        let expiringTime = localStorage.getItem("expiringTime")!





        {/* Estampa de tiempo actual */ }

        let nowTime = (new Date()).getTime();

        {/* Realiza la petición asicrónica cuando: 
            (1) La estampa de tiempo de expiración (expiringTime) es nula, o  
            (2) La estampa de tiempo actual es mayor al tiempo de expiración */}

        if (expiringTime === null || nowTime > parseInt(expiringTime)) {

          {/* Request */ }

          let API_KEY = "d40b63a366fa600c76e1174e0a35caf9"
          let response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=Guayaquil&mode=xml&appid=${API_KEY}`)
          savedTextXML = await response.text();


          {/* Diferencia de tiempo */ }

          let hours = 1
          let delay = hours * 3600000


          {/* En el LocalStorage, almacena texto en la clave openWeatherMap y la estampa de tiempo de expiración */ }

          localStorage.setItem("openWeatherMap", savedTextXML)
          localStorage.setItem("expiringTime", (nowTime + delay).toString())
        }



        {/* XML Parser */ }

        const parser = new DOMParser();
        const xml = parser.parseFromString(savedTextXML, "application/xml");

        {/* Arreglo para agregar los resultados */ }

        let dataToIndicators = new Array()

        {/* 
        Análisis, extracción y almacenamiento del contenido del XML 
        en el arreglo de resultados
        */}

        let city = xml.getElementsByTagName("name")[0].innerHTML
        dataToIndicators.push(["City", "name", city])

        let location = xml.getElementsByTagName("location")[1]

        let geobaseid = location.getAttribute("geobaseid")
        dataToIndicators.push(["Location", "geobaseid", geobaseid])

        let latitude = location.getAttribute("latitude")
        dataToIndicators.push(["Location", "Latitude", latitude])

        let longitude = location.getAttribute("longitude")
        dataToIndicators.push(["Location", "Longitude", longitude])

        let indicatorsElements = Array.from(dataToIndicators).map(
          (element) => <Indicator title={element[0]} subtitle={element[1]} value={element[2]} />
        )

        {/* Modificación de la variable de estado mediante la función de actualización */ }

        setIndicators(indicatorsElements)

        let vientos = Array.from(xml.getElementsByTagName("time")).map(
          (timeElement) => {
            let fromAttr = timeElement.getAttribute("from");
            let toAttr = timeElement.getAttribute("to");
      
            let rangeHours =
            fromAttr?.split("T")[1] + " - " + toAttr?.split("T")[1];
      
            let windDirection =
            timeElement
              .getElementsByTagName("windDirection")[0]
              .getAttribute("deg")! +
            " " +
            timeElement
              .getElementsByTagName("windDirection")[0]
              .getAttribute("code")!;
      
            return { rangeHours: rangeHours!, windDirection: windDirection };
          }
          );
      
          vientos = vientos.slice(0, 8);
          setRowsTable(vientos);
      
          const kelvinToCelsius = (kelvin: number) => kelvin - 273.15;
      
          Array.from(xml.getElementsByTagName("time")).map((timeNode) => {
          const from = timeNode.getAttribute("from");
          const temperatureNode =
            timeNode.getElementsByTagName("temperature")[0];
          const humidityNode = timeNode.getElementsByTagName("humidity")[0];
          const cloudsNode = timeNode.getElementsByTagName("clouds")[0];
      
          if (
            from &&
            temperatureNode &&
            humidityNode &&
            cloudsNode
          ) {
            const temperatura = kelvinToCelsius(
            parseInt(temperatureNode.getAttribute("value")!)
            );
            const humedad = parseInt(humidityNode.getAttribute("value")!);
            const nubosidad = parseInt(cloudsNode.getAttribute("all")!);
            const hora =
            new Date(from).getHours() + ":" + new Date(from).getMinutes();
      
            temperatures.push([hora, temperatura]);
            humidities.push([hora, humedad]);
            nubosities.push([hora, nubosidad]);
          }
          });
      
          setDatosGraficos([
          humidities,
          nubosities,
          temperatures,
          ]);

      })()
    }, [])


  return (
    <>

      <Grid container spacing={4}>

        <Grid xs={6} md={4} lg={6}>
          {indicators[0]}

        </Grid>



        <Grid xs={6} md={4} lg={6}>
          {/* <Indicator title='Precipitación' subtitle='Probabilidad' value={0.13} /> */}
          {indicators[1]}

        </Grid>


        <Grid xs={6} md={4} lg={6}>
          {/* <Indicator title='Precipitación' subtitle='Probabilidad' value={0.13} /> */}
          {indicators[2]}

        </Grid>

        <Grid xs={6} md={4} lg={6}>
          {/* <Indicator title='Precipitación' subtitle='Probabilidad' value={0.13} /> */}
          {indicators[3]}

        </Grid>

        <Grid xs={6} md={4} lg={12}>
          <Summary></Summary>
        </Grid>

        <Grid xs={6} md={4} lg={12}>

          {/* 4. Envíe la variable de estado (dataTable) como prop (input) del componente (BasicTable) */}
          <BasicTable rows={rowsTable}></BasicTable>

        </Grid>



        <Grid xs={12} lg={12}>
          <ControlPanel listas={datosGraficos}></ControlPanel>
        </Grid>


{/* 
        <Grid xs={6} md={4} lg={10}>
          <WeatherChart></WeatherChart>
        </Grid> */}



      </Grid>
    </>
  )







}

export default App
