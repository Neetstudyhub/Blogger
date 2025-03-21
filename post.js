
  const cloudflareProxy = 'https://broken-hall-68ac.earnmoney100a.workers.dev/';

  const urlParams = new URLSearchParams(window.location.search);
  const postSlug = urlParams.get('title');

  const breadcrumbs = document.getElementById('breadcrumbs');
  const postTitle = document.getElementById('post-title');
  const postMeta = document.getElementById('post-meta');
  const postContent = document.getElementById('post-content');
  const relatedPostsContainer = document.getElementById('related-posts');

  async function fetchPost() {
    try {
      const response = await fetch(`${cloudflareProxy}?maxResults=500`);
      const data = await response.json();

      if (!data.items) throw new Error("No posts found.");

      const post = data.items.find(p => {
        const slug = p.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        return slug === postSlug;
      });

      if (!post) throw new Error("Post not found.");

      postTitle.textContent = post.title;
      postMeta.innerHTML = `By - Jinvani | Time: ${new Date(post.published).toLocaleDateString()}`;
      postContent.innerHTML = post.content;

      breadcrumbs.innerHTML = `<a href="index.html">Home</a> › <a href="blog.html">All Posts</a> › ${post.title}`;

      fetchRelatedPosts(post.title);
    } catch (error) {
      console.error('Error fetching the post:', error);
      postContent.innerHTML = `<p>Error loading post. Please try again.</p>`;
    }
  }

  async function fetchRelatedPosts(currentTitle) {
    try {
      const response = await fetch(`${cloudflareProxy}?maxResults=500`);
      const data = await response.json();

      if (!data.items) return;

      const excludedLabels = ['ncert', 'pyq', 'blog', 'physics11', 'neet', 'latest update', 'latest'];
      const selectedPosts = data.items
        .filter(post =>
          post.title !== currentTitle &&
          (!post.labels || !post.labels.some(label => excludedLabels.includes(label.toLowerCase())))
        )
        .slice(0, 5);

      const relatedPosts = selectedPosts.map(post => {
        const imageUrl = post.images && post.images[0] ? post.images[0].url : extractImageFromContent(post.content);
        const slug = post.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

        return `
          <div class="related-post-card">
            <img src="${imageUrl}" alt="${post.title}">
            <div class="related-card-content">
              <a href="post.html?title=${slug}" target="_self"><h3>${post.title}</h3></a>
            </div>
          </div>
        `;
      });

      relatedPostsContainer.innerHTML = relatedPosts.join('');
    } catch (error) {
      console.error('Error fetching related posts:', error);
      relatedPostsContainer.innerHTML = '<p>Error loading related posts.</p>';
    }
  }

  function extractImageFromContent(content) {
    const imgTagMatch = content.match(/<img[^>]+src="([^">]+)"/);
    return imgTagMatch ? imgTagMatch[1] : 'https://via.placeholder.com/300x200';
  }

  document.addEventListener('DOMContentLoaded', fetchPost);

