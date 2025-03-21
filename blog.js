const cloudflareProxy = "https://broken-hall-68ac.earnmoney100a.workers.dev/";
const maxResults = 100;
const postsPerBatch = 6;

let latestPosts = [];
let displayedPosts = 0;

const blogContainer = document.getElementById("blog-container");
const loadMoreBtn = document.getElementById("load-more-btn");
const skeletonLoader = document.getElementById("skeletonLoader");
const endMessage = document.getElementById("end-message");

// Format date to "Month Day, Year"
function formatDate(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });
}

// Extract first image from content
function extractImageFromContent(content) {
  const imgTagMatch = content.match(/<img[^>]+src="([^">]+)"/);
  return imgTagMatch ? imgTagMatch[1] : "https://via.placeholder.com/300x200";
}

// Fetch posts from Blogger
async function fetchBloggerPosts() {
  try {
    const response = await fetch(`${cloudflareProxy}?maxResults=${maxResults}`);
    const data = await response.json();
    
    if (!data.items || data.items.length === 0) throw new Error("No posts found.");

    // Filter by label "jinvani"
    const filteredPosts = data.items.filter(post => 
      post.labels && post.labels.some(label => label.toLowerCase() === "jinvani")
    );

    if (filteredPosts.length === 0) throw new Error("No posts with the 'jinvani' label found.");

    latestPosts = filteredPosts.map(post => {
      const { title, content, labels, published } = post;
      const imageUrl = post.images?.[0]?.url || extractImageFromContent(content);
      const formattedDate = published ? formatDate(published) : "Unknown Date";
      const contentSnippet = content.replace(/<\/?[^>]+(>|$)/g, "").substring(0, 120);
      return { title, labels: labels || [], imageUrl, published: formattedDate, contentSnippet };
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

// Display posts
function displayPosts() {
  const postsToDisplay = latestPosts.slice(displayedPosts, displayedPosts + postsPerBatch);
  const postCards = postsToDisplay.map(post => {
    const { title, labels, imageUrl, published, contentSnippet } = post;
    const postSlug = encodeURIComponent(title.toLowerCase().replace(/ /g, "-"));
    
    return `
      <div class="card">
        <a href="/Blogger/post/${postSlug}">
          <div class="card-image">
            <img src="${imageUrl}" alt="${title}" />
          </div>
        </a>
        <div class="card-content">
          <h3><a href="/Blogger/post/${postSlug}">${title}</a></h3>
          <p class="post-description">${contentSnippet}...</p>
          <span class="published-date">By Jinvani • ${published}</span>
        </div>
      </div>
    `;
  });

  blogContainer.innerHTML += postCards.join("");
  displayedPosts += postsToDisplay.length;

  if (displayedPosts >= latestPosts.length) {
    loadMoreBtn.style.display = "none";
    endMessage.style.display = "block";
  }
}

// Load more posts
function loadMorePosts() {
  loadMoreBtn.disabled = true;
  loadMoreBtn.innerHTML = "Loading...";
  setTimeout(() => {
    displayPosts();
    loadMoreBtn.innerHTML = "Load More";
    loadMoreBtn.disabled = false;
  }, 500);
}

loadMoreBtn.addEventListener("click", loadMorePosts);
document.addEventListener("DOMContentLoaded", fetchBloggerPosts);
