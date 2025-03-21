const cloudflareProxy = "https://broken-hall-68ac.earnmoney100a.workers.dev/";

// Get the post title from the URL
const urlParams = new URLSearchParams(window.location.search);
const postTitleParam = urlParams.get("title");

const breadcrumbs = document.getElementById("breadcrumbs");
const postTitle = document.getElementById("post-title");
const postMeta = document.getElementById("post-meta");
const postContent = document.getElementById("post-content");
const relatedPostsContainer = document.getElementById("related-posts");

function formatTitleForComparison(title) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
}

async function fetchPost() {
  try {
    const response = await fetch(`${cloudflareProxy}?maxResults=500`);
    const data = await response.json();

    if (!data.items || data.items.length === 0) {
      throw new Error("No posts found.");
    }

    const matchedPost = data.items.find((post) => formatTitleForComparison(post.title) === postTitleParam);

    if (!matchedPost) {
      throw new Error("Post not found.");
    }

    postTitle.textContent = matchedPost.title;
    postMeta.innerHTML = `By - Jinvani | Time: ${new Date(matchedPost.published).toLocaleDateString()}`;
    postContent.innerHTML = matchedPost.content;

    breadcrumbs.innerHTML = `<a href="index.html">Home</a> › <a href="blog.html">All Posts</a>`;

    fetchRelatedPosts(matchedPost.title);
  } catch (error) {
    console.error("Error fetching the post:", error);
    postContent.innerHTML = `<p>Error loading post. Please try again.</p>`;
  }
}

async function fetchRelatedPosts(currentTitle) {
  try {
    const response = await fetch(`${cloudflareProxy}?maxResults=500`);
    const data = await response.json();

    const excludedLabels = ["ncert", "pyq", "blog", "physics11", "neet", "latest update", "latest"];
    const relatedPosts = data.items
      .filter((post) => post.title !== currentTitle && (!post.labels || !post.labels.some((label) => excludedLabels.includes(label.toLowerCase()))))
      .slice(0, 5);

    const relatedMarkup = relatedPosts.map((post) => {
      const formattedTitle = formatTitleForComparison(post.title);
      const imageUrl = post.images?.[0]?.url || extractImageFromContent(post.content);

      return `
        <div class="related-post-card">
          <img src="${imageUrl}" alt="${post.title}">
          <div class="related-card-content">
            <a href="post.html?title=${formattedTitle}" target="_self">
              <h3>${post.title}</h3>
            </a>
          </div>
        </div>
      `;
    });

    relatedPostsContainer.innerHTML = relatedMarkup.length ? relatedMarkup.join("") : "<p>No related posts found.</p>";
  } catch (error) {
    console.error("Error fetching related posts:", error);
    relatedPostsContainer.innerHTML = "<p>Error loading related posts.</p>";
  }
}

document.addEventListener("DOMContentLoaded", fetchPost);
