import React, { useState } from 'react';
import { supabase } from '../supabaseClient';

const EventForm = ({ eventId }) => {
  const [name, setName] = useState('');
  const [selectedDay, setSelectedDay] = useState(new Date().toISOString().split('T')[0]);
  const [availableTimes, setAvailableTimes] = useState([]);
  const [fromTime, setFromTime] = useState('');
  const [toTime, setToTime] = useState('');
    
  const convertTo12HourFormat = (time) => {
    let [hours, minutes] = time.split(':');
    let period = 'AM';
    hours = parseInt(hours);

    if (hours >= 12) {
      period = 'PM';
      if (hours > 12) hours -= 12;
    } else if (hours === 0) {
      hours = 12;
    }

    return `${hours}:${minutes} ${period}`;
  };
  const handleAddTimeSlot = () => {
    if (fromTime && toTime && fromTime !== toTime) {
      const formattedFromTime = convertTo12HourFormat(fromTime);
      const formattedToTime = convertTo12HourFormat(toTime);
      const timeSlot = `${formattedFromTime} - ${formattedToTime}`;
      const daySlot = { day: selectedDay, timeSlot };
      if (!availableTimes.some(time => time.day === selectedDay && time.timeSlot === timeSlot)) {
        setAvailableTimes([...availableTimes, daySlot]);
      }
      setFromTime('');
      setToTime('');
    }
  };

  const handleRemoveTimeSlot = (daySlot) => {
    setAvailableTimes(availableTimes.filter((time) => time !== daySlot));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (name.trim() === '' || availableTimes.length === 0) {
      alert('Please fill in your name and at least one time slot.');
      return;
    }

    for (const entry of availableTimes) {
      const { day, timeSlot } = entry;
    // eslint-disable-next-line
      const { data, error } = await supabase
        .from('availability')
        .insert([{ name, day, available_times: [timeSlot], event_id: eventId }]);

      if (error) {
        console.error('Error submitting availability:', error);
      }
    }

    setName('');
    setSelectedDay(new Date().toISOString().split('T')[0]);
    setAvailableTimes([]);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 shadow-md dark:shadow-gray-700 rounded px-8 pt-6 pb-8 mb-4">
      <div className="mb-4">
        <input
          type="text"
          placeholder="Your Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-200 dark:bg-gray-700 dark:border-gray-600 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>

      <div className="mb-4">
        <input
          type="date"
          value={selectedDay}
          onChange={(e) => setSelectedDay(e.target.value)}
          required
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-200 dark:bg-gray-700 dark:border-gray-600 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>
      
      <div className="mb-4">
        <label className="block text-gray-700 dark:text-gray-200 text-sm font-bold mb-2">From:</label>
        <input
          type="time"
          value={fromTime}
          onChange={(e) => setFromTime(e.target.value)}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-200 dark:bg-gray-700 dark:border-gray-600 leading-tight focus:outline-none focus:shadow-outline"
        />

        <label className="block text-gray-700 dark:text-gray-200 text-sm font-bold mb-2">To:</label>
        <input
          type="time"
          value={toTime}
          onChange={(e) => setToTime(e.target.value)}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-200 dark:bg-gray-700 dark:border-gray-600 leading-tight focus:outline-none focus:shadow-outline"
        />

        <button
          type="button"
          onClick={handleAddTimeSlot}
          className="bg-blue-500 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-800 text-white font-bold py-2 px-4 rounded mt-2"
        >
          Add Time Slot
        </button>
      </div>

      <div className="mb-4">
        <h4 className="text-gray-700 dark:text-gray-200 font-bold">Selected Time Slots:</h4>
        {availableTimes.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">No time slots selected.</p>
        ) : (
          <ul className="list-disc pl-5">
            {availableTimes.map((entry, index) => (
              <li key={index} className="flex justify-between items-center text-gray-700 dark:text-gray-200">
                {`${entry.day}: ${entry.timeSlot}`}
                <button
                  type="button"
                  onClick={() => handleRemoveTimeSlot(entry)}
                  className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-600 text-sm"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <button
        type="submit"
        className="bg-green-500 hover:bg-green-700 dark:bg-green-600 dark:hover:bg-green-800 text-white font-bold py-2 px-4 rounded"
      >
        Submit Availability
      </button>
    </form>
  );
};

export default EventForm;