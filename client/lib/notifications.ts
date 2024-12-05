// notifications.ts
type NotificationType = 'success' | 'warning' | 'error';

export function showNotification(message: string, type: NotificationType) {
    // Create the notification element
    const notification = document.createElement("div");
    notification.className = `
      fixed top-5 left-1/2 transform -translate-x-1/2 
      z-50 p-4 w-[90%] max-w-sm text-center rounded-md shadow-md animate-slideIn ${
        type === "success"
          ? "bg-green-500 text-white"
          : type === "warning"
          ? "bg-yellow-500 text-black"
          : "bg-red-500 text-white"
      }`;
  
    // Add the notification text
    notification.style.position = "fixed";
    notification.style.top = "20px"; // Adjust as necessary
    notification.style.left = "50%";
    notification.style.transform = "translateX(-50%)";
  
    // Set the notification content
    notification.innerText = message;
  
    // Append to the body
    document.body.appendChild(notification);
  
    // Automatically hide the notification after 3 seconds
    setTimeout(() => {
      notification.classList.remove("animate-slideIn");
      notification.classList.add("animate-slideOut");
  
      // Remove the notification after the animation ends
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 500); // Match the animation duration
    }, 3000);
  }
  