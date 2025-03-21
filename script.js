async function fetchPosts() {
    const response = await fetch('https://broken-hall-68ac.earnmoney100a.workers.dev/');
    const data = await response.json();

    const postsContainer = document.getElementById('posts-container');
    postsContainer.innerHTML = '';

    data.items.forEach(post => {
        const formattedTitle = post.title.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-');
        const postCard = document.createElement('div');
        postCard.classList.add('post-card');
        postCard.onclick = () => window.location.href = `post.html?title=${encodeURIComponent(formattedTitle)}`;
        postCard.innerHTML = `
            <img src="${post.thumbnail || 'https://via.placeholder.com/300x180'}" alt="${post.title}">
            <h2>${post.title}</h2>
            <p>${post.author} • ${new Date(post.published).toLocaleDateString()}</p>
        `;
        postsContainer.appendChild(postCard);
    });
}

async function fetchPostByTitle() {
    const urlParams = new URLSearchParams(window.location.search);
    const postTitle = urlParams.get('title');

    const response = await fetch('https://broken-hall-68ac.earnmoney100a.workers.dev/');
    const data = await response.json();

    const post = data.items.find(p => p.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') === postTitle);

    if (post) {
        document.getElementById('post-title').innerText = post.title;
        document.getElementById('post-author').innerText = post.author;
        document.getElementById('post-date').innerText = new Date(post.published).toLocaleDateString();
        document.getElementById('post-thumbnail').src = post.thumbnail || 'https://via.placeholder.com/800x300';
        document.getElementById('post-content').innerHTML = post.content;

        const relatedContainer = document.getElementById('related-posts');
        data.items.filter(p => p.title !== post.title).slice(0, 4).forEach(rp => {
            const card = document.createElement('div');
            card.classList.add('related-post');
            card.onclick = () => window.location.href = `post.html?title=${encodeURIComponent(rp.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'))}`;
            card.innerHTML = `<img src="${rp.thumbnail}" alt=""><p>${rp.title}</p>`;
            relatedContainer.appendChild(card);
        });
    }
}

if (document.getElementById('posts-container')) fetchPosts();
else fetchPostByTitle();
