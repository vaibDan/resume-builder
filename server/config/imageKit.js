import ImageKit from '@imagekit/nodejs';
import * as dotenv from 'dotenv';

// Load environment variables before initializing ImageKit
dotenv.config();

// // Validate env keys up front to make debugging easier when uploads fail
// const missingKeys = [];
// if (!process.env.IMAGEKIT_PUBLIC_KEY || process.env.IMAGEKIT_PUBLIC_KEY.trim() === '') missingKeys.push('IMAGEKIT_PUBLIC_KEY');
// if (!process.env.IMAGEKIT_PRIVATE_KEY || process.env.IMAGEKIT_PRIVATE_KEY.trim() === '') missingKeys.push('IMAGEKIT_PRIVATE_KEY');
// if (!process.env.IMAGEKIT_URL_ENDPOINT || process.env.IMAGEKIT_URL_ENDPOINT.trim() === '') missingKeys.push('IMAGEKIT_URL_ENDPOINT');

// if (missingKeys.length) {
//   console.warn(`[ImageKit] Missing environment variables: ${missingKeys.join(', ')} - image uploads may fail.`);
// }

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT
});



export default imagekit;