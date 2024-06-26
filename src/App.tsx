import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import WeatherChart from './components/WeatherChart';
import Grid from '@mui/material/Unstable_Grid2'; // Grid version 2
import Indicator from './components/Indicator';
import Summary from './components/Summary';
import ControlPanel from './components/ControlPanel';
import BasicTable from './components/BasicTable';


function App() {
  const [count, setCount] = useState(0)

  return (
    <>

      <Grid container spacing={5}>
        <Grid xs={12} sm={4} md={3} lg={2}>1
          <Grid xs={6} md={4} lg={2}>
            <Indicator title='Precipitación' subtitle='Probabilidad' value={0.13} />
          </Grid>
        </Grid>
        <Grid xs={6} sm={4} md={3} lg={2}>2
          <Grid xs={6} sm={4} md={3} lg={2}>
            <Summary></Summary>
          </Grid>
        </Grid>
        <Grid xs={6} sm={4} md={3} lg={2}>3
          <Grid xs={12} md={6} lg={9} >
            <BasicTable></BasicTable>
          </Grid>
        </Grid>
        <Grid xs={12} sm={4} md={3} lg={2}>4
          <Grid xs={12} lg={2}>
            <ControlPanel></ControlPanel>
          </Grid>
        </Grid>
        <Grid xs={6} sm={4} md={6} lg={2}>5
          <Grid xs={12} lg={10}>
            <WeatherChart></WeatherChart>
          </Grid>
        </Grid>
        <Grid xs={6} sm={4} md={6} lg={2}>6

        </Grid>
      </Grid>
    </>
  )
}

export default App
