import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import axios from "axios";
import Animated, { FadeInUp } from "react-native-reanimated";
import { NEWS_API_KEY } from "../config";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

const HomeScreen = ({ navigation }) => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          style={{ marginRight: 15 }}
          onPress={() => navigation.navigate("Search")}
        >
          <Ionicons name="search" size={24} color="#fff" />
        </TouchableOpacity>
      ),
      headerStyle: { backgroundColor: "#4A90E2" },
      headerTintColor: "#fff",
      headerTitleStyle: { fontFamily: "Roboto-Medium", fontSize: 20 },
      headerTitle: "Tin Tức",
    });
  }, [navigation]);

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      try {
        const cachedArticles = await AsyncStorage.getItem("cachedArticles");
        if (cachedArticles) {
          setArticles(JSON.parse(cachedArticles));
          setLoading(false);
          return;
        }

        const response = await axios.get(
          `https://newsdata.io/api/1/news?apikey=${NEWS_API_KEY}&country=us&language=en`
        );
        const fetchedArticles = response.data.results || [];
        setArticles(fetchedArticles);
        await AsyncStorage.setItem(
          "cachedArticles",
          JSON.stringify(fetchedArticles)
        );
        setError(null);
      } catch (error) {
        if (error.response && error.response.status === 429) {
          setError("Quá nhiều yêu cầu. Vui lòng thử lại sau.");
        } else if (error.response && error.response.status === 401) {
          setError("Khóa API không hợp lệ. Vui lòng kiểm tra lại.");
        } else {
          setError(
            "Không thể tải tin tức. Vui lòng kiểm tra kết nối hoặc thử lại."
          );
        }
        console.error("Lỗi khi tải tin tức:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, []);

  const handleRefresh = async () => {
    await AsyncStorage.removeItem("cachedArticles");
    setArticles([]);
    const fetchNews = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `https://newsdata.io/api/1/news?apikey=${NEWS_API_KEY}&country=us&language=en`
        );
        const fetchedArticles = response.data.results || [];
        setArticles(fetchedArticles);
        await AsyncStorage.setItem(
          "cachedArticles",
          JSON.stringify(fetchedArticles)
        );
        setError(null);
      } catch (error) {
        if (error.response && error.response.status === 429) {
          setError("Quá nhiều yêu cầu. Vui lòng thử lại sau.");
        } else if (error.response && error.response.status === 401) {
          setError("Khóa API không hợp lệ. Vui lòng kiểm tra lại.");
        } else {
          setError(
            "Không thể tải tin tức. Vui lòng kiểm tra kết nối hoặc thử lại."
          );
        }
        console.error("Lỗi khi tải tin tức:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  };

  const renderItem = ({ item, index }) => (
    <Animated.View entering={FadeInUp.delay(index * 100).duration(500)}>
      <TouchableOpacity
        style={styles.itemContainer}
        onPress={() => navigation.navigate("Detail", { article: item })}
        activeOpacity={0.8}
      >
        <Image
          source={{
            uri: item.image_url || "https://via.placeholder.com/150",
          }}
          style={styles.image}
          resizeMode="cover"
        />
        <View style={styles.textContainer}>
          <Text style={styles.title} numberOfLines={2}>
            {item.title || "Không có tiêu đề"}
          </Text>
          <Text style={styles.date}>
            {item.pubDate
              ? new Date(item.pubDate).toLocaleDateString("vi-VN")
              : "Không có ngày"}
          </Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );

  return (
    <View style={styles.container}>
      {loading && <ActivityIndicator size="large" color="#4A90E2" />}
      {error && (
        <Text style={styles.errorText}>
          {error}
          {"\n"}
          <Text style={{ color: "#F97316" }} onPress={handleRefresh}>
            Bấm để thử lại
          </Text>
        </Text>
      )}
      {!loading && !error && (
        <FlatList
          data={articles}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 20 }}
          refreshing={loading}
          onRefresh={handleRefresh}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  itemContainer: {
    marginHorizontal: 15,
    marginVertical: 10,
    borderRadius: 12,
    backgroundColor: "#fff",
    flexDirection: "row",
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    overflow: "hidden",
  },
  image: {
    width: 110,
    height: 90,
    borderRadius: 12,
  },
  textContainer: {
    flex: 1,
    padding: 10,
    justifyContent: "center",
  },
  title: {
    fontSize: 16,
    fontFamily: "Roboto-Medium",
    color: "#2D3748",
  },
  date: {
    fontSize: 12,
    fontFamily: "Roboto-Regular",
    color: "#9CA3AF",
    marginTop: 5,
  },
  errorText: {
    textAlign: "center",
    marginTop: 20,
    color: "#E53E3E",
    fontSize: 16,
  },
});

export default HomeScreen;
