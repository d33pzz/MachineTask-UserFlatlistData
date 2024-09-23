import { types, flow } from "mobx-state-tree"
import axios from "axios"

// Define a model for the User
const UserModel = types.model("User", {
  id: types.identifierNumber,
  firstName: types.string,
  lastName: types.string,
  age: types.number,
  gender: types.string,
  email: types.string,
  phone: types.string,
  username: types.string,
  birthDate: types.string,
  image: types.string,
  address: types.model({
    address: types.string,
    city: types.string,
    state: types.string,
    country: types.string,
  }),
  company: types.model({
    name: types.string,
    department: types.string,
    title: types.string,
  }),
  role: types.string,
})

// Define a store to manage the list of users
const UserStore = types
  .model("UserStore", {
    users: types.array(UserModel),
    isLoading: types.boolean,
    error: types.maybeNull(types.string),
    searchTerm: types.optional(types.string, ""),
    page: types.optional(types.number, 1),
    hasMore: types.optional(types.boolean, true),
  })
  .views((self) => ({
    get filteredUsers() {
      // Filter users based on the search term
      if (self.searchTerm.trim() === "") return self.users
      const lowerSearch = self.searchTerm.toLowerCase()
      return self.users.filter(
        (user) =>
          user.firstName.toLowerCase().includes(lowerSearch) ||
          user.lastName.toLowerCase().includes(lowerSearch),
      )
    },
  }))
  .actions((self) => ({
    // Fetch users from the API with pagination
    fetchUsers: flow(function* () {
      if (!self.hasMore) return

      self.isLoading = true
      self.error = null
      try {
        const response = yield axios.get(
          `https://dummyjson.com/users?limit=10&skip=${(self.page - 1) * 10}`,
        )
        if (response.data.users.length > 0) {
          self.users.push(...response.data.users)
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
    setSearchTerm(term) {
      self.searchTerm = term
    },
    resetUsers() {
      self.users.clear()
      self.page = 1
      self.hasMore = true
      self.fetchUsers()
    },
  }))

export const userStore = UserStore.create({
  users: [],
  isLoading: false,
  error: null,
})

export default UserStore
