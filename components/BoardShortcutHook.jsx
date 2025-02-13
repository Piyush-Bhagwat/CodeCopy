'use client'
import { useEffect } from "react";

const BoardShortcutHook = () => {
  useEffect(() => {
    const handleKeyPress = (event) => {
      // Save (Ctrl + S)
      if (event.ctrlKey && event.key === "s") {
        event.preventDefault(); // Prevents default browser behavior
        console.log("Saving snippet...");
        // Call your save function here
      }
   
      // Create New Snippet (Ctrl + N)
      if (event.altKey && event.key === "n") {
        event.preventDefault();
        console.log("Creating new snippet...");
        // Call function to create a new snippet
      }

      // Copy Code (Ctrl + C)
      if (event.ctrlKey && event.key === "c") {
        event.preventDefault();
        console.log("Copying code...");
        // Implement clipboard copy logic here
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, []);
};

export default BoardShortcutHook;