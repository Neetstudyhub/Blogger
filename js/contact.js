import { database } from "./firebase-config.js";
import { ref, push, set } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-database.js";

document.getElementById("contactForm").addEventListener("submit", function(e) {
  e.preventDefault();

  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const message = document.getElementById("message").value;

  const contactRef = ref(database, "contacts");
  const newContact = push(contactRef);

  set(newContact, { name, email, message })
    .then(() => {
      alert("Message sent successfully!");
      document.getElementById("contactForm").reset();
    })
    .catch(error => console.error("Error:", error));
});
