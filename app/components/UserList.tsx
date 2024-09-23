// src/components/UserList.js

import React, { useEffect } from "react"
import { observer } from "mobx-react-lite"
import {
  View,
  Text,
  Image,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native"
import { useNavigation } from "@react-navigation/native"
import Icon from "react-native-vector-icons/MaterialIcons" // Import Material Icons
import { userStore } from "app/stores/UserStore"
import { ACTIVITYINDICATORCLR, PRIMARYBORDERCOLOR, PRIMARYICONCOLOR, PUREBLACK, PUREWHITE, SECONDARYBORDERCOLOR, SECONDARYICONCOLOR, SECONDARYTEXTCOLOR } from "app/constants/Colors"

const UserList = observer(() => {
  const navigation = useNavigation() // Use the hook to get navigation

  useEffect(() => {
    userStore.resetUsers()
  }, [])

  // Handling search input
  const handleSearch = (text) => {
    userStore.setSearchTerm(text)
  }

  const loadMoreUsers = () => {
    if (!userStore.isLoading) {
      userStore.fetchUsers()
    }
  }

  const renderUserItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate("UserPosts", { userId: item.id })}
    >
      <Image source={{ uri: item.image }} style={styles.userImage} />
      <View style={styles.userInfo}>
        <Text style={styles.userName}>
          {item.firstName} {item.lastName}
        </Text>
        <View style={styles.userDetailsLayout}>
          <Icon name="email" size={16} color={PRIMARYICONCOLOR} style={styles.icon} />

          <Text style={styles.userDetail}> {item.email}</Text>
        </View>
        <View style={styles.userDetailsLayout}>
          <Icon name="business" size={16} color={PRIMARYICONCOLOR} style={styles.icon} />
          <Text style={styles.userDetail}>
            {" "}
            {item.company.name.length > 20
              ? `${item.company.name.substring(0, 20)}...`
              : item.company.name}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  )

  if (userStore.isLoading && userStore.page === 1) {
    return <ActivityIndicator size="large" color={ACTIVITYINDICATORCLR} style={styles.loading} />
  }

  if (userStore.error) {
    return <Text style={styles.error}>{userStore.error}</Text>
  }

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Icon name="search" size={20} color={SECONDARYICONCOLOR} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by name"
          onChangeText={handleSearch}
          value={userStore.searchTerm}
        />
      </View>
      <FlatList
        data={userStore.filteredUsers}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderUserItem}
        onEndReached={loadMoreUsers}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          userStore.isLoading ? <ActivityIndicator size="small" color={ACTIVITYINDICATORCLR} /> : null
        }
        removeClippedSubviews={true} // Improve performance for large lists
        initialNumToRender={10} // Reduce initial render count
        maxToRenderPerBatch={5} // Reduce batch size
        updateCellsBatchingPeriod={50} // Control batch rendering
        windowSize={10} // Adjust the window size
      />
    </View>
  )
})

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: SECONDARYBORDERCOLOR,
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  searchIcon: {
    marginRight: 5,
  },
  searchInput: {
    flex: 1,
    height: 40,
  },
  card: {
    flexDirection: "row",
    padding: 10,
    borderWidth: 1,
    borderColor: PRIMARYBORDERCOLOR,
    borderRadius: 8,
    marginBottom: 10,
    backgroundColor: PUREWHITE,
    shadowColor: PUREBLACK,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  userImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  userInfo: {
    marginLeft: 10,
    justifyContent: "center",
  },
  userName: {
    fontWeight: "bold",
    fontSize: 16,
  },
  userDetailsLayout: {
    marginTop: 4,
    flexDirection: "row",
    alignItems: "center",
  },
  userDetail: {
    color: SECONDARYTEXTCOLOR,
  },
  error: {
    color: "red",
    textAlign: "center",
    marginTop: 20,
  },
  loading: {
    marginTop: 20,
  },
})

export default UserList
