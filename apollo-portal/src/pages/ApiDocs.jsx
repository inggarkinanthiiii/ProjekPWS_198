export default function ApiDocs() {
  return (
    <div style={{ height: "100vh" }}>
      <iframe
        src="http://localhost:5000/api-docs"
        style={{
          width: "100%",
          height: "100%",
          border: "none",
        }}
        title="Swagger API Docs"
      />
    </div>
  );
}
