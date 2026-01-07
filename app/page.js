"use client";
import { useState, useEffect } from "react";

export default function Home() {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [editId, setEditId] = useState(null);
  const [searchTerm, setSearchTerm] = useState(""); 
  const [loading, setLoading] = useState(true);

  useEffect(() => { 
    fetchNotes().finally(() => setLoading(false)); 
  }, []);

  const fetchNotes = async () => {
    const res = await fetch("/api/notes");
    const data = await res.json();
    setNotes(Array.isArray(data) ? data : []);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = editId ? "PUT" : "POST";
    const url = editId ? `/api/notes/${editId}` : "/api/notes";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, content }),
    });
    
    if (res.ok) {
      alert(editId ? "Entry Updated!" : "Note Locked in Vault!");
      setTitle(""); setContent(""); setEditId(null);
      fetchNotes();
    }
  };

  const handleEdit = (note) => {
    setEditId(note._id);
    setTitle(note.title);
    setContent(note.content);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const deleteNote = async (id) => {
    if (confirm("Permanently delete this note?")) {
      await fetch(`/api/notes/${id}`, { method: "DELETE" });
      fetchNotes();
    }
  };

  const filteredNotes = notes.filter((note) =>
    note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 font-sans text-slate-900">
      <div className="max-w-2xl mx-auto">
        
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="flex justify-between items-end mb-4">
            <div className="text-left">
              <h1 className="text-6xl font-black tracking-tighter text-slate-900">
                MY <span className="text-blue-600">VAULT</span>
              </h1>
            </div>
            {/* Database Status Indicator - BACK AGAIN! */}
            <div className="text-right pb-1">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">System Status</p>
              <p className="text-xs font-bold text-green-600 flex items-center justify-end gap-1.5">
                <span className="h-2 w-2 bg-green-500 rounded-full animate-pulse border border-green-200"></span> 
                DATABASE CONNECTED
              </p>
            </div>
          </div>
          
          <div className="h-[2px] w-full bg-slate-300 rounded-full"></div>
          
          <p className="mt-4 text-slate-500 font-bold text-xs uppercase tracking-[0.4em]">
            Selection Task &bull; Next.js + MongoDB Atlas
          </p>
        </div>

        {/* Form Card */}
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-3xl shadow-xl mb-12 border-t-4 border-blue-600 shadow-blue-100">
          <input 
            className="w-full bg-slate-100 border-none p-4 rounded-xl outline-none text-xl font-bold mb-4 text-black focus:ring-2 focus:ring-blue-500 transition-all" 
            placeholder="Entry Title..." 
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
            required 
          />
          <textarea 
            className="w-full bg-slate-100 border-none p-4 rounded-xl outline-none h-32 mb-6 text-black focus:ring-2 focus:ring-blue-500 transition-all resize-none" 
            placeholder="Write your thoughts..." 
            value={content} 
            onChange={(e) => setContent(e.target.value)} 
            required 
          />
          <button 
            className={`w-full py-4 rounded-xl text-white font-black text-lg shadow-lg transition-all active:scale-95 ${editId ? 'bg-orange-500' : 'bg-blue-600 hover:bg-blue-700'}`}
            type="submit"
          >
            {editId ? "UPDATE ENTRY" : "LOCK IN VAULT"}
          </button>
        </form>

        {/* Search */}
        <div className="mb-10">
          <input
            type="text"
            placeholder="Search vault..."
            className="w-full p-4 pl-6 rounded-2xl border-2 border-slate-200 focus:border-blue-500 outline-none font-bold text-black"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Notes List */}
        <div className="grid gap-8">
          {loading ? (
             <div className="text-center py-10 text-slate-400 font-bold animate-pulse uppercase tracking-widest text-xs">
               Accessing Secured Data...
             </div>
          ) : filteredNotes.length > 0 ? (
            filteredNotes.map((note) => (
              <div key={note._id} className="bg-white p-7 rounded-3xl shadow-sm border border-slate-200 hover:shadow-2xl transition-all duration-300">
                <h3 className="text-2xl font-black text-slate-800 mb-3">{note.title}</h3>
                <p className="text-slate-600 text-lg leading-relaxed mb-8">{note.content}</p>
                
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-t border-slate-100 pt-6">
                  <div className="flex gap-2">
                    <div className="flex flex-col">
                        <span className="text-[9px] font-black text-blue-600 uppercase mb-1 ml-1">Created On</span>
                        <span className="bg-blue-600 text-white px-4 py-1.5 rounded-lg text-xs font-black shadow-md">
                        {new Date(note.createdAt).toLocaleDateString('en-GB')}
                        </span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[9px] font-black text-slate-500 uppercase mb-1 ml-1">Timestamp</span>
                        <span className="bg-slate-800 text-white px-4 py-1.5 rounded-lg text-xs font-black shadow-md">
                        {new Date(note.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                    </div>
                  </div>

                  <div className="flex gap-6">
                    <button onClick={() => handleEdit(note)} className="text-blue-600 hover:underline font-black text-xs uppercase tracking-widest">Edit</button>
                    <button onClick={() => deleteNote(note._id)} className="text-red-500 hover:underline font-black text-xs uppercase tracking-widest">Delete</button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-16 bg-white rounded-3xl border-4 border-dashed border-slate-100">
              <p className="text-slate-300 font-black uppercase tracking-widest">Vault Empty</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Footer */}
      <footer className="max-w-2xl mx-auto mt-24 pb-12 border-t-2 border-slate-200 pt-8 text-center">
        <p className="text-slate-900 font-black text-sm tracking-[0.3em] uppercase italic mb-3">
          Developed by Srishti Goenka &bull; 2026
        </p>
        <div className="flex justify-center gap-3 mb-4">
           <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded border border-blue-100 uppercase tracking-tighter">Next.js 15</span>
           <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded border border-slate-200 uppercase tracking-tighter">MongoDB Atlas</span>
        </div>
        <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest">
          Full-Stack Selection Task Complete
        </p>
      </footer>
    </div>
  );
}