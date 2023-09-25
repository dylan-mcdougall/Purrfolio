import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { NavLink, Route, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import Chart from "react-apexcharts";

const StockDetailGraph = () => {
  const { ticker } = useParams()

  const[state, setState] = useState(null)
  const [histData, setHistData] = useState(null)
  const [dataArray, setDataArray]= useState(false)




  const makeDate = (date) => {
    const newDate = date.split('-').join(', ')

    return newDate
  }

  const collectGoodData = () => {
    const usableDataArr = []
    if (histData) {

      histData.historical.forEach(el => {



        usableDataArr.push({x: new Date(makeDate(el.date)), y: [el.open, el.high, el.low, el.close]})
      });
    }
    setDataArray(true)
    setState({
      options: {
        chart: {
          type: 'candlestick',
          height: 600
        },
        xaxis: {
          type: 'datetime'
        },
        yaxis: {
          tooltip: {
            enabled: true
          }
        },
      },
      series: [{
        data: usableDataArr
      }]
    })

  }



useEffect(() => {
  const fetchData1 = async () => {
    const result = await fetch(`https://financialmodelingprep.com/api/v3/historical-price-full/${ticker}?timeseries=30&apikey=${process.env.REACT_APP_FMP_API_KEY}`)
    result.json().then(json => {
        setHistData(json)

    })
  }
  fetchData1()
  }, [])

  useEffect(() => {
    if (histData && !dataArray){
      collectGoodData()
    }
  }, [collectGoodData])


  return (
    <div className="app">
      <div className="row">
        <div className="mixed-chart">
          {state ?
          <Chart
            options={state.options}
            series={state.series}
            type="candlestick"
            width="600"
          /> : <div>...loading</div>}
        </div>
      </div>
    </div>
  );
}

export default StockDetailGraph;
