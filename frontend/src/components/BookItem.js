import "./BookItem.css";

function BookItem({ book, onUpdate, onDelete }) {
  const handleRename = () => {
    const newTitle = prompt("Enter new title:", book.title);
    if (newTitle && newTitle.trim()) {
      onUpdate(book.id, newTitle);
    }
  };

  const handleDelete = () => {
    const password = prompt("Enter admin password to delete:");
    if (password !== null) {
      onDelete(book.id, password);
    }
  };

  return (
    <div className="book-item">
      <div className="book-content">
        <h3 className="book-title">{book.title}</h3>
        <p className="book-author">by {book.author}</p>
        {book.id && <span className="book-id">ID: {book.id}</span>}
      </div>
      <div className="book-actions">
        <button onClick={handleRename} className="btn btn-edit">
          Edit
        </button>
        <button onClick={handleDelete} className="btn btn-delete">
          Delete
        </button>
      </div>
    </div>
  );
}

export default BookItem;
