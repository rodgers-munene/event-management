import useNotificationStore from '../store/notificationStore';

export const notify = {
  // Registration notifications
  registrationSuccess: (eventName) => {
    useNotificationStore.getState().addNotification({
      type: 'registration',
      title: 'Registration Successful',
      message: `You have successfully registered for ${eventName}`,
    });
  },

  registrationCancelled: (eventName) => {
    useNotificationStore.getState().addNotification({
      type: 'registration',
      title: 'Registration Cancelled',
      message: `Your registration for ${eventName} has been cancelled`,
    });
  },

  // Payment notifications
  paymentSuccess: (eventName, amount) => {
    useNotificationStore.getState().addNotification({
      type: 'payment',
      title: 'Payment Successful',
      message: `Your payment of KES ${amount} for ${eventName} has been processed`,
    });
  },

  paymentFailed: (eventName) => {
    useNotificationStore.getState().addNotification({
      type: 'payment',
      title: 'Payment Failed',
      message: `Your payment for ${eventName} could not be processed`,
    });
  },

  // Event notifications
  eventCreated: (eventName) => {
    useNotificationStore.getState().addNotification({
      type: 'event',
      title: 'Event Created',
      message: `Your event "${eventName}" has been created successfully`,
    });
  },

  eventUpdated: (eventName) => {
    useNotificationStore.getState().addNotification({
      type: 'event',
      title: 'Event Updated',
      message: `Your event "${eventName}" has been updated`,
    });
  },

  eventCancelled: (eventName) => {
    useNotificationStore.getState().addNotification({
      type: 'event',
      title: 'Event Cancelled',
      message: `Your event "${eventName}" has been cancelled`,
    });
  },

  // Reminder notifications
  eventReminder: (eventName, date) => {
    useNotificationStore.getState().addNotification({
      type: 'reminder',
      title: 'Event Reminder',
      message: `${eventName} is coming up on ${date}`,
    });
  },

  // Waitlist notifications
  waitlistJoined: (eventName) => {
    useNotificationStore.getState().addNotification({
      type: 'registration',
      title: 'Joined Waitlist',
      message: `You've been added to the waitlist for ${eventName}`,
    });
  },

  waitlistPromoted: (eventName) => {
    useNotificationStore.getState().addNotification({
      type: 'registration',
      title: 'Waitlist Promoted!',
      message: `A spot is now available for ${eventName}. Register now!`,
    });
  },

  // General notifications
  success: (message) => {
    useNotificationStore.getState().addNotification({
      type: 'general',
      title: 'Success',
      message,
    });
  },

  error: (message) => {
    useNotificationStore.getState().addNotification({
      type: 'general',
      title: 'Error',
      message,
    });
  },

  info: (message) => {
    useNotificationStore.getState().addNotification({
      type: 'general',
      title: 'Information',
      message,
    });
  },
};

export default notify;
