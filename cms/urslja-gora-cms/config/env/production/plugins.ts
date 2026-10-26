export default ({ env }) => ({
  cloud: { enabled: false },
  // Use the managed Cloud upload storage. No Cloudinary account is required.
  upload: { config: { provider: 'local', sizeLimit: env.int('UPLOAD_MAX_FILE_SIZE', 50 * 1024 * 1024) } },
});
