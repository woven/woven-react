export const showNotification = message => {
  if (Notification.permission == 'granted') {
    new Notification(message)
  } else if (Notification.permission != 'denied') {
    Notification.requestPermission()
  }
}
