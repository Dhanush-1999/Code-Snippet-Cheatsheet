export default function SnippetItem({ _id, title, code, onDelete, onExplain }) {
  return (
    <div className="snippet-item">
      <h3>{title}</h3>
      <pre>
        <code>{code}</code>
      </pre>
      <div className="snippet-buttons">
        <button onClick={() => onDelete(_id)}>Delete</button>
        <button onClick={() => onExplain(code)}>Explain with AI ✨</button>
      </div>
    </div>
  );
}