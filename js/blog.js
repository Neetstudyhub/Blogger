import { database } from "./firebase-config.js";
import { ref, get } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-database.js";

const blogContainer = document.querySelector(".blog-content");
const blogRef = ref(database, "blogs");

get(blogRef)
  .then(snapshot => {
    if (snapshot.exists()) {
      snapshot.forEach(blog => {
        const data = blog.val();
        blogContainer.innerHTML += `<article>
                                      <h2>${data.title}</h2>
                                      <p>${data.content}</p>
                                    </article>`;
      });
    } else {
      blogContainer.innerHTML = "<p>No blogs available</p>";
    }
  })
  .catch(error => console.error("Error fetching blogs:", error));
