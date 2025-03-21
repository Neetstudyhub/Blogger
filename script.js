async function fetchPosts() {
    try {
        const response = await fetch('https://broken-hall-68ac.earnmoney100a.workers.dev/');
        const data = await response.json();
        
        const postsContainer = document.getElementById('posts-container');
        postsContainer.innerHTML = '';

        data.items.forEach(post => {
            const formattedTitle = post.title.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
            const thumbnail = post.thumbnail || 'https://via.placeholder.com/300x180'; // Default image

            const postCard = document.createElement('div');
            postCard.classList.add('post-card');
            postCard.onclick = () => window.location.href = `post.html?title=${encodeURIComponent(formattedTitle)}`;
            postCard.innerHTML = `
                <img src="${thumbnail}" alt="${post.title}">
                <h2>${post.title}</h2>
                <p>${post.contentSnippet}</p>
            `;
            postsContainer.appendChild(postCard);
        });

    } catch (error) {
        console.error('Error fetching posts:', error);
    }
}

async function fetchPostByTitle() {
    try {
        const urlParams = new URLSearchParams(window.location.search);
        const postTitle = urlParams.get('title');

        if (!postTitle) {
            document.getElementById('post-content').innerHTML = '<p>Post not found.</p>';
            return;
        }

        const response = await fetch('https://broken-hall-68ac.earnmoney100a.workers.dev/');
        const data = await response.json();

        const post = data.items.find(post => {
            const formattedTitle = post.title.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
            return formattedTitle === postTitle;
        });

        if (post) {
            document.getElementById('post-title').innerText = post.title;
            document.getElementById('post-content').innerHTML = post.content;
            document.getElementById('post-thumbnail').src = post.thumbnail || 'https://via.placeholder.com/800x300';

            // Fetch Related Posts
            const relatedPosts = data.items.filter(p => p.title !== post.title).slice(0, 5);
            const relatedContainer = document.getElementById('related-posts');
            relatedContainer.innerHTML = '';

            relatedPosts.forEach(relatedPost => {
                const relatedTitle = relatedPost.title.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
                const li = document.createElement('li');
                li.innerText = relatedPost.title;
                li.onclick = () => window.location.href = `post.html?title=${encodeURIComponent(relatedTitle)}`;
                relatedContainer.appendChild(li);
            });

        } else {
            document.getElementById('post-content').innerHTML = '<p>Post not found.</p>';
        }

    } catch (error) {
        console.error('Error fetching post:', error);
    }
}

// Load the correct function based on the page
if (document.getElementById('posts-container')) {
    fetchPosts();
} else {
    fetchPostByTitle();
}
