import { useNavigate } from "react-router-dom";
import CardList from "../components/CardList";
import Title from "../components/Title";
import { usePost } from "../context/PostContext";
import useApi from "../hooks/useApi";
import { CardType } from "../types/enums";

const Posts = () => {
  const navigate = useNavigate();
  const postApi = useApi('/posts', { auto: false });
  const { dispatch: postDispatch } = usePost();

  const handleEdit = async (id: string) => {
    if(!id) return;
    const { post } = await postApi.refetch({ endpoint: `/posts/${id}` });
    postDispatch({
      type: 'SAVE_POST',
      payload: {
        post: {
          details: {
            mainTitle: post.mainTitle,
            shortTitle: post.shortTitle,
            culture: post.culture,
            image: post.image,
            tags: post.tags,
            description: post.description,
            locationSpecific: !!post?.location
          },
          content: post.content,
          location: post.location
        }
      }
    });
    navigate('/create/post');
  }

  return (
    <div 
      className="w-full min-h-screen py-20"
    >
      <Title title="All Posts"/>
      <CardList 
        cardType={CardType.NORMAL_CARD}
        cardsPerPage={10}
        apiEndpoint="posts"
        orientation="column"
        handleEdit={handleEdit}
      />
    </div>
  )
};

export default Posts;
