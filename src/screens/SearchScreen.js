import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  FlatList,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
} from "react-native";
import axios from "axios";
import { NEWS_API_KEY } from "../config";
import { Ionicons } from "@expo/vector-icons";

const SearchScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [articles, setArticles] = useState([]);
  const [error, setError] = useState(null);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerStyle: { backgroundColor: "#4A90E2" },
      headerTintColor: "#fff",
      headerTitleStyle: { fontFamily: "Roboto-Medium", fontSize: 20 },
      headerTitle: "Tìm Kiếm Tin Tức",
    });
  }, [navigation]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchQuery.length > 2 && searchQuery.trim() !== "") {
        const fetchSearchResults = async () => {
          try {
            const response = await axios.get(
              `https://newsdata.io/api/1/news?apikey=${NEWS_API_KEY}&q=${encodeURIComponent(
                searchQuery
              )}&language=en`
            );
            setArticles(response.data.results || []);
            setError(null);
          } catch (error) {
            if (error.response && error.response.status === 429) {
              setError("Quá nhiều yêu cầu. Vui lòng thử lại sau.");
            } else if (error.response && error.response.status === 401) {
              setError("Khóa API không hợp lệ. Vui lòng kiểm tra lại.");
            } else {
              setError(
                "Không thể tìm kiếm tin tức. Vui lòng thử từ khóa khác."
              );
            }
            console.error("Lỗi khi tìm kiếm tin tức:", error);
          }
        };
        fetchSearchResults();
      } else {
        setArticles([]);
        setError(null);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.itemContainer}
      onPress={() => navigation.navigate("Detail", { article: item })}
      activeOpacity={0.8}
    >
      <Image
        source={{
          uri: item.image_url || "https://via.placeholder.com/100",
        }}
        style={styles.image}
        resizeMode="cover"
      />
      <View style={styles.textContainer}>
        <Text style={styles.title} numberOfLines={2}>
          {item.title || "Không có tiêu đề"}
        </Text>
        <Text style={styles.description} numberOfLines={2}>
          {item.description || "Không có mô tả"}
        </Text>
        <Text style={styles.date}>
          {item.pubDate
            ? new Date(item.pubDate).toLocaleDateString("vi-VN")
            : "Không có ngày"}
        </Text>
      </View>
    </TouchableOpacity>
  );

  if (error) {
    return (
      <View style={styles.center}>
        <Ionicons name="warning-outline" size={48} color="#F6AD55" />
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Ionicons
          name="search"
          size={20}
          color="#9CA3AF"
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Tìm kiếm tin tức..."
          placeholderTextColor="#9CA3AF"
          value={searchQuery}
          onChangeText={setSearchQuery}
          autoCapitalize="none"
        />
      </View>
      <FlatList
        data={articles}
        renderItem={renderItem}
        keyExtractor={(item, index) => item.link || index.toString()}
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            {searchQuery.length > 2
              ? "Không tìm thấy tin tức"
              : "Nhập từ khóa để tìm kiếm"}
          </Text>
        }
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={5}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: "#F9FAFB",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 5,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 50,
    fontSize: 16,
    fontFamily: "Roboto-Regular",
    color: "#2D3748",
  },
  itemContainer: {
    flexDirection: "row",
    marginBottom: 15,
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 5,
  },
  image: {
    width: 130,
    height: 130,
    borderRadius: 12,
  },
  textContainer: {
    flex: 1,
    marginLeft: 15,
    justifyContent: "center",
  },
  title: {
    fontSize: 18,
    fontFamily: "Roboto-Medium",
    color: "#2D3748",
    marginBottom: 6,
  },
  description: {
    fontSize: 14,
    fontFamily: "Roboto-Regular",
    color: "#4B5563",
    marginBottom: 6,
  },
  date: {
    fontSize: 12,
    fontFamily: "Roboto-Regular",
    color: "#9CA3AF",
  },
  errorText: {
    fontSize: 16,
    fontFamily: "Roboto-Regular",
    color: "#F6AD55",
    textAlign: "center",
    marginVertical: 12,
    paddingHorizontal: 20,
  },
  emptyText: {
    textAlign: "center",
    fontSize: 16,
    fontFamily: "Roboto-Regular",
    color: "#4B5563",
    marginTop: 20,
  },
});

export default SearchScreen;
