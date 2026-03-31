/**
 * Placeholder Notification Service to prevent crashes in Expo Go.
 * We will implement real notifications once a Development Build is used.
 */
export const notificationService = {
  registerForPushNotificationsAsync: async () => {
    console.log('Notifications (Placeholder): Permission check skipped in Expo Go.');
    return null;
  },

  scheduleLocalNotification: async (title: string, body: string, seconds: number, data: any = {}) => {
    console.log(`Notifications (Placeholder): Scheduled "${title}" for ${seconds}s from now.`, data);
    return null;
  },

  sendInstantNotification: async (title: string, body: string, data: any = {}) => {
    console.log(`Notifications (Placeholder): Instant Alert: "${title}" - ${body}`, data);
    return null;
  },

  cancelAllNotifications: async () => {
    console.log('Notifications (Placeholder): All notifications cancelled.');
  },

  getMockNotificationCount: async () => {
    return 0; // Keeping it zero for now
  },
};
