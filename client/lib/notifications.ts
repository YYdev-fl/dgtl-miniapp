// notifications.ts
type NotificationType = 'success' | 'warning' | 'error';

export function showNotification(message: string, type: NotificationType) {
    // Create a container that spans the full viewport width and centers its content
    const container = document.createElement("div");
    container.className = "fixed w-full flex justify-center z-50 pointer-events-none";
    // Position it from the top considering safe area insets (inline style necessary)
    container.style.top = "calc(env(safe-area-inset-top, 0px) + 20px)";
  
    // Create the notification element
    const notification = document.createElement("div");
    notification.className = `
      relative pointer-events-auto
      px-4 py-3 rounded-md shadow-md text-center max-w-[90%] whitespace-nowrap
      overflow-hidden text-ellipsis
      ${type === "success" 
         ? "bg-green-500 text-white" 
         : type === "warning" 
           ? "bg-yellow-500 text-black" 
           : "bg-red-500 text-white"}
    `;
  
    // Set the notification text
    notification.innerText = message;
  
    // Append the notification to the container and the container to body
    container.appendChild(notification);
    document.body.appendChild(container);
  
    // Automatically hide the notification after 3 seconds with a fade-out effect
    setTimeout(() => {
      notification.classList.add("transition-opacity", "duration-500", "opacity-0");
  
      // Remove after fade-out completes
      setTimeout(() => {
        document.body.removeChild(container);
      }, 500);
    }, 3000);
  }
  
  