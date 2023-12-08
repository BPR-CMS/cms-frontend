import { Attribute } from "./Attribute";
export interface Post {
  postId: string;
  collectionId: string;
  attributes: Attribute[];
  userId: string;
}
