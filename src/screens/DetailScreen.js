import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Linking,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const DetailScreen = ({ route, navigation }) => {
  const { article } = route.params;

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerStyle: { backgroundColor: "#4A90E2" },
      headerTintColor: "#fff",
      headerTitleStyle: { fontFamily: "Roboto-Medium", fontSize: 20 },
      headerTitle: "Chi Tiết Tin Tức",
    });
  }, [navigation]);

  return (
    <ScrollView style={styles.container}>
      <Image
        source={{
          uri: article.image_url || "https://via.placeholder.com/300",
        }}
        style={styles.image}
        resizeMode="cover"
      />
      <View style={styles.contentContainer}>
        <Text style={styles.title}>{article.title || "Không có tiêu đề"}</Text>
        <Text style={styles.date}>
          {article.pubDate
            ? new Date(article.pubDate).toLocaleDateString("vi-VN")
            : "Không có ngày"}
        </Text>
        <Text style={styles.content}>
          {article.description || article.content || "Không có nội dung"}
        </Text>
        {article.link && (
          <TouchableOpacity
            style={[styles.linkButton, { backgroundColor: "#F97316" }]}
            onPress={() => Linking.openURL(article.link)}
            activeOpacity={0.8}
          >
            <View style={styles.buttonContent}>
              <Ionicons name="open-outline" size={20} color="#fff" />
              <Text style={styles.linkButtonText}>Đọc bài viết đầy đủ</Text>
            </View>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={[styles.backButton, { backgroundColor: "#4A90E2" }]}
          onPress={() => navigation.goBack()}
          activeOpacity={0.8}
        >
          <View style={styles.buttonContent}>
            <Ionicons name="arrow-back" size={20} color="#fff" />
            <Text style={styles.backButtonText}>Quay lại</Text>
          </View>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  image: {
    width: "100%",
    height: 250,
    borderRadius: 12,
    marginBottom: 15,
  },
  contentContainer: {
    paddingHorizontal: 15,
    paddingBottom: 20,
  },
  title: {
    fontSize: 20,
    fontFamily: "Roboto-Medium",
    color: "#2D3748",
    marginBottom: 10,
  },
  date: {
    fontSize: 14,
    fontFamily: "Roboto-Regular",
    color: "#9CA3AF",
    marginBottom: 10,
  },
  content: {
    fontSize: 16,
    fontFamily: "Roboto-Regular",
    color: "#4B5563",
    lineHeight: 24,
    marginBottom: 20,
  },
  linkButton: {
    marginBottom: 15,
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  backButton: {
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  linkButtonText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "Roboto-Medium",
    marginLeft: 8,
  },
  backButtonText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "Roboto-Medium",
    marginLeft: 8,
  },
});

export default DetailScreen;
