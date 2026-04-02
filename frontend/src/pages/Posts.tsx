import { useEffect, useState } from "react";
import CardList from "../components/CardList";
import Title from "../components/Title";
import useApi from "../hooks/useApi";
import { CardType } from "../types/enums";
import { toast } from "react-toastify";
import { CardProps, IPost } from "../types/globals";

const Posts = () => {
  const [posts, setPosts] = useState<CardProps[]>([]);
  const postsApi = useApi('/posts');

  useEffect(() => {
    if(postsApi.data) {
      const data: (IPost & { _id: string })[] = postsApi.data.posts;
      console.log(data, postsApi.data.posts)
      setPosts(
        data.map(d => ({
          id: d._id,
          title: d.shortTitle,
          description: d.description,
          images: [d.image],
          route: d._id
        }))
      );
    }

    if(postsApi.error) {
      setPosts([]);
      toast.error(postsApi.error);
    }
  }, [postsApi.data, postsApi.error]);

  return (
    <div 
      className="w-full min-h-screen py-20"
    >
      <Title title="All Posts"/>
      <CardList 
        cardType={CardType.NORMAL_CARD}
        cardsPerPage={10}
        cardsDataList={posts}
        loading={postsApi.loading}
        orientation="column"
      />
    </div>
  )
};

export default Posts;
