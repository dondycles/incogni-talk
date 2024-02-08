import { Tables } from "@/database.types";
import { User } from "@supabase/supabase-js";

declare global {
  type Users = Tables<"users"> | null | undefined;

  interface PostsEditHistory extends Tables<"post_edits_history"> {
    users?: Users;
    posts?: PostsTypes;
  }

  type PostsEditHistoryTypes = PostsEditHistory | undefined | null;

  interface CommentsEditHistory extends Tables<"comment_edits_history"> {
    users?: Users;
    comments?: CommentsTypes;
  }

  type CommentsEditHistoryTypes = CommentsEditHistory | undefined | null;

  interface Comments extends Tables<"comments"> {
    users?: Users;
    posts?: PostsTypes;
  }
  type CommentsTypes = Comments | null | undefined;

  interface Likes {
    users?: Users;
    posts?: PostsTypes;
    comments?: CommentsTypes;
    liker: string | undefined;
  }
  type LikesTypes = Likes | null | undefined;

  interface Posts extends Tables<"posts"> {
    users?: Users;
    comments?: CommentsTypes[];
    likes?: LikesTypes[];
  }
  type PostsTypes = Posts | null | undefined;

  type UserData =
    | {
        cookieData?: { user: User } | undefined;
        dbData?: Tables<"users"> | undefined;
      }
    | undefined;
}
