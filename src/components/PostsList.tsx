import {FlatList} from 'react-native';
import {getPostDTO} from '../types/postDTO';
import {PostCard} from './PostCard';

type PostListProps = {
  posts: getPostDTO[];
  getNewPosts?: () => void;
  getBasePosts: () => void;
  isLoadingPosts: boolean;
};

export function PostsList({
  posts,
  getNewPosts,
  getBasePosts,
  isLoadingPosts,
}: PostListProps) {
  return (
    <FlatList
      contentContainerStyle={{paddingBottom: 80}}
      showsVerticalScrollIndicator={false}
      data={posts}
      onEndReached={() => {
        getNewPosts && getNewPosts();
      }}
      onEndReachedThreshold={0.1}
      onRefresh={getBasePosts}
      refreshing={isLoadingPosts}
      renderItem={({item}) => {
        return <PostCard postData={item} />;
      }}
    />
  );
}
