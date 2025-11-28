export enum SocialNetwork {
  LINKEDIN = 'linkedin',
  TWITTER = 'twitter',
  FACEBOOK = 'facebook',
  INSTAGRAM = 'instagram',
  UNKNOWN = 'unknown'
}

export enum PostStatus {
  TO_VERIFY = 'A vérifier',
  VALIDATED = 'Validé',
  REJECTED = 'Rejeté'
}

export interface Post {
  id: string; // uuid
  created_at: string;
  article_blog_url: string;
  social_network: SocialNetwork | string;
  text: string;
  image: string | null; // Path in storage or Full URL
  status: PostStatus | string;
  publication_date: string | null;
}

export interface PostUpdatePayload {
  text?: string;
  status?: string;
  publication_date?: string | null;
  image?: string | null;
}