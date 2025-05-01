import { Message } from '../types';

class NotificationService {
  private static hasRequestedPermission = false;

  static async requestPermission(): Promise<void> {
    // Check if we've already requested permission to avoid multiple prompts
    if (this.hasRequestedPermission) {
      return;
    }

    // Check if the browser supports notifications
    if (!('Notification' in window)) {
      console.log('This browser does not support notifications');
      return;
    }

    try {
      // Only request permission if it's not already granted or denied
      if (Notification.permission !== 'granted' && Notification.permission !== 'denied') {
        const permission = await Notification.requestPermission();
        this.hasRequestedPermission = true;
        console.log('Notification permission:', permission);
      }
    } catch (error) {
      console.log('Error requesting notification permission:', error);
    }
  }

  static async notify(message: Message, senderName: string): Promise<void> {
    // Don't show notification if permission isn't granted
    if (Notification.permission !== 'granted') {
      return;
    }

    try {
      // Don't show notification if the window is focused
      if (document.hasFocus()) {
        return;
      }

      const notification = new Notification('New Message from ' + senderName, {
        body: message.type === 'text' ? message.content : `Sent a ${message.type}`,
        icon: '/notification-icon.png', // You can add an icon in your public folder
        tag: 'chat-message', // This will replace any existing notification with the same tag
      });

      // Auto close notification after 5 seconds
      setTimeout(() => notification.close(), 5000);

      // Handle notification click
      notification.onclick = () => {
        window.focus();
        notification.close();
      };
    } catch (error) {
      console.log('Error showing notification:', error);
    }
  }
}

export default NotificationService; 