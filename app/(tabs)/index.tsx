import MovieCard from "@/components/MovieCard";
import TrendingMovies from "@/components/TrendingMovies";
import { icons } from "@/constants/icons";
import { images } from "@/constants/images";
import { fetchMovies } from "@/services/api";
import { getTrendingMovie } from "@/services/appwrite";
import { useFetch } from "@/services/useFetch";
import { useRouter } from "expo-router";
import { useCallback } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Text,
  View,
} from "react-native";
import SearchBar from "../../components/SearchBar";

export default function Index() {
  const router = useRouter();

  const {
    data: trendingMovies,
    loader: trendingLoader,
    error: trendingError,
  } = useFetch(getTrendingMovie);

  const fetchMoviesFn = useCallback(() => fetchMovies({ query: "" }), []);
  const {
    data: movies,
    loader: movieLoader,
    error: movieError,
  } = useFetch(fetchMoviesFn);

  // Combine loading and error states for both fetches
  const isLoading = movieLoader || trendingLoader;
  const errorMsg = movieError?.message || trendingError?.message;

  return (
    <View className="flex-1 bg-primary">
      <Image
        source={images.bg}
        className="absolute w-full z-0"
        resizeMode="cover"
      />

      <FlatList
        data={movies}
        renderItem={({ item }) => <MovieCard {...item} />}
        keyExtractor={(item) => item.id.toString()}
        numColumns={3}
        columnWrapperStyle={{
          justifyContent: "flex-start",
          gap: 20,
          paddingRight: 5,
          marginBottom: 10,
        }}
        contentContainerStyle={{
          minHeight: "100%",
          paddingBottom: 32,
          paddingHorizontal: 20,
        }}
        ListHeaderComponent={
          <>
            <Image source={icons.logo} className="w-12 h-10 mt-20 mb-5 mx-auto" />
            <SearchBar
              onPress={() => {
                router.push("/search");
              }}
              placeholder="Search for a movie"
            />
            <Text className="text-lg text-white font-bold mt-5 mb-3">
              Trending movies
            </Text>
            {trendingMovies && (
              <FlatList
                data={trendingMovies}
                horizontal
                showsHorizontalScrollIndicator={false}
                ItemSeparatorComponent={() => <View className="w-4" />}
                renderItem={({ item, index }) => (
                  <TrendingMovies {...item} index={index} />
                )}
                keyExtractor={(item, index) => index.toString()}
                style={{ marginBottom: 16 }}
              />
            )}
            <Text className="text-lg text-white font-bold mt-5 mb-3">
              Latest Movies
            </Text>
            {isLoading && (
              <ActivityIndicator
                size="large"
                color="#0000ff"
                className="mt-10 self-center"
              />
            )}
            {errorMsg && (
              <Text className="text-red-700 px-5 my-3">
                Error: {errorMsg}
              </Text>
            )}
          </>
        }
        ListEmptyComponent={
          !isLoading && !errorMsg ? (
            <View className="mt-10 px-5">
              <Text className="text-gray-500 text-center">
                No movies found.
              </Text>
            </View>
          ) : null
        }
        scrollEnabled={true}
      />
    </View>
  );
}
