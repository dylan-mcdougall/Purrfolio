import React, { useEffect, useState } from "react";
import './index.css'

function GrowthButton({ growth, symbol }) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [color, setColor] = useState("green");

  useEffect(() => {
    if(growth < 0) setColor("red");
    setIsLoaded(true)
  }, [])




  return (
    <div className="growth-button">
      {isLoaded ? (
        <div>
          <h2>Growth/Loss</h2>
          <h3>{symbol}</h3>
          <h3 className={color}>{growth}%</h3>
        </div>
      ) : (
        <h2>loading...</h2>
      )}
    </div>
  );
}

export default GrowthButton;
