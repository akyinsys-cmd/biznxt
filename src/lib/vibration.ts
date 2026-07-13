export const triggerHapticFeedback = (type: 'success' | 'warning' | 'error' | 'light' | 'heavy' = 'light') => {
  if (typeof navigator !== 'undefined' && navigator.vibrate) {
    switch (type) {
      case 'success':
        navigator.vibrate([15, 50, 15]);
        break;
      case 'warning':
        navigator.vibrate([30, 50, 30]);
        break;
      case 'error':
        navigator.vibrate([50, 100, 50, 100, 50]);
        break;
      case 'light':
        navigator.vibrate(10);
        break;
      case 'heavy':
        navigator.vibrate(30);
        break;
      default:
        navigator.vibrate(15);
    }
  }
};
