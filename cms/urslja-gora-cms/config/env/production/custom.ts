export default ({ env }) => ({
  cloudCommunityMediaVerified: env.bool('CLOUD_COMMUNITY_MEDIA_VERIFIED', false),
  requireFirstCloudAdmin: true,
});
