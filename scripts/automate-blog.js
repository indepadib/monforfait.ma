const fs = require('fs');
const path = require('path');

// Paths
const STATE_PATH = path.join(__dirname, '../lib/automation-state.json');
const PREPARED_PATH = path.join(__dirname, '../lib/prepared-articles.json');
const BLOG_DATA_PATH = path.join(__dirname, '../lib/blog-data.ts');

async function automate() {
  try {
    // 1. Load state
    const state = JSON.parse(fs.readFileSync(STATE_PATH, 'utf8'));
    const index = state.last_index;

    // 2. Load prepared articles
    const prepared = JSON.parse(fs.readFileSync(PREPARED_PATH, 'utf8'));

    if (index >= prepared.length) {
      console.log('No more prepared articles to publish.');
      return;
    }

    const post = prepared[index];
    // Update date to today
    post.date = new Date().toISOString().split('T')[0];

    // 3. Update blog-data.ts
    let blogDataContent = fs.readFileSync(BLOG_DATA_PATH, 'utf8');
    
    // Find the start of the array
    const startMarker = 'export const BLOG_POSTS: BlogPost[] = [';
    const splitIndex = blogDataContent.indexOf(startMarker) + startMarker.length;

    if (splitIndex === -1) {
      throw new Error('Could not find BLOG_POSTS array in blog-data.ts');
    }

    const postString = `\n    ${JSON.stringify(post, null, 4)},`;
    
    const newContent = blogDataContent.slice(0, splitIndex) + postString + blogDataContent.slice(splitIndex);

    fs.writeFileSync(BLOG_DATA_PATH, newContent);

    // 4. Update state
    state.last_index = index + 1;
    state.next_run = new Date(Date.now() + 3.5 * 24 * 60 * 60 * 1000).toISOString(); // Approx 3.5 days later
    fs.writeFileSync(STATE_PATH, JSON.stringify(state, null, 2));

    console.log(`Successfully published: ${post.title}`);
  } catch (error) {
    console.error('Automation failed:', error);
    process.exit(1);
  }
}

automate();
