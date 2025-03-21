const cloudflareProxy = "https://broken-hall-68ac.earnmoney100a.workers.dev/";

const pathSegments = window.location.pathname.split("/");
const postSlug = decodeURIComponent(pathSegments[pathSegments.length - 1]).replace(/-/g, " ");

const breadcrumbs = document.getElementById("breadcrumbs");
const postTitle = document.getElementById("post-title");
const postMeta = document.getElementById("post-meta");
const postContent = document.getElementById("post-content");
const relatedPostsContainer = document.getElementById("related-posts");

// Fetch post by title
async function fetchPost() {
  try {
    const response = await fetch(`${cloudflareProxy}?maxResults=100`);
    const data = await response.json();
    const post = data.items.find(p => p.title.toLowerCase() === postSlug.toLowerCase());

    if (!post) {
      postContent.innerHTML = "<p>Post not found.</p>";
      return;
    }

    postTitle.textContent = post.title;
    postMeta.innerHTML = `By Jinvani | ${new Date(post.published).toLocaleDateString()}`;
    postContent.innerHTML = post.content;

    breadcrumbs.innerHTML = `<a href="/Blogger/">Home</a> › <a href="/Blogger/blog">All Posts</a>`;
    
    fetchRelatedPosts(post.title);
  } catch (error) {
    console.error("Error fetching post:", error);
    postContent.innerHTML = "<p>Error loading post. Please try again.</p>";
  }
}

// Fetch related posts
async function fetchRelatedPosts(currentTitle) {
  try {
    const response = await fetch(`${cloudflareProxy}?maxResults=100`);
    const data = await response.json();

    const excludedLabels = ["ncert", "pyq", "Blog", "Physics11", "Neet", "Latest update", "latest"];
    const relatedPosts = data.items.filter(post => 
      post.title !== currentTitle &&
      (!post.labels || !post.labels.some(label => excludedLabels.includes(label.toLowerCase())))
    ).slice(0, 5);

    if (relatedPosts.length === 0) {
      relatedPostsContainer.innerHTML = "<p>No related posts found.</p>";
      return;
    }

    relatedPostsContainer.innerHTML = relatedPosts.map(post => {
      const imageUrl = post.images?.[0]?.url || extractImageFromContent(post.content);
      const postSlug = encodeURIComponent(post.title.toLowerCase().replace(/ /g, "-"));
      
      return `
        <div class="related-post-card">
          <img src="${imageUrl}" alt="${post.title}">
          <div class="related-card-content">
            <a href="/Blogger/post/${postSlug}"><h3>${post.title}</h3></a>
          </div>
        </div>
      `;
    }).join("");
  } catch (error) {
    console.error("Error fetching related posts:", error);
    relatedPostsContainer.innerHTML = "<p>Error loading related posts.</p>";
  }
}

document.addEventListener("DOMContentLoaded", fetchPost);
