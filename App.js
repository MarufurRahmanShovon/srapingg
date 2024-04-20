import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [items, setItems] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await fetch('/scrape', {
        credentials: 'same-origin' // Include this option
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      setItems(data);
      setError(null); // Reset error state
    } catch (error) {
      console.error('Error fetching items:', error);
      setError('An error occurred while fetching items.'); // Set error state
    }
  };
  

  return (
    <div className="App">
      <h1>Scraped Items</h1>
      {error && <div className="error">{error}</div>}
      <div className="items">
        {items.map((item, index) => (
          <div className="item" key={index}>
            <h2>{item.title}</h2>
            <p>Price: {item.price}</p>
            <img src={item.image} alt={item.title} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
