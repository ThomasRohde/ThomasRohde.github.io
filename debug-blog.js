// Debug script to test blog loading
console.log('Testing blog post loading...');

// Test the glob pattern
try {
  const modules = import.meta.glob('/src/content/blog/*.mdx', {
    query: '?raw',
    import: 'default',
    eager: true,
  });

  console.log('Found modules:', Object.keys(modules));
  console.log('Module count:', Object.keys(modules).length);

  // Test first module
  const firstKey = Object.keys(modules)[0];
  if (firstKey) {
    console.log('First module key:', firstKey);
    console.log('First module content type:', typeof modules[firstKey]);
    console.log(
      'First module content preview:',
      modules[firstKey]?.substring(0, 200)
    );
  }
} catch (error) {
  console.error('Error loading modules:', error);
}
