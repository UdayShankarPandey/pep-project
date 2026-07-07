import ImageKit from '@imagekit/nodejs';

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY || 'your_public_key_here',
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY || 'your_private_key_here',
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT || 'your_url_endpoint_here'
});

export default imagekit;
