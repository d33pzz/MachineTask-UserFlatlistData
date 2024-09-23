// App.js

import React from "react"
import { NavigationContainer } from "@react-navigation/native"
import { createStackNavigator } from "@react-navigation/stack"
import UserList from "./components/UserList"
import UserPosts from "./components/UserPost"

const Stack = createStackNavigator()

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="UserList">
        <Stack.Screen name="UserList" component={UserList} options={{ title: "User List" }} />
        <Stack.Screen name="UserPosts" component={UserPosts} options={{ title: "User Posts" }} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}
