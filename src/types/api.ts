export type ApiUser = {
  _id: string;
  name: string;
  username: string;
  email: string;
  photo: string;
  cover?: string;
  dateOfBirth?: string;
  gender?: "male" | "female";
  createdAt?: string;
};

export type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
};

export type AuthPayload = {
  token: string;
  tokenType?: string;
  expiresIn?: string;
  user: ApiUser;
};

export type PostAuthor = Pick<ApiUser, "_id" | "name" | "username" | "photo">;

export type Post = {
  _id: string;
  body: string;
  image?: string;
  user: PostAuthor;
  createdAt: string;
  updatedAt?: string;
  comments?: Comment[] | number;
  likes?: number;
};

export type Comment = {
  _id: string;
  content: string;
  image?: string;
  user: PostAuthor;
  post?: string;
  createdAt: string;
};

export type PostsListData = {
  posts: Post[];
  page?: number;
  limit?: number;
  total?: number;
  nextPage?: number | null;
};

export type CommentsListData = {
  comments: Comment[];
  page?: number;
  limit?: number;
  total?: number;
  nextPage?: number | null;
};

export type ProfileData = ApiUser & {
  posts?: Post[];
  followers?: number;
  following?: number;
};