// notifications.ts
type NotificationType = 'success' | 'warning' | 'error';

export function showNotification(message: string, type: NotificationType) {
    // Create a container that spans the full viewport width and centers its content
    const container = document.createElement("div");
    container.className = "fixed w-full flex justify-center z-50 pointer-events-none";
    container.style.top = "calc(env(safe-area-inset-top, 0px) + 20px)";
  
    // Create the notification element
    const notification = document.createElement("div");
    notification.className = `
      relative pointer-events-auto
      px-4 py-3 rounded-md shadow-md text-center
      whitespace-nowrap overflow-hidden text-ellipsis
      animate-slideIn
      max-w-[95%]  // Make it wider so it's more visible on mobile screens
      ${type === "success" ? "bg-green-500 text-white" 
         : type === "warning" ? "bg-yellow-500 text-black" 
         : "bg-red-500 text-white"}
    `;
  
    // Set the notification text
    notification.innerText = message;
  
    // Append elements
    container.appendChild(notification);
    document.body.appendChild(container);
  
    // Automatically transition to slideOut after 3 seconds
    setTimeout(() => {
      notification.classList.remove("animate-slideIn");
      notification.classList.add("animate-slideOut");
  
      setTimeout(() => {
        if (container.parentNode) {
          document.body.removeChild(container);
        }
      }, 500); // Matches the duration of the slideOut animation
    }, 3000);
  }
  
  
  