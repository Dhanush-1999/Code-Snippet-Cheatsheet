import SnippetItem from './SnippetItem';

export default function SnippetList({ snippets, onDelete, onExplain }) {
  return (
    <div>
      <h2>My Snippets</h2>
      {snippets.length === 0 ? (
        <p>No snippets yet. Add one!</p>
      ) : (
        snippets.map((snippet) => (
          <SnippetItem
            key={snippet._id}
            _id={snippet._id}
            title={snippet.title}
            code={snippet.code}
            onDelete={onDelete}
            onExplain={onExplain}
          />
        ))
      )}
    </div>
  );
}