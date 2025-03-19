document.addEventListener("DOMContentLoaded", () => {
    fetch("posts.json")
        .then(response => response.json())
        .then(data => {
            const postsContainer = document.getElementById("postsContainer");
            const categoryFilter = document.getElementById("categoryFilter");

            let categories = new Set();
            
            data.forEach(post => {
                let postElement = document.createElement("div");
                postElement.classList.add("post-card");
                postElement.innerHTML = `
                    <img src="${post.thumbnail}" alt="${post.title}">
                    <h2>${post.title}</h2>
                `;
                postElement.onclick = () => window.location.href = `posts/${post.file}`;
                postsContainer.appendChild(postElement);

                categories.add(post.category);
            });

            categories.forEach(category => {
                let option = document.createElement("option");
                option.value = category;
                option.textContent = category;
                categoryFilter.appendChild(option);
            });

            categoryFilter.addEventListener("change", () => {
                let selectedCategory = categoryFilter.value;
                postsContainer.innerHTML = "";
                data.filter(post => !selectedCategory || post.category === selectedCategory)
                    .forEach(post => {
                        let postElement = document.createElement("div");
                        postElement.classList.add("post-card");
                        postElement.innerHTML = `
                            <img src="${post.thumbnail}" alt="${post.title}">
                            <h2>${post.title}</h2>
                        `;
                        postElement.onclick = () => window.location.href = `posts/${post.file}`;
                        postsContainer.appendChild(postElement);
                    });
            });
        });
});
