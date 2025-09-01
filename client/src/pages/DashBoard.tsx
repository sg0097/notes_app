import React, { useState, useEffect } from 'react'; // <-- FIX 1: Correct import syntax
import { useAuth } from '../hooks/useAuth';
import api from '../service/api';

// 1. IMPORT YOUR LOGO
// Make sure you have your logo file at 'src/assets/logo.svg' or update the path.
import logo from '../assets/ggg.png';

interface Note {
  _id: string;
  content: string;
}

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNote, setNewNote] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const { data } = await api.get<Note[]>('/notes');
        setNotes(data);
      } catch (error) {
        console.error('Failed to fetch notes', error);
      }
    };
    fetchNotes();
  }, []);

  const handleCreateNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    setLoading(true);
    try {
      const { data } = await api.post<Note>('/notes', { content: newNote });
      setNotes([data, ...notes]);
      setNewNote('');
    } catch (error) {
      console.error('Failed to create note', error);
    } finally {
        setLoading(false);
    }
  };

  const handleDeleteNote = async (id: string) => {
    try {
      await api.delete(`/notes/${id}`);
      // FIX 2: Added type 'Note' to the 'note' parameter
      setNotes(notes.filter((note: Note) => note._id !== id));
    } catch (error) {
      console.error('Failed to delete note', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 md:p-8">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md">
        
        {/* --- MODIFIED HEADER --- */}
        <header className="flex justify-between items-center p-4 border-b">
          {/* Group logo and title on the left */}
          <div className="flex items-center gap-3">
            <img src={logo} alt="Logo" className="h-10 w-12" />
            <h1 className="text-2xl ">Dashboard</h1>
          </div>
          <button onClick={logout} className="text-blue-600 hover:underline font-semibold">
            Sign Out
          </button>
        </header>

        {/* Welcome Message */}
        <div className="p-6 m-4 border-2 border-black-400 rounded-lg">
          <h2 className="text-2xl font-semibold">Welcome, {user?.name}!</h2>
          <p className="text-gray-600">Email: {user?.email}</p>
        </div>

        {/* Create Note Form */}
        <div className="p-4">
            <form onSubmit={handleCreateNote}>
                <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 disabled:bg-blue-300 font-semibold text-lg">
                    {loading ? 'Creating...' : 'Create Note'}
                </button>
                <textarea
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    placeholder="Write your note here..."
                    className="w-full mt-4 p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    rows={4}
                />
            </form>
        </div>

        {/* Notes List */}
        <div className="p-4">
          <h3 className="text-xl font-bold mb-4">Notes</h3>
          <div className="space-y-3">
            {notes.length > 0 ? (
              // FIX 3: Added type 'Note' to the 'note' parameter
              notes.map((note: Note) => (
                <div key={note._id} className="flex justify-between items-center bg-gray-50 p-4 rounded-lg border">
                  <p>{note.content}</p>
                  <button onClick={() => handleDeleteNote(note._id)} className="text-red-500 hover:text-red-700">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              ))
            ) : (
              <p className="text-gray-500">You have no notes yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;