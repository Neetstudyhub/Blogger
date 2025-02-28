import { database } from "./firebase-config.js";
import { ref, push, set } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-database.js";

document.getElementById("adminForm").addEventListener("submit", function(e) {
  e.preventDefault();

  const title = document.getElementById("blogTitle").value;
  const content = document.getElementById("blogContent").value;

  // Create a new entry under the "blogs" node
  const blogRef = ref(database, "blogs");
  const newBlog = push(blogRef);

  set(newBlog, {
    title: title,
    content: content,
    timestamp: Date.now()
  })
  .then(() => {
    alert("Blog post added successfully!");
    document.getElementById("adminForm").reset();
  })
  .catch(error => console.error("Error adding blog post:", error));
});
