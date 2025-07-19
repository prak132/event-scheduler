import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import EventForm from '../components/EventForm';
import AvailabilityTable from '../components/AvailabilityTable';

const EventPage = () => {
  const { slug } = useParams();
  const [event, setEvent] = useState(null);

  useEffect(() => {
    const fetchEvent = async () => {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('slug', slug)
        .single();

      if (error) {
        console.error('Error fetching event:', error);
      } else {
        setEvent(data);
      }
    };

    fetchEvent();
  }, [slug]);

  if (!event) {
    return <div className="text-center text-gray-500">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-4xl font-bold mb-6">{event.title}</h1>
      <EventForm eventId={event.id} />
      <AvailabilityTable eventId={event.id} />
    </div>
  );
};

export default EventPage;
