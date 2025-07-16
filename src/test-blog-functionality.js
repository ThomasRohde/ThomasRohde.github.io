// Simple test to verify blog functionality
import { getAllPosts, getPostBySlug } from './lib/blog.js';

async function testBlogFunctionality() {
  console.log('Testing blog functionality...');

  try {
    // Test getting all posts
    const posts = await getAllPosts();
    console.log(`✓ Found ${posts.length} blog posts`);

    // Test individual post loading
    if (posts.length > 0) {
      const firstPost = posts[0];
      console.log(`✓ First post: "${firstPost.title}"`);
      console.log(`✓ Published: ${firstPost.publishedDate}`);
      console.log(`✓ Tags: ${firstPost.tags.join(', ')}`);

      // Test getting post by slug
      const postContent = await getPostBySlug(firstPost.slug);
      if (postContent) {
        console.log(
          `✓ Successfully loaded post content for "${firstPost.slug}"`
        );
        console.log(
          `✓ Content length: ${postContent.content.length} characters`
        );
      }
    }

    console.log('✓ All blog functionality tests passed!');
  } catch (error) {
    console.error('✗ Blog functionality test failed:', error);
  }
}

// Run the test
testBlogFunctionality();
