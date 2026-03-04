import { create } from 'zustand';

const useEventStore = create((set) => ({
  events: [],
  currentEvent: null,
  userEvents: [],
  isLoading: false,
  error: null,

  setEvents: (events) => set({ events }),
  setCurrentEvent: (event) => set({ currentEvent: event }),
  setUserEvents: (events) => set({ userEvents: events }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),

  addEvent: (event) =>
    set((state) => ({
      events: [event, ...state.events],
      userEvents: [event, ...state.userEvents],
    })),

  updateEvent: (updatedEvent) =>
    set((state) => ({
      events: state.events.map((e) => (e.id === updatedEvent.id ? updatedEvent : e)),
      userEvents: state.userEvents.map((e) => (e.id === updatedEvent.id ? updatedEvent : e)),
      currentEvent: state.currentEvent?.id === updatedEvent.id ? updatedEvent : state.currentEvent,
    })),

  deleteEvent: (eventId) =>
    set((state) => ({
      events: state.events.filter((e) => e.id !== eventId),
      userEvents: state.userEvents.filter((e) => e.id !== eventId),
      currentEvent: state.currentEvent?.id === eventId ? null : state.currentEvent,
    })),

  clearCurrentEvent: () => set({ currentEvent: null }),
}));

export default useEventStore;
