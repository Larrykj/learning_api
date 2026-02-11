import { useEffect, useState } from "react";
import "./ApiEndpoints.css";

const DEFAULTS = {
  add: { num1: "15", num2: "3" },
  check_age: { age: "18" },
  greet: { name: "Reader" },
  user_info: { name: "Alex Johnson", age: "28", city: "Portland" },
  search: { q: "whale" },
  create: { title: "New Adventure", author: "Jane Smith" },
  update: { title: "Updated Adventure" },
  delete: { admin_password: "secret123" },
};

function ApiEndpoints({ apiUrl, sampleBookId, onAfterMutation }) {
  const [results, setResults] = useState({});
  const [loading, setLoading] = useState({});
  const [selectedEndpoint, setSelectedEndpoint] = useState(null);
  const [inputs, setInputs] = useState({
    add: DEFAULTS.add,
    check_age: DEFAULTS.check_age,
    greet: DEFAULTS.greet,
    user_info: DEFAULTS.user_info,
    books_search: DEFAULTS.search,
    books_create: DEFAULTS.create,
    books_update: { id: "", ...DEFAULTS.update },
    books_delete: { id: "", ...DEFAULTS.delete },
  });

  useEffect(() => {
    if (!sampleBookId) return;
    setInputs((prev) => ({
      ...prev,
      books_update: {
        ...prev.books_update,
        id: prev.books_update.id || String(sampleBookId),
      },
      books_delete: {
        ...prev.books_delete,
        id: prev.books_delete.id || String(sampleBookId),
      },
    }));
  }, [sampleBookId]);

  const libraryManagement = [
    {
      key: "books_index",
      method: "GET",
      path: "/books",
      title: "📚 Browse Collection",
      description: "View all books in the library collection.",
      icon: "📚",
      format: (body) => formatBookList(body),
    },
    {
      key: "books_search",
      method: "GET",
      path: "/books/search",
      title: "🔍 Search Catalog",
      description: "Find books by title or author.",
      icon: "🔍",
      fields: [
        {
          name: "q",
          label: "Search Query",
          placeholder: "Enter title or author",
        },
      ],
      format: (body) => formatSearchResult(body),
    },
    {
      key: "books_create",
      method: "POST",
      path: "/books",
      title: "📝 Add New Book",
      description: "Add a new book to the library collection.",
      icon: "📝",
      fields: [
        { name: "title", label: "Book Title", placeholder: "Enter book title" },
        {
          name: "author",
          label: "Author Name",
          placeholder: "Enter author name",
        },
      ],
      mutates: true,
      format: (body, status) =>
        status === 201
          ? `✅ Successfully added "${body?.title || ""}" by ${body?.author || ""} to the collection`
          : "❌ Failed to add book to collection",
    },
    {
      key: "books_update",
      method: "PATCH",
      path: "/books/:id",
      title: "✏️ Update Book Info",
      description: "Edit book information in the catalog.",
      icon: "✏️",
      fields: [
        { name: "id", label: "Book ID", placeholder: "Enter book ID" },
        {
          name: "title",
          label: "New Title",
          placeholder: "Enter updated title",
        },
      ],
      mutates: true,
      needsId: true,
      format: (body) =>
        body
          ? `✅ Updated book title to: "${body.title || ""}"`
          : "❌ Book update failed",
    },
    {
      key: "books_delete",
      method: "DELETE",
      path: "/books/:id",
      title: "🗑️ Remove Book",
      description: "Remove a book from the library collection (admin only).",
      icon: "🗑️",
      fields: [
        { name: "id", label: "Book ID", placeholder: "Enter book ID" },
        {
          name: "admin_password",
          label: "Admin Password",
          type: "password",
          placeholder: "Enter admin password",
        },
      ],
      mutates: true,
      needsId: true,
      format: (_, status) =>
        status === 204
          ? "✅ Book successfully removed from collection"
          : "❌ Book removal failed - check password",
    },
  ];

  const libraryTools = [
    {
      key: "home",
      method: "GET",
      path: "/home",
      title: "🏠 Library Welcome",
      description: "Get a welcome message from the library system.",
      icon: "🏠",
      format: (body) => body?.message || "No welcome message available.",
    },
    {
      key: "about_me",
      method: "GET",
      path: "/about_me",
      title: "👤 Library Info",
      description: "View information about the library system.",
      icon: "👤",
      format: (body) =>
        body
          ? `Library: ${body.name || "Unknown"} | System: ${body.learning_style || "Unknown"}`
          : "No library information available.",
    },
    {
      key: "server_time",
      method: "GET",
      path: "/server_time",
      title: "🕐 Current Time",
      description: "Check the current library server time.",
      icon: "🕐",
      format: (body) =>
        body?.server_time
          ? `Library server time: ${new Date(body.server_time).toLocaleString()}`
          : "Server time unavailable.",
    },
    {
      key: "greet",
      method: "GET",
      path: "/greet",
      title: "👋 Patron Greeting",
      description: "Get a personalized greeting for library patrons.",
      icon: "👋",
      fields: [
        {
          name: "name",
          label: "Patron Name",
          placeholder: "Enter visitor name",
        },
      ],
      format: (body) =>
        body?.greeting ? body.greeting : "No greeting available.",
    },
    {
      key: "user_info",
      method: "GET",
      path: "/user_info",
      title: "📋 Patron Profile",
      description: "Generate a patron profile summary.",
      icon: "📋",
      fields: [
        { name: "name", label: "Full Name", placeholder: "Enter full name" },
        { name: "age", label: "Age", type: "number", placeholder: "Enter age" },
        { name: "city", label: "City", placeholder: "Enter city" },
      ],
      format: (body) => body?.user?.summary || "No profile summary available.",
    },
    {
      key: "check_age",
      method: "GET",
      path: "/check_age",
      title: "🎂 Library Card Eligibility",
      description: "Check if patron is eligible for a library card.",
      icon: "🎂",
      fields: [
        { name: "age", label: "Age", type: "number", placeholder: "Enter age" },
      ],
      format: (body) => {
        if (body?.status === "allowed") {
          return `✅ Eligible for library card! ${body.message}`;
        } else if (body?.status === "denied") {
          return `❌ Not eligible: ${body.message}`;
        }
        return "No eligibility response.";
      },
    },
    {
      key: "add",
      method: "GET",
      path: "/add",
      title: "🧮 Fee Calculator",
      description:
        "Calculate library fees (late fees, replacement costs, etc.).",
      icon: "🧮",
      fields: [
        {
          name: "num1",
          label: "Base Fee ($)",
          type: "number",
          placeholder: "Enter base amount",
        },
        {
          name: "num2",
          label: "Additional Fee ($)",
          type: "number",
          placeholder: "Enter additional amount",
        },
      ],
      format: (body) =>
        body
          ? `Total Fee: $${body.input_a} + $${body.input_b} = $${body.sum}`
          : "No calculation available.",
    },
  ];

  const setResult = (key, next) => {
    setResults((prev) => ({ ...prev, [key]: next }));
  };

  const updateField = (key, field, value) => {
    setInputs((prev) => ({
      ...prev,
      [key]: { ...prev[key], [field]: value },
    }));
  };

  const runEndpoint = async (endpoint) => {
    const currentInputs = inputs[endpoint.key] || {};
    const idValue = currentInputs.id || sampleBookId;
    const needsId = endpoint.needsId && !idValue;
    if (needsId) {
      setResult(endpoint.key, {
        error: "No book id available. Add a book first.",
      });
      return;
    }

    setLoading((prev) => ({ ...prev, [endpoint.key]: true }));
    setResult(endpoint.key, null);

    const path = endpoint.needsId
      ? endpoint.path.replace(":id", idValue)
      : endpoint.path;

    const url = new URL(apiUrl + path, window.location.origin);

    if (endpoint.method === "GET" || endpoint.method === "DELETE") {
      Object.entries(currentInputs).forEach(([key, value]) => {
        if (key === "id" || value === "") return;
        url.searchParams.set(key, value);
      });
    }

    const options = { method: endpoint.method, headers: {} };
    if (endpoint.method === "POST" || endpoint.method === "PATCH") {
      options.headers["Content-Type"] = "application/json";
      const bodyPayload = { ...currentInputs };
      delete bodyPayload.id;
      options.body = JSON.stringify(bodyPayload);
    }

    try {
      const response = await fetch(url.toString(), options);
      const contentType = response.headers.get("content-type") || "";
      const isJson = contentType.includes("application/json");
      const body = isJson ? await response.json() : await response.text();

      const message = endpoint.format
        ? endpoint.format(body, response.status)
        : "Success.";

      setResult(endpoint.key, {
        status: response.status,
        message,
        ok: response.ok,
      });

      if (endpoint.mutates && response.ok && onAfterMutation) {
        onAfterMutation();
      }
    } catch (error) {
      setResult(endpoint.key, { error: error.message });
    } finally {
      setLoading((prev) => ({ ...prev, [endpoint.key]: false }));
    }
  };

  const formatBookList = (body) => {
    if (!Array.isArray(body)) {
      return "📚 No books returned from library catalog.";
    }
    if (body.length === 0) {
      return "📚 Library collection is currently empty.";
    }
    const titles = body
      .slice(0, 3)
      .map((book) => book.title)
      .filter(Boolean);
    const extra = body.length > 3 ? ` (+${body.length - 3} more)` : "";
    return `📚 Found ${body.length} books in collection. Recent titles: ${titles.join(", ")}${extra}`;
  };

  const formatSearchResult = (body) => {
    if (!body || !Array.isArray(body.books)) {
      return "🔍 No search results returned.";
    }
    if (body.results_count === 0) {
      return `🔍 No matches found for "${body.query || "search term"}".`;
    }
    const titles = body.books
      .slice(0, 3)
      .map((book) => book.title)
      .filter(Boolean);
    const extra =
      body.results_count > 3 ? ` (+${body.results_count - 3} more)` : "";
    return `🔍 Found ${body.results_count} matches. Top results: ${titles.join(", ")}${extra}`;
  };

  const renderEndpointButton = (endpoint) => {
    const isDisabled = endpoint.needsId && !sampleBookId;

    return (
      <button
        key={endpoint.key}
        className={`endpoint-button method-${endpoint.method.toLowerCase()}`}
        onClick={() => setSelectedEndpoint(endpoint)}
        disabled={isDisabled}
      >
        <span className="endpoint-button-icon">{endpoint.icon}</span>
        <div className="endpoint-button-content">
          <div className="endpoint-button-title">{endpoint.title}</div>
          <div className="endpoint-button-meta">
            <span
              className={`endpoint-button-method method-${endpoint.method.toLowerCase()}`}
            >
              {endpoint.method}
            </span>
            <span className="endpoint-button-path">/api{endpoint.path}</span>
          </div>
          <div className="endpoint-button-description">
            {endpoint.description}
          </div>
        </div>
        {isDisabled && (
          <span className="endpoint-button-hint">⚠️ Add book first</span>
        )}
      </button>
    );
  };

  const renderEndpointForm = (endpoint) => {
    const result = results[endpoint.key];
    const isLoading = loading[endpoint.key];
    const currentInputs = inputs[endpoint.key] || {};
    const isDisabled = endpoint.needsId && !(currentInputs.id || sampleBookId);

    return (
      <div className="endpoint-form-view">
        <button
          className="back-button"
          onClick={() => {
            setSelectedEndpoint(null);
            setResult(endpoint.key, null);
          }}
        >
          ← Back to Endpoints
        </button>

        <div className="endpoint-form-header">
          <span className="endpoint-form-icon">{endpoint.icon}</span>
          <h3>{endpoint.title}</h3>
        </div>

        <div className="endpoint-form-meta">
          <span
            className={`endpoint-method method-${endpoint.method.toLowerCase()}`}
          >
            {endpoint.method}
          </span>
          <span className="endpoint-path">/api{endpoint.path}</span>
        </div>

        <p className="endpoint-form-description">{endpoint.description}</p>

        {endpoint.fields && (
          <div className="endpoint-form-fields">
            {endpoint.fields.map((field) => (
              <label key={field.name} className="endpoint-field">
                <span className="field-label">{field.label}</span>
                <input
                  type={field.type || "text"}
                  value={currentInputs[field.name] || ""}
                  onChange={(event) =>
                    updateField(endpoint.key, field.name, event.target.value)
                  }
                  placeholder={field.placeholder || ""}
                  className="field-input"
                />
              </label>
            ))}
          </div>
        )}

        {endpoint.mutates && (
          <div className="endpoint-warning">
            ⚠️ This operation will modify library data
          </div>
        )}

        <button
          className={`execute-button method-${endpoint.method.toLowerCase()}`}
          type="button"
          disabled={isLoading || isDisabled}
          onClick={() => runEndpoint(endpoint)}
        >
          {isLoading ? "Processing..." : `Execute ${endpoint.method} Request`}
        </button>

        {isDisabled && (
          <div className="endpoint-hint">
            ⚠️ Add a book first to enable this operation
          </div>
        )}

        {result && (
          <div
            className={`endpoint-response ${result.ok ? "response-success" : "response-error"}`}
          >
            <div className="response-header">
              {result.ok ? "✅ Success" : "❌ Error"}
              {result.status && (
                <span className="response-status">Status: {result.status}</span>
              )}
            </div>
            <div className="response-body">
              {result.error ? `Error: ${result.error}` : result.message}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <section className="endpoints-section">
      {!selectedEndpoint ? (
        <>
          <div className="endpoints-header">
            <h2>📖 Library Management System</h2>
            <p>Select an operation to view details and execute API requests</p>
          </div>

          <div className="library-section">
            <h3 className="library-section-title">
              📚 Book Collection Management
            </h3>
            <p className="library-section-description">
              Manage your library's book collection
            </p>
            <div className="endpoint-buttons-grid">
              {libraryManagement.map((endpoint) =>
                renderEndpointButton(endpoint),
              )}
            </div>
          </div>

          <div className="library-section">
            <h3 className="library-section-title">
              🛠️ Library Tools & Services
            </h3>
            <p className="library-section-description">
              Utility functions for library operations
            </p>
            <div className="endpoint-buttons-grid">
              {libraryTools.map((endpoint) => renderEndpointButton(endpoint))}
            </div>
          </div>
        </>
      ) : (
        renderEndpointForm(selectedEndpoint)
      )}
    </section>
  );
}

export default ApiEndpoints;
