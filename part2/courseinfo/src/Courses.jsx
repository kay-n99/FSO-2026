const Header = (props) => <h1>{props.course}</h1>

const Content = ({parts}) => (
  <div>
    {parts.map(p => <Part key={p.id} part={p} />)}
  </div>
)

const Part = ({part}) => {
  return(<p>
    {part.name} {part.exercises}
  </p>)
}

const Total = ({parts}) => {
  const total = parts.reduce((acc, cur) => acc + cur.exercises, 0 ) 
  return <p><b>total of {total} exercises</b></p>
}

const Course = ({course}) => {
  return (
    <>
      <div>
        <Header course={course.name} />
        <Content parts={course.parts} />
        <Total
          parts={
            course.parts
          }
        />
      </div>
    </>
  )
}

export default Course