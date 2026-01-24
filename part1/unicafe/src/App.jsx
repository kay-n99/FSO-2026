import { useState } from "react";

const Statistics = (props) => {
  const all = props.good + props.neutral + props.bad;

  return (
    <>
      <h2>statistics</h2>
      <p>
        good {props.good}
        <br />
        neutral {props.neutral}
        <br />
        bad {props.bad}
        <br />
        all {all}
        <br />
        average {(props.good - props.bad) / (all)}
        <br />
        positive {props.good / all * 100} %
      </p>
    </>
  )
}

const App = () => {
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);

  return (
    <div>
      <h2>give feedback</h2>
      <button onClick={() => setGood(good + 1)}>good</button>
      <button onClick={() => setNeutral(neutral + 1)}>neutral</button>
      <button onClick={() => setBad(bad + 1)}>bad</button>
      <Statistics good={good} neutral={neutral} bad={bad} />
    </div>
  );
}

export default App;
