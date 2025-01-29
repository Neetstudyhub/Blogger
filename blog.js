// Initialize Supabase
const supabaseUrl = 'YOUR_SUPABASE_PROJECT_URL';
const supabaseKey = 'YOUR_SUPABASE_ANON_KEY';
const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

// Load posts from Supabase
async function loadPosts() {
    const { data, error } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false });

    if (data) {
        const postsContainer = document.getElementById('posts');
        postsContainer.innerHTML = data.map(post => `
            <div class="post">
                <h2>${post.title}</h2>
                <p>${post.content}</p>
                <small>By ${post.author} • ${new Date(post.created_at).toLocaleDateString()}</small>
            </div>
        `).join('');
    }
}

// Initial load
loadPosts();
