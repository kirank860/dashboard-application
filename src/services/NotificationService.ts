import { toast } from 'react-toastify';

class NotificationService {
  private static hasPermission = false;

  static async requestPermission() {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      this.hasPermission = permission === 'granted';
    }
  }

  static showNotification(title: string, options?: NotificationOptions) {
    // Browser notification
    if (this.hasPermission && 'Notification' in window) {
      new Notification(title, options);
    }

    // In-app notification
    toast.info(title, {
      position: 'bottom-right',
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  }

  static async notify(message: { content: string; senderId: string; type: string }, senderName: string) {
    if (!document.hasFocus()) {
      const title = `New message from ${senderName}`;
      const options: NotificationOptions = {
        body: message.type === 'text' ? message.content : `Sent a ${message.type}`,
        icon: '/notification-icon.png',
        badge: '/notification-badge.png',
        tag: 'chat-message',
      };

      this.showNotification(title, options);
    }
  }
}

export default NotificationService; 