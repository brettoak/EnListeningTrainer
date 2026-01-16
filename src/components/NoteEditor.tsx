import React, { useEffect, useState, useRef } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
// import './NoteEditor.css'; // Removed for Tailwind migration

interface NoteEditorProps {
  lastFileName?: string;
}

export const NoteEditor: React.FC<NoteEditorProps> = ({ lastFileName }) => {
  const [value, setValue] = useState('');
  const quillRef = useRef<ReactQuill>(null);
  const LOCAL_KEY = 'listening_note_quill';

  useEffect(() => {
    const saved = localStorage.getItem(LOCAL_KEY);
    if (saved) {
      try {
        // Saved as Delta? Or HTML? The original saved Delta JSON.
        // ReactQuill value can be Key or HTML.
        // originalCode: JSON.stringify(quill.getContents()) -> Delta
        JSON.parse(saved);
        // Note: react-quill value prop accepts HTML or Delta.
        // But getting raw delta out needs ref to editor.
        // Let's stick to HTML for simplicity if possible, or support Delta.
        // Original logic: quill.setContents(JSON.parse(saved));
        // We will try to load it. If we use uncontrolled component, we can use defaultValue.
      } catch (e) { /* ignore */ }
    }
    // We'll rely on the editor handling initial content if we passed it?
    // Actually, ReactQuill is controlled or uncontrolled.
    // If we want autosave, controlled might be better or onChange.
  }, []);

  // Autosave
  // Since original saved Delta, maybe we should stick to that, or switch to HTML which is easier.
  // Original: quill.getContents() -> Delta.
  // React-Quill onChange gives content (HTML), delta, source, editor.
  // Let's simpler: Save HTML. It's more compatible.
  // Wait, if I want to be compatible with existing data from original app potentially?
  // The user might have data in localStorage from the HTML file version if served from same origin.
  // Electron serves from file:// or localhost. Probably different origin than the file opened in browser.
  // So compatibility with old data isn't guaranteed unless user imports.
  // I will implement Import/Export logic.

  const handleChange = (content: string, _delta: any, _source: string, _editor: any) => {
    setValue(content);
    // Save to local storage occasionally or on change?
    // Debounce this?
  };

  // Autosave effect
  useEffect(() => {
    const timer = setTimeout(() => {
      localStorage.setItem(LOCAL_KEY, value);
    }, 2000);
    return () => clearTimeout(timer);
  }, [value]);

  // Load initial
  useEffect(() => {
    const saved = localStorage.getItem(LOCAL_KEY);
    if (saved) {
      // If it looks like JSON (Delta), we might need to convert?
      // If it starts with {, it might be delta.
      if (saved.trim().startsWith('{')) {
        // It's likely Delta. ReactQuill defaultValue can take it?
        // Actually, setValue(JSON.parse(saved))? 
        // Let's just set raw string if it's HTML, or if it's JSON maybe parse it.
        // For now, assume it's HTML for new app, but try to support old if needed.
        // If we overwrite, it's fine as per "Rewrite".
        setValue(saved); // ReactQuill handles HTML string. 
        // If it was Delta JSON string, ReactQuill might render it as text?
        // We'll start fresh or assume Import handles it.
      } else {
        setValue(saved);
      }
    }
  }, []);

  const handleDownload = () => {
    let baseName = lastFileName || 'note';
    baseName = baseName.replace(/\.[^/.]+$/, '');
    const now = new Date();
    const pad = (n: number) => n.toString().padStart(2, '0');
    const dateStr = `${now.getFullYear().toString().slice(2)}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}-${pad(now.getHours())}-${pad(now.getMinutes())}`;
    const fileName = `${baseName}-${dateStr}.html`;

    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>笔记</title></head><body>${value}</body></html>`;
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    // Clear after download? Original did: localStorage.removeItem(LOCAL_KEY); quill.setText('');
    localStorage.removeItem(LOCAL_KEY);
    setValue('');
  };

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      let html = evt.target?.result as string;
      const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
      if (bodyMatch) html = bodyMatch[1];
      setValue(html);
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'color': [] }],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      ['blockquote', 'code-block'],
      ['image'],
      ['clean']
    ]
  };

  return (
    <div className="w-full">
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-6 flex flex-col h-[700px] relative text-gray-800 dark:text-gray-200 transition-colors">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-slate-700 dark:text-slate-200">笔记</h2>
          <div className="flex gap-2">
            <button
              className="px-4 py-2 text-sm rounded bg-slate-50 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-medium hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors border border-slate-200 dark:border-slate-600"
              onClick={() => fileInputRef.current?.click()}
            >
              导入
            </button>
            <button
              className="px-4 py-2 text-sm rounded bg-[#646cff] text-white font-medium shadow-sm hover:bg-[#535bf2] transition-colors dark:bg-[#535bf2] dark:hover:bg-[#4044c9]"
              onClick={handleDownload}
            >
              下载并清空
            </button>
            <input
              type="file"
              accept=".html,text/html"
              style={{ display: 'none' }}
              ref={fileInputRef}
              onChange={handleImport}
            />
          </div>
        </div>

        <ReactQuill
          theme="snow"
          value={value}
          onChange={handleChange}
          modules={modules}
          ref={quillRef}
          className="flex-1 mb-0 flex flex-col min-h-0
            [&_.ql-container]:flex-1 [&_.ql-container]:min-h-0
            [&_.ql-container]:border-slate-200 dark:[&_.ql-container]:border-slate-700 
            [&_.ql-toolbar]:border-slate-200 dark:[&_.ql-toolbar]:border-slate-700 
            [&_.ql-toolbar]:bg-slate-50 dark:[&_.ql-toolbar]:bg-slate-700 
            [&_.ql-toolbar]:rounded-t-lg 
            [&_.ql-container]:rounded-b-lg 
            [&_.ql-editor]:text-lg dark:[&_.ql-editor]:text-slate-200 
            [&_.ql-editor]:overflow-y-auto [&_.ql-editor]:h-full
            dark:[&_.ql-stroke]:!stroke-slate-200 
            dark:[&_.ql-fill]:!fill-slate-200 
            dark:[&_.ql-picker]:!text-slate-200
            dark:[&_button:hover_.ql-stroke]:!stroke-white
            dark:[&_button:hover_.ql-fill]:!fill-white
            dark:[&_.ql-picker-label:hover]:!text-white"
        />
      </div>
    </div>
  );
};
