import { types, flow } from "mobx-state-tree"
import axios from "axios"

// Define a model for Reactions
const ReactionsModel = types.model("Reactions", {
  likes: types.number,
  dislikes: types.number,
})

// Define a model for the Post
const PostModel = types.model("Post", {
  id: types.identifierNumber,
  title: types.string,
  body: types.string,
  tags: types.array(types.string),
  reactions: ReactionsModel,
  views: types.number,
  userId: types.number,
})

// Define the PostsStore to manage the list of posts
const PostsStore = types
  .model("PostsStore", {
    posts: types.array(PostModel),
    isLoading: types.boolean,
    error: types.maybeNull(types.string),
    page: types.optional(types.number, 1),
    hasMore: types.optional(types.boolean, true),
  })
  .actions((self) => ({
    // Fetch posts from the API with pagination
    fetchPosts: flow(function* (userId) {
      if (!self.hasMore) return

      self.isLoading = true
      self.error = null
      try {
        const response = yield axios.get(
          `https://dummyjson.com/users/${userId}/posts?limit=10&skip=${(self.page - 1) * 10}`,
        )
        if (response.data.posts.length > 0) {
          self.posts.push(...response.data.posts)
          self.page += 1
        } else {
          self.hasMore = false
        }
      } catch (error) {
        self.error = error.message
      } finally {
        self.isLoading = false
      }
    }),
    resetPosts() {
      self.posts.clear()
      self.page = 1
      self.hasMore = true
    },
  }))

export const postsStore = PostsStore.create({
  posts: [],
  isLoading: false,
  error: null,
})

export default PostsStore
