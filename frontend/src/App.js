import { useEffect, useState } from "react";
import "./App.css";
import BookForm from "./components/BookForm";
import BookList from "./components/BookList";
import ServerTime from "./components/ServerTime";

const API_URL = "/api";

function App() {
  const [books, setBooks] = useState([]);
  const [status, setStatus] = useState("");

  useEffect(() => {
    loadBooks();
  }, []);

  const loadBooks = async () => {
    try {
      const response = await fetch(`${API_URL}/books`);
      const data = await response.json();
      setBooks(Array.isArray(data) ? data : []);
    } catch (error) {
      setStatus(`Error loading books: ${error.message}`);
    }
  };

  const createBook = async (title, author) => {
    try {
      const response = await fetch(`${API_URL}/books`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, author }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(
          error.errors ? error.errors.join(", ") : "Unable to create book",
        );
      }

      setStatus("Book created successfully!");
      await loadBooks();
    } catch (error) {
      setStatus(`Error: ${error.message}`);
    }
  };

  const updateBook = async (id, title) => {
    try {
      const response = await fetch(`${API_URL}/books/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title }),
      });

      if (!response.ok) {
        throw new Error("Unable to update book");
      }

      setStatus("Book updated successfully!");
      await loadBooks();
    } catch (error) {
      setStatus(`Error: ${error.message}`);
    }
  };

  const deleteBook = async (id, adminPassword) => {
    try {
      const response = await fetch(
        `${API_URL}/books/${id}?admin_password=${encodeURIComponent(adminPassword)}`,
        {
          method: "DELETE",
        },
      );

      if (response.status === 401) {
        setStatus("Unauthorized: incorrect password");
        return;
      }

      if (response.status === 404) {
        setStatus("Book not found");
        return;
      }

      if (!response.ok && response.status !== 204) {
        throw new Error("Unable to delete book");
      }

      setStatus("Book deleted successfully!");
      await loadBooks();
    } catch (error) {
      setStatus(`Error: ${error.message}`);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>📚 Books API Frontend</h1>
        <ServerTime apiUrl={API_URL} />
      </header>

      <main className="App-main">
        <section className="form-section">
          <h2>Add New Book</h2>
          <BookForm onSubmit={createBook} />
        </section>

        <section className="books-section">
          <h2>All Books</h2>
          <BookList books={books} onUpdate={updateBook} onDelete={deleteBook} />
        </section>

        {status && (
          <div
            className={`status-message ${status.includes("Error") || status.includes("Unauthorized") ? "error" : "success"}`}
          >
            {status}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
