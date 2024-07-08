// test-script.js
import { writeFile } from 'fs/promises';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const testFunction = async () => {
  try {
    const testPath = join(__dirname, 'test-output.txt');
    await writeFile(testPath, 'This is a test file.');
    console.log(`Test file created successfully at ${testPath}`);
  } catch (error) {
    console.error('Error in test script:', error);
  }
};

testFunction();