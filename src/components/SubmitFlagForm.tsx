'use client';

import { useState } from 'react';
import axios from 'axios';

interface SubmitFormProps {
  challengeId: string;
}

export default function SubmitFlagForm({ challengeId }: SubmitFormProps) {
  const [flag, setFlag] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!flag.trim()) return;

    setStatus('loading');
    setMessage('');

    try {
      // Note: In a real app, the token would be handled by the auth provider/interceptor
      // Here we assume it's in localStorage if the user is logged in
      const token = localStorage.getItem('token');
      
      const response = await axios.post('/api/submit', 
        { challengeId, flag },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.correct) {
        setStatus('success');
        setMessage('Correct flag! Points awarded.');
        setFlag('');
      } else {
        setStatus('error');
        setMessage('Wrong flag. Try again!');
      }
    } catch (error: any) {
      setStatus('error');
      setMessage(error.response?.data?.message || 'Error submitting flag');
    }
  };

  return (
    <div className="mt-4 pt-4 border-t border-slate-800">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={flag}
          onChange={(e) => setFlag(e.target.value)}
          placeholder="CTF{flag_here}"
          className="flex-1 bg-slate-950 border border-slate-700 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500 transition-colors"
          disabled={status === 'loading'}
        />
        <button
          type="submit"
          disabled={status === 'loading'}
          className={`px-4 py-2 rounded font-bold text-sm transition-all ${
            status === 'loading' 
              ? 'bg-slate-700 cursor-not-allowed' 
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {status === 'loading' ? 'Checking...' : 'Submit'}
        </button>
      </form>
      
      {message && (
        <p className={`mt-2 text-sm font-medium ${
          status === 'success' ? 'text-emerald-400' : 'text-red-400'
        }`}>
          {message}
        </p>
      )}
    </div>
  );
}
