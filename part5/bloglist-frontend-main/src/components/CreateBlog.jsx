const CreateBlog = ({
  handleNew,
  setTitle,
  title,
  setAuthor,
  author,
  setUrl,
  url,
}) => {
  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={handleNew}>
        <div>
          <label>
            title
            <input
              type="text"
              value={title}
              onChange={({ target }) => setTitle(target.value)}
            />
          </label>
        </div>
        <div>
          <label>
            author
            <input
              type="text"
              value={author}
              onChange={({ target }) => setAuthor(target.value)}
            />
          </label>
        </div>
        <div>
          <label>
            url
            <input
              type="text"
              value={url}
              onChange={({ target }) => setUrl(target.value)}
            />
          </label>
        </div>
        <button type="submit">create</button>
      </form>
    </div>
  );
};
export default CreateBlog;
