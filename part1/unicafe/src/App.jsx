import { useState } from "react";

const StatisticLine = (props) => {
  return(
    <>
      <td>{props.text}</td> 
      <td>{props.value}</td> 
    </>
  )
}

const Statistics = (props) => {
  const all = props.good + props.neutral + props.bad;
  if(all <= 0){
    return(
        <p>No feedback given</p>
    )
  }
  return (
    <>
      <table>
        <tbody>
          <tr><StatisticLine text="good" value={props.good} /></tr>
          <tr><StatisticLine text="neutral" value={props.neutral} /></tr>
          <tr><StatisticLine text="bad" value={props.bad} /></tr>
          <tr><StatisticLine text="all" value={all} /></tr>
          <tr><StatisticLine text="average" value={(props.good - props.bad) / (all)} /></tr>
          <tr><StatisticLine text="positive" value={`${props.good / all * 100} %`} /></tr>
        </tbody>
      </table>
      <p>
      
      
      
      
      
      
      </p>
    </>
  )
}

const Button = (props) => {
  return(
    <button onClick={props.func}>{props.name}</button>
  )
  
}

const App = () => {
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);

  return (
    <div>
      <h2>give feedback</h2>
      <Button func={() => setGood(good + 1)} name={'good'} />
      <Button func={() => setNeutral(neutral + 1)} name={'neutral'} />
      <Button func={() => setBad(bad + 1)} name={'bad'} />
      <h2>statistics</h2>
      <Statistics good={good} neutral={neutral} bad={bad} />
    </div>
  );
}

export default App;
