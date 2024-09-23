import React, { useEffect } from "react"
import { observer } from "mobx-react-lite"
import { View, Text, FlatList, ActivityIndicator, StyleSheet, Image } from "react-native"
import Icon from "react-native-vector-icons/Ionicons" // Importing icons
import { userStore } from "app/stores/UserStore"
import { postsStore } from "app/stores/PostStore"
import {
  ACTIVITYINDICATORCLR,
  BACKGROUNDCOLOR,
  PRIMARYBORDERCOLOR,
  PRIMARYICONCOLOR,
  PUREBLACK,
  PUREWHITE,
  SECONDARYTEXTCOLOR,
} from "app/constants/Colors"

const UserPosts = observer(({ route }) => {
  const { userId } = route.params

  // Get user details from userStore
  const user = userStore.users.find((user) => user.id === userId)

  useEffect(() => {
    postsStore.resetPosts()
    postsStore.fetchPosts(userId)
  }, [userId])

  const loadMorePosts = () => {
    if (!postsStore.isLoading) {
      postsStore.fetchPosts(userId)
    }
  }

  const renderPostItem = ({ item }) => (
    <View style={styles.postCard}>
      <Text style={styles.postTitle}>{item.title}</Text>
      <Text style={styles.postBody}>{item.body}</Text>
      <View style={styles.postDetails}>
        <Text style={styles.detailText}>Tags: {item.tags.join(", ")}</Text>
        <View style={styles.horizontalLine} />
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <View style={{ flexDirection: "row" }}>
            <View style={styles.rowLayout}>
              <Icon name="thumbs-up-outline" size={16} color={PRIMARYICONCOLOR} />
              <Text style={styles.detailText}>{item.reactions.likes}</Text>
            </View>

            <View style={[styles.rowLayout, { marginLeft: 5 }]}>
              <Icon name="thumbs-down-outline" size={16} color={PRIMARYICONCOLOR} />
              <Text style={styles.detailText}>{item.reactions.dislikes}</Text>
            </View>
          </View>

          <View style={styles.rowLayout}>
            <Icon name="eye" size={16} color={PRIMARYICONCOLOR} />
            <Text style={styles.detailText}>{item.views}</Text>
          </View>
        </View>
      </View>
    </View>
  )

  const renderUserInfo = () => (
    <View style={styles.userInfoContainer}>
      <Image source={{ uri: user.image }} style={styles.userImage} />
      <View style={styles.userDetails}>
        <Text style={styles.userName}>
          {user.firstName} {user.lastName}
        </Text>
        <View style={styles.infoRow}>
          <View style={styles.widthAdj}>
            <Icon name="person-circle-outline" size={16} color={PRIMARYICONCOLOR} />
          </View>
          <Text style={styles.detailText}>{user.username}</Text>
        </View>
        <View style={styles.infoRow}>
          <View style={styles.widthAdj}>
            <Icon name="mail-outline" size={16} color={PRIMARYICONCOLOR} />
          </View>
          <Text style={styles.detailText}>{user.email}</Text>
        </View>
        <View style={styles.infoRow}>
          <View style={styles.widthAdj}>
            <Icon name="call-outline" size={16} color={PRIMARYICONCOLOR} />
          </View>
          <Text style={styles.detailText}>{user.phone}</Text>
        </View>
        <View style={styles.infoRow}>
          <View style={styles.widthAdj}>
            <Icon name="calendar-outline" size={16} color={PRIMARYICONCOLOR} />
          </View>
          <Text style={styles.detailText}>{user.age}</Text>
        </View>
        <View style={styles.infoRow}>
          <View style={styles.widthAdj}>
            <Icon name="location-outline" size={16} color={PRIMARYICONCOLOR} />
          </View>
          <Text style={styles.detailText}>
            {user.address.address}, {user.address.city},{user.address.state}, {user.address.country}
          </Text>
        </View>
        <View style={styles.infoRow}>
          <View style={styles.widthAdj}>
            <Icon name="business-outline" size={16} color={PRIMARYICONCOLOR} />
          </View>
          <Text style={styles.detailText}>{user.company.name}</Text>
        </View>
        <View style={styles.infoRow}>
          <View style={styles.widthAdj}>
            <Icon name="briefcase-outline" size={16} color={PRIMARYICONCOLOR} />
          </View>
          <Text style={styles.detailText}> {user.company.title}</Text>
        </View>
      </View>
    </View>
  )

  if (postsStore.isLoading && postsStore.page === 1) {
    return <ActivityIndicator size="large" color={ACTIVITYINDICATORCLR} style={styles.loading} />
  }

  if (postsStore.error) {
    return <Text style={styles.error}>{postsStore.error}</Text>
  }

  return (
    <View style={styles.container}>
      {user && renderUserInfo()}
      {postsStore.posts.length === 0 && !postsStore.isLoading ? (
        <Text style={styles.noPosts}>There are no posts for this user.</Text>
      ) : (
        <FlatList
          data={postsStore.posts}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderPostItem}
          onEndReached={loadMorePosts}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            postsStore.isLoading ? (
              <ActivityIndicator size="small" color={ACTIVITYINDICATORCLR} />
            ) : null
          }
        />
      )}
    </View>
  )
})

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: BACKGROUNDCOLOR, // Updated background for a better look
  },
  userInfoContainer: {
    flexDirection: "row",
    padding: 15,
    backgroundColor: PUREWHITE,
    marginBottom: 15,
    borderRadius: 10,
    shadowColor: PUREBLACK,
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 5,
  },
  userImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 15,
  },
  userDetails: {
    flex: 1,
    justifyContent: "center",
  },
  userName: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 5,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 2,
  },
  widthAdj: { width: 20 },
  horizontalLine: { flex: 1, height: 1, backgroundColor: SECONDARYTEXTCOLOR, marginVertical: 5 },
  rowLayout: { flexDirection: "row", alignItems: "center" },
  detailText: {
    fontSize: 14,
    color: SECONDARYTEXTCOLOR,
    marginLeft: 5,
  },
  postCard: {
    padding: 15,
    marginVertical: 8,
    backgroundColor: PUREWHITE,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: PRIMARYBORDERCOLOR,
    shadowColor: PUREBLACK,
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 5,
  },
  postTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  postBody: {
    marginVertical: 5,
    color: SECONDARYTEXTCOLOR,
  },
  postDetails: {
    marginTop: 10,
  },
  loading: {
    marginTop: 20,
  },
  error: {
    color: "red",
    textAlign: "center",
    marginTop: 20,
  },
  noPosts: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: SECONDARYTEXTCOLOR,
  },
})

export default UserPosts
