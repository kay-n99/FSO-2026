import { useDispatch } from "react-redux";
import { setNotification } from "../reducers/notificationReducer";
import { appendAnecdote } from "../reducers/anecdoteReducer";

const AnecdoteForm = () => {
  const dispatch = useDispatch();

  const addAnecdote = async (e) => {
    e.preventDefault();
    const content = e.target.anec.value;
    e.target.anec.value = "";
    // const newAnecdote = await anecdoteService.createNew(content);
    dispatch(appendAnecdote(content));
    dispatch(setNotification(`you created '${content}'`, 5)); 
  };

  return (
    <>
      <h2>create new</h2>
      <form onSubmit={addAnecdote}>
        <div>
          <input name="anec" />
        </div>
        <button type="submit">create</button>
      </form>
    </>
  );
};

export default AnecdoteForm;