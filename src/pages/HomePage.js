import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { v4 as uuidv4 } from 'uuid';

const HomePage = () => {
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const generatedSlug = uuidv4();
    // eslint-disable-next-line
    const { data, error } = await supabase
      .from('events')
      .insert([{ title, slug: generatedSlug }]);

    if (error) {
      console.error('Error creating event:', error);
    } else {
      setSlug(generatedSlug);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 dark:text-white">Create an Event</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Event Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="w-1/2 p-2 mr-4 border border-gray-300 rounded dark:bg-gray-800 dark:text-white dark:border-gray-600"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 dark:bg-blue-700 dark:hover:bg-blue-800"
        >
          Create Event
        </button>
      </form>
      {slug && <p className="mt-4">Event created! Share this link: <a href={`/event/${slug}`} className="text-blue-500 underline">View Event</a></p>}
    </div>
  );
};

export default HomePage;
