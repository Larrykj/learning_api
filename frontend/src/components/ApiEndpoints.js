import { useEffect, useState } from "react";
import "./ApiEndpoints.css";

const DEFAULTS = {
  search: { q: "" },
  create: { title: "", author: "" },
  update: { title: "" },
  delete: { admin_password: "" },
};

function ApiEndpoints({ apiUrl, sampleBookId, onAfterMutation }) {
  const [results, setResults] = useState({});
  const [loading, setLoading] = useState({});
  const [selectedEndpoint, setSelectedEndpoint] = useState(null);
  const [inputs, setInputs] = useState({
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

  // ── Read Operations ──────────────────────────────────────────
  const readEndpoints = [
    {
      key: "api_status",
      method: "GET",
      path: "/status",
      title: "API Status",
      description: "Health check returning server time and total book count.",
      format: (body) =>
        body
          ? `Status: ${body.status} | Books: ${body.total_books} | Time: ${body.server_time}`
          : "No status available.",
    },
    {
      key: "api_stats",
      method: "GET",
      path: "/stats",
      title: "Collection Statistics",
      description:
        "Aggregated stats including book count, author count, and recent additions.",
      format: (body) =>
        body
          ? `Books: ${body.total_books} | Authors: ${body.total_authors}`
          : "No stats available.",
    },
    {
      key: "books_index",
      method: "GET",
      path: "/books",
      title: "List All Books",
      description: "Retrieve every book in the collection.",
      format: (body) => formatBookList(body),
    },
    {
      key: "books_search",
      method: "GET",
      path: "/books/search",
      title: "Search Books",
      description: "Find books by title or author using a search query.",
      fields: [
        {
          name: "q",
          label: "Search Query",
          placeholder: "Enter title or author",
        },
      ],
      format: (body) => formatSearchResult(body),
    },
  ];

  // ── Write Operations ─────────────────────────────────────────
  const writeEndpoints = [
    {
      key: "books_create",
      method: "POST",
      path: "/books",
      title: "Create Book",
      description: "Add a new book to the collection.",
      fields: [
        { name: "title", label: "Title", placeholder: "Enter book title" },
        {
          name: "author",
          label: "Author",
          placeholder: "Enter author name",
        },
      ],
      mutates: true,
      format: (body, status) =>
        status === 201
          ? `Created "${body?.title}" by ${body?.author}`
          : "Failed to create book.",
    },
    {
      key: "books_update",
      method: "PATCH",
      path: "/books/:id",
      title: "Update Book",
      description: "Edit the title of an existing book by its ID.",
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
          ? `Updated title to: "${body.title}"`
          : "Update failed.",
    },
    {
      key: "books_delete",
      method: "DELETE",
      path: "/books/:id",
      title: "Delete Book",
      description: "Remove a book from the collection. Requires admin password.",
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
          ? "Book deleted successfully."
          : "Deletion failed. Check the password.",
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
        error: "No book ID available. Add a book first.",
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
      return "No books returned.";
    }
    if (body.length === 0) {
      return "Collection is empty.";
    }
    const titles = body
      .slice(0, 3)
      .map((book) => book.title)
      .filter(Boolean);
    const extra = body.length > 3 ? ` (+${body.length - 3} more)` : "";
    return `Found ${body.length} books. Titles: ${titles.join(", ")}${extra}`;
  };

  const formatSearchResult = (body) => {
    if (!body || !Array.isArray(body.books)) {
      return "No results returned.";
    }
    if (body.results_count === 0) {
      return `No matches for "${body.query || ""}".`;
    }
    const titles = body.books
      .slice(0, 3)
      .map((book) => book.title)
      .filter(Boolean);
    const extra =
      body.results_count > 3 ? ` (+${body.results_count - 3} more)` : "";
    return `Found ${body.results_count} matches: ${titles.join(", ")}${extra}`;
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
          <span className="endpoint-button-hint">Add a book first</span>
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
          Back to All Endpoints
        </button>

        <div className="endpoint-form-header">
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
            This operation will modify data
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
            Add a book first to enable this operation
          </div>
        )}

        {result && (
          <div
            className={`endpoint-response ${result.ok ? "response-success" : "response-error"}`}
          >
            <div className="response-header">
              {result.ok ? "SUCCESS" : "ERROR"}
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
            <h2>API Endpoints</h2>
            <p>Select an endpoint to view details and execute requests</p>
          </div>

          <div className="library-section">
            <h3 className="library-section-title">Read Operations</h3>
            <p className="library-section-description">
              Retrieve data from the books collection
            </p>
            <div className="endpoint-buttons-grid">
              {readEndpoints.map((endpoint) =>
                renderEndpointButton(endpoint),
              )}
            </div>
          </div>

          <div className="library-section">
            <h3 className="library-section-title">Write Operations</h3>
            <p className="library-section-description">
              Create, update, or delete books in the collection
            </p>
            <div className="endpoint-buttons-grid">
              {writeEndpoints.map((endpoint) =>
                renderEndpointButton(endpoint),
              )}
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
