import BookItem from "./BookItem";
import "./BookList.css";

function BookList({ books, onUpdate, onDelete }) {
  if (books.length === 0) {
    return (
      <div className="empty-state">
        No books yet. Add your first book above!
      </div>
    );
  }

  return (
    <div className="book-list">
      {books.map((book) => (
        <BookItem
          key={book.id}
          book={book}
          onUpdate={onUpdate}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}

export default BookList;
