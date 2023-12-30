import React, { useState, useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import Header from './Header';

const StockCollection = () => {
  const graphRef = useRef(null);
  const graphInstanceRef = useRef(null);
  const [stocks, setStocks] = useState([]);
  const [stockPreference, setStockPreference] = useState(null);
  

  useEffect(() => {
    // Fetch stock data from the API
    const getStockData = async () => {
      const API_KEY = 'pk_f926b1ec5c7e4e0eaa57a818b8293df2'; 
      const apiUrl = `https://cloud.iexapis.com/stable/stock/market/list/mostactive?token=${API_KEY}`;
      try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error('Error at network response');
        }
        const data = await response.json();
        setStocks(data); 
      } catch (error) {
        console.error('Error occured while fetching the data!! :', error);
      }
    };

    getStockData();
  }, []);

  const displayGraph = async (symbol) => {
    setStockPreference(symbol);

    // Fetch historical data for the selected stock using 'symbol'
    try {
      const historyDataUrl = `https://cloud.iexapis.com/stable/stock/${symbol}/chart/1m?token=pk_f926b1ec5c7e4e0eaa57a818b8293df2`;
      const response = await fetch(historyDataUrl);
      if (!response.ok) {
        throw new Error('Network response was not ok.');
      }
      const data = await response.json();

      // Destroy the existing chart instance if it exists
      if (graphInstanceRef.current !== null) {
        graphInstanceRef.current.destroy();
      }

      const chartLabels = data.map((item) => item.date);
      const chartData = data.map((item) => item.close);

      // Create the chart
      const chart_display = graphRef.current.getContext('2d');
      graphInstanceRef.current = new Chart(chart_display, {
        type: 'line',
        data: {
          labels: chartLabels,
          datasets: [
            {
              label: `${symbol}`,
              data: chartData,
              borderColor: 'green',
              borderWidth: 2,
              fill: false,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            x: {display: true, title: {display: true, text: 'DATE'}},
            y: {display: true, title: {display: true, text: 'PRICE'}},
          },
        },
      });
    } catch (error) {
      console.error('Error fetching historical data:', error);
    }
  };

  return (
    <>
    <Header/>
    <div className="stock-container">
      <h1 style={{color:"navy"}}> Live Stock List</h1>
      <div className="display-stock">
        <ul className="stock-list">
          {stocks.map((stock) => (
            <li key={stock.symbol} className="stock-item" onClick={() => displayGraph(stock.symbol)}>
              <strong>{stock.symbol}</strong>: {stock.companyName} - ${stock.latestPrice}
            </li>
          ))}
        </ul>
        {stockPreference && (
          <div className="chart-container">
            <canvas ref={graphRef} width={500} height={500}></canvas>
          </div>
        )}
      </div>
    </div>
    </>
  );
};

export default StockCollection;