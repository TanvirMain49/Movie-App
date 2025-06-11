/* eslint-disable react-hooks/exhaustive-deps */
import MovieCard from "@/components/MovieCard";
import SearchBar from "@/components/SearchBar";
import { icons } from "@/constants/icons";
import { images } from "@/constants/images";
import { fetchMovies } from "@/services/api";
import { updateSearchCount } from "@/services/appwrite";
import { useFetch } from "@/services/useFetch";
import React, { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Image, Text, View } from "react-native";

const Search = () => {
  const [search, setSearch] = useState("");
  const fetchMoviesFn = useCallback(
    () => fetchMovies({ query: search }),
    [search]
  );
  const {
    data: movies,
    loader,
    error,
    refetch: loadMovies,
    reset,
  } = useFetch(fetchMoviesFn, false);

  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      if (search.trim()) {
        await loadMovies();
      } else {
        reset();
      }
    }, 800);

    return () => clearTimeout(timeoutId);
  }, [loadMovies]);

  useEffect(() => {
    if (movies && movies.length > 0 && search.trim()) {
      updateSearchCount(search, movies[0]);
    }
  }, [movies]);

  return (
    <View className="flex-1 bg-primary">
      <Image
        source={images.bg}
        className="absolute w-full z-0 flex-1"
        resizeMode="cover"
      />

      <FlatList
        data={movies}
        renderItem={({ item }) => <MovieCard {...item} />}
        keyExtractor={(item) => item.id.toString()}
        numColumns={3}
        className="px-5"
        columnWrapperStyle={{
          justifyContent: "center",
          gap: 20,
          marginVertical: 16,
        }}
        contentContainerStyle={{ paddingBottom: 100 }}
        ListHeaderComponent={
          <>
            <View className="w-full justify-center items-center">
              <Image
                source={icons.logo}
                className="w-12 h-10 mt-20 mb-5 mx-auto"
              />
            </View>

            <View className="my-5">
              <SearchBar
                placeholder="Search movies..."
                value={search}
                onChangeText={(text: string) => setSearch(text)}
              />
            </View>

            {loader && (
              <ActivityIndicator
                size="large"
                color="#0000ff"
                className="my-3"
              />
            )}

            {error && (
              <Text className="text-red-700 px-5 my-3">
                {" "}
                Error:{error.message}
              </Text>
            )}
            {!loader && !error && search.trim() && movies?.length > 0 && (
              <Text className="text-xl text-white font-bold">
                Search for <Text className="text-accent">{search}</Text>
              </Text>
            )}
          </>
        }
        ListEmptyComponent={
          !loader && !error ? (
            <View className="mt-10 px-5">
              <Text className="text-gray-500 text-center">
                {search.trim() ? "No movie found" : "Search for movie"}
              </Text>
            </View>
          ) : null
        }
      />
    </View>
  );
};

export default Search;
