import ImageKit from '@imagekit/nodejs';
import * as dotenv from 'dotenv';

// Load environment variables before initializing ImageKit
dotenv.config();

const imagekit = new ImageKit({
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY, // This is the default and can be omitted
});



export default imagekit;