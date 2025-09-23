import React, { useState } from 'react';
import './App.css';

function App() {
  const [expression, setExpression] = useState('');
  const [result, setResult] = useState('');

  const handleClick = (value) => {
    setExpression((prev) => prev + value);
  };

  const handleDelete = () => {
    setExpression((prev) => prev.slice(0, -1));
  };

  const handleClear = () => {
    setExpression('');
    setResult('');
  };

  const handleEqual = () => {
    try {
      const evalResult = eval(expression);
      setResult(evalResult.toString());
    } catch {
      setResult('Error');
    }
  };

  return (
    <div className="calculator-container">
      <div className="calculator">
         <h2 className="calc-title">Calculator</h2>
        <div className="display">
          <div className="expression">{expression || '0'}</div>
          <div className="result">{result}</div>
        </div>

        <div className="buttons">
          <button className="clear" onClick={handleClear}>C</button>
          <button onClick={handleDelete}>DEL</button>
          <button onClick={() => handleClick('%')}>%</button>
          <button className="operator" onClick={() => handleClick('/')}>÷</button>

          {[7, 8, 9].map(num => (
            <button key={num} onClick={() => handleClick(num.toString())}>{num}</button>
          ))}
          <button className="operator" onClick={() => handleClick('*')}>×</button>

          {[4, 5, 6].map(num => (
            <button key={num} onClick={() => handleClick(num.toString())}>{num}</button>
          ))}
          <button className="operator" onClick={() => handleClick('-')}>−</button>

          {[1, 2, 3].map(num => (
            <button key={num} onClick={() => handleClick(num.toString())}>{num}</button>
          ))}
          <button className="operator" onClick={() => handleClick('+')}>+</button>

          <button onClick={() => handleClick('0')}>0</button>
          <button onClick={() => handleClick('.')}>.</button>
          <button className="equal" onClick={handleEqual}>=</button>
        </div>
      </div>
    </div>
  );
}

export default App;
