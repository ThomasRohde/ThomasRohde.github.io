// Test script to debug blog functionality
import { loadBlogPosts } from './lib/blogService.js';

console.log('Testing blog post loading...');

async function testBlogLoading() {
  try {
    console.log('Calling loadBlogPosts()...');
    const posts = await loadBlogPosts();
    console.log('Posts loaded:', posts.length);

    if (posts.length > 0) {
      console.log('First post:', {
        title: posts[0].title,
        slug: posts[0].slug,
        published: posts[0].published,
        publishedDate: posts[0].publishedDate,
      });
    } else {
      console.log('No posts found!');
    }
  } catch (error) {
    console.error('Error loading posts:', error);
  }
}

testBlogLoading();
