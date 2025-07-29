import { useState } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';


function SnippetForm({ onAddSnippet }) {
    const [title, setTitle] = useState('');
    const [code, setCode] = useState('');

    const handleSubmit=(event)=>{
        event.preventDefault();
        if (!title || !code) {
            alert('Please fill out both the title and code fields.');
            return;
        }
        onAddSnippet({title,code});
        setTitle('');
        setCode('');
    };

    return(
        <form onSubmit={handleSubmit}>
            <h2>Add a New Snippet</h2>
            <input 
                type="text" placeholder="Enter title..." 
                value={title} onChange={(e)=>setTitle(e.target.value)}
            />
            <CodeMirror
                value={code} height="200px" extensions={[javascript({jsx:true})]} 
                onChange={(value)=>setCode(value)} theme="dark"
            />
            <button type="submit">Add Snippet</button>
        </form>
    );
}
export default SnippetForm;