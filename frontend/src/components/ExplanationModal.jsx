export default function ExplanationModal({ explanation, onClose }) {
  if (!explanation) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <h2>AI Explanation</h2>
        <p style={{ whiteSpace: 'pre-wrap' }}>{explanation}</p>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
}