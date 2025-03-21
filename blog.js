
  const cloudflareProxy = "https://broken-hall-68ac.earnmoney100a.workers.dev/";
  const maxResults = 100;
  const postsPerBatch = 6;

  let latestPosts = [];
  let displayedPosts = 0;

  const blogContainer = document.getElementById('blog-container');
  const loadMoreBtn = document.getElementById('load-more-btn');
  const skeletonLoader = document.getElementById('skeletonLoader');
  const endMessage = document.getElementById('end-message');

  function formatDate(dateStr) {
    const date = new Date(dateStr);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString(undefined, options);
  }

  function extractImageFromContent(content) {
    const imgTagMatch = content.match(/<img[^>]+src="([^">]+)"/);
    return imgTagMatch ? imgTagMatch[1] : 'https://via.placeholder.com/300x200';
  }

  async function fetchBloggerPosts() {
    try {
      const response = await fetch(`${cloudflareProxy}?maxResults=${maxResults}`);
      const data = await response.json();

      if (!data.items || data.items.length === 0) {
        throw new Error("No posts found.");
      }

      const filteredPosts = data.items.filter(
        (post) => post.labels && post.labels.some((label) => label.toLowerCase() === "jinvani")
      );

      if (filteredPosts.length === 0) {
        throw new Error("No posts with the 'jinvani' label found.");
      }

      latestPosts = filteredPosts.map((post) => {
        const { title, content, labels, published } = post;
        const imageUrl = post.images && post.images[0] ? post.images[0].url : extractImageFromContent(content);
        const formattedDate = published ? formatDate(published) : "Unknown Date";
        const contentSnippet = content.replace(/<\/?[^>]+(>|$)/g, "").substring(0, 120);
        const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

        return {
          title,
          labels: labels || [],
          imageUrl,
          published: formattedDate,
          contentSnippet,
          slug,
        };
      });

      skeletonLoader.style.display = "none";
      loadMoreBtn.style.display = latestPosts.length > postsPerBatch ? "block" : "none";
      displayPosts();
    } catch (error) {
      console.error("Error fetching posts:", error);
      skeletonLoader.style.display = "none";
      blogContainer.innerHTML = `<p>Error loading posts. Please try again.</p>`;
    }
  }

  function displayPosts() {
    const postsToDisplay = latestPosts.slice(displayedPosts, displayedPosts + postsPerBatch);
    const postCards = postsToDisplay.map((post) => {
      const { title, labels, imageUrl, published, contentSnippet, slug } = post;
      const labelMarkup = labels.length ? `<div class="top-labels">${labels.map((label) => `<span class="label">${label}</span>`).join(" ")}</div>` : "";

      return `
        <div class="card">
          <a href="post.html?title=${slug}" target="_self">
            <div class="card-image">
              <img src="${imageUrl}" alt="${title}" />
            </div>
          </a>
          <div class="card-content">
            ${labelMarkup}
            <h3><a href="post.html?title=${slug}" target="_self">${title}</a></h3>
            <p class="post-description">${contentSnippet}...</p>
            <div class="bottom-meta">
              <span class="published-date">Mental Ease • ${published}</span>
            </div>
          </div>
        </div>
      `;
    });

    blogContainer.innerHTML += postCards.join("");
    displayedPosts += postsToDisplay.length;

    if (displayedPosts >= latestPosts.length) {
      loadMoreBtn.style.display = "none";
      endMessage.style.display = "block";
    } else {
      loadMoreBtn.style.display = "block";
    }
  }

  function loadMorePosts() {
    loadMoreBtn.disabled = true;
    loadMoreBtn.innerHTML = '<span class="spinner"></span> Loading...';
    setTimeout(() => {
      displayPosts();
      loadMoreBtn.innerHTML = "Load More";
      loadMoreBtn.disabled = false;
    }, 500);
  }

  loadMoreBtn.addEventListener("click", loadMorePosts);
  document.addEventListener("DOMContentLoaded", fetchBloggerPosts);

