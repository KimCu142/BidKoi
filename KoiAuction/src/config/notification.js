const requestPermissions = async () => {
  try {
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      console.log("User granted notification permissions.");
    } else {
      console.warn("User denied notification permissions.");
    }
  } catch (error) {
    console.error("Error requesting notification permissions:", error);
  }
};

export default requestPermissions;
