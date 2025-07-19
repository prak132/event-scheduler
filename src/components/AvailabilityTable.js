import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

const AvailabilityTable = ({ eventId }) => {
  const [availability, setAvailability] = useState([]);

  useEffect(() => {
    const fetchAvailability = async () => {
      const { data, error } = await supabase
        .from('availability')
        .select('*')
        .eq('event_id', eventId);

      if (error) {
        console.error('Error fetching availability:', error);
      } else {
        setAvailability(data);
      }
    };

    fetchAvailability();
  }, [eventId]);

  const convertTimeTo24HourFormat = (time) => {
    const [timePart, period] = time.split(' ');
    let [hours, minutes] = timePart.split(':');
    hours = parseInt(hours);
    if (period === 'PM' && hours < 12) hours += 12;
    if (period === 'AM' && hours === 12) hours = 0;
    return { hours: hours, minutes: parseInt(minutes) };
  };

  const timeToMinutes = (time) => {
    const { hours, minutes } = convertTimeTo24HourFormat(time);
    return hours * 60 + minutes;
  };

  const mergeTimeSlots = (slots) => {
    if (!slots.length) return [];
    const uniqueSlots = new Map();
    
    slots.forEach(slot => {
      if (!uniqueSlots.has(slot)) {
        uniqueSlots.set(slot, {
          timeRange: slot,
          start: timeToMinutes(slot.split(' - ')[0]),
          end: timeToMinutes(slot.split(' - ')[1])
        });
      }
    });

    return Array.from(uniqueSlots.values())
      .sort((a, b) => a.start - b.start)
      .map(slot => slot.timeRange);
  };

  const renderGraphicalAvailability = () => {
    const dayGrouped = availability.reduce((acc, entry) => {
      const day = entry.day;
      const name = entry.name;
      if (!acc[day]) {
        acc[day] = {};
      }
      if (!acc[day][name]) {
        acc[day][name] = [];
      }
      acc[day][name].push(...entry.available_times);
      return acc;
    }, {});

    Object.keys(dayGrouped).forEach(day => {
      Object.keys(dayGrouped[day]).forEach(name => {
        dayGrouped[day][name] = mergeTimeSlots(dayGrouped[day][name]);
      });
    });

    const hours = [
      '12 AM', '1 AM', '2 AM', '3 AM', '4 AM', '5 AM', '6 AM', '7 AM', '8 AM', '9 AM', '10 AM', '11 AM', 
      '12 PM', '1 PM', '2 PM', '3 PM', '4 PM', '5 PM', '6 PM', '7 PM', '8 PM', '9 PM', '10 PM', '11 PM'
    ];

    return Object.keys(dayGrouped).map((day) => (
      <div key={day} className="mb-8">
        <h3 className="text-xl font-bold mb-2 dark:text-gray-200">{day}</h3>
        <div className="flex mb-2">
          {hours.map((hour, index) => (
            <div key={index} className="flex-1 text-center text-xs dark:text-gray-300">
              {hour}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-12 gap-4 items-center">
          {Object.entries(dayGrouped[day]).map(([name, times], index) => (
            <div key={`${name}-${index}`} className="col-span-12 mb-8">
              <p className="text-lg font-semibold dark:text-gray-200">{name}</p>
              <div className="relative bg-gray-200 dark:bg-gray-700 h-6 rounded">
                {times.map((timeSlot, idx) => {
                  const [from, to] = timeSlot.split(' - ');
                  const fromTime = convertTimeTo24HourFormat(from);
                  const toTime = convertTimeTo24HourFormat(to);
                  const fromPercent = (fromTime.hours * 60 + fromTime.minutes) / (24 * 60) * 100;
                  const toPercent = (toTime.hours * 60 + toTime.minutes) / (24 * 60) * 100;
                  return (
                    <div key={idx}>
                      <div
                        className="absolute bg-green-500 dark:bg-green-600 h-6 rounded"
                        style={{
                          left: `${fromPercent}%`,
                          width: `${toPercent - fromPercent}%`,
                        }}
                      />
                      <div
                        className="absolute text-xs text-gray-800 dark:text-gray-200 whitespace-nowrap"
                        style={{
                          left: `${fromPercent}%`,
                          top: '100%',
                          marginTop: '4px',
                        }}
                      >
                        {from}
                      </div>
                      <div
                        className="absolute text-xs text-gray-800 dark:text-gray-200 whitespace-nowrap"
                        style={{
                          left: `${toPercent}%`,
                          top: '100%',
                          marginTop: '4px',
                        }}
                      >
                        {to}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    ));
  };

  return (
    <div className="p-8 bg-white dark:bg-gray-800 shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-6 dark:text-gray-200">Availability</h2>
      {availability.length === 0 ? (
        <p className="dark:text-gray-300">No availability submitted yet.</p>
      ) : (
        <div>{renderGraphicalAvailability()}</div>
      )}
    </div>
  );
};

export default AvailabilityTable;