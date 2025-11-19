// import { useAltStore } from '@/lib/zustand/userStore';
import { UserNotificationTypes } from '@/types';

export const useNotification = () => {
  // const { setIsNotificationOpen, setCurrentNotification } = useAltStore();

  const openNotification = (notification: UserNotificationTypes) => {
    // setCurrentNotification(notification);
    // setIsNotificationOpen(true);
  };

  const closeNotification = () => {
    // setIsNotificationOpen(false);
    // setCurrentNotification(null);
  };

  return {
    openNotification,
    closeNotification,
  };
};
