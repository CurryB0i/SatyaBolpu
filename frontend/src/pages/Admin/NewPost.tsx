import { useEffect, useMemo, useState } from "react";
import Button from "../../components/Button";
import Title from "../../components/Title";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useDialog } from "../../context/DialogBoxContext";
import useApi from "../../hooks/useApi";
import ProgressBar from "../../components/ProgressBar";
import { toast } from "react-toastify";
import { PostState } from "../../types/globals";
import { validatePostDetails } from "../../utils/validate";

const NewPost = () => {

  const { id } = useParams();

  const [progress, setProgress] = useState<number>(0);
  const [postState, setPostState] = useState<PostState | null>(null);

  const dialog = useDialog();
  const uploadApi = useApi('/upload/single', { auto: false });
  const draftsApi = useApi('/drafts', { auto: false });
  const postsApi = useApi('/posts', { auto: false })
  const navigate = useNavigate();
  const { state: authState } = useAuth();

  useEffect(() => {
    const fetchDraft = async () => {
      const res = await draftsApi.refetch({ endpoint: `/drafts/${id}`, method: 'GET' });
      if (!res) return;
      setPostState({
        details: validatePostDetails(res.draft.details) ? res.draft.details : null,
        content: res.draft.content ?? '',
        location: res.draft.location ?? null
      });
    }

    fetchDraft();
  }, [id]);

  const steps = useMemo(() => ({
    'Post Details': 'details',
    'Editor': 'editor',
    ...(postState?.details?.locationSpecific && { 'Map Details': 'map' })
  }), [postState?.details?.locationSpecific]);

  const handleUpload = () => {
    const uploadPost = async () => {
      if (!postState) return;
      const res = await postsApi.refetch({ endpoint: '/posts', method: 'POST', body: postState });
      if (res) {
        toast.success(`Post-${res.post.title} successfully uploaded.`)
        draftsApi.refetch({ endpoint: `/drafts/${id}`, method: "DELETE" });
        navigate('/create');
      }
    }

    dialog.popup({
      title: "Post Upload.",
      description:
        "Are you sure you want to add this post? The saved draft will be cleared on upload.",
      onConfirm: uploadPost,
    });
  };

  useEffect(() => {
    if (postsApi.error) {
      toast.error(postsApi.error);
      console.error(postsApi.error);
    }

    if(draftsApi.error) {
      toast.error(draftsApi.error);
      console.error(draftsApi.error);
    }

    if(uploadApi.error) {
      toast.error(uploadApi.error);
      console.error(uploadApi.error);
    }
  }, [postsApi.error, draftsApi.error, uploadApi.error]);

  const handleClearProgress = async () => {
    await postsApi.refetch({ endpoint: `/posts/draft/${id}/details`, method: "DELETE" });
    await postsApi.refetch({ endpoint: `/posts/draft/${id}/content`, method: "DELETE" });
    await postsApi.refetch({ endpoint: `/posts/draft/${id}/location`, method: "DELETE" });
  }

  if (!authState.token || authState.user?.role !== 'admin')
    return <Navigate to={'/404'} replace />

  if (!postState) return;

  return (
    <div className="mt-20 mb-40 flex flex-col gap-20 items-center justify-center">
      <Title title={postState.details ? `New Post - ${postState.details.title}` : 'New Draft Post'} />

      <div className="w-full flex flex-col items-center justify-center gap-20">
        <ProgressBar
          progress={progress}
          setProgress={setProgress}
          state={postState}
          steps={steps}
        />
        <div className="flex gap-10">
          {
            progress > 100 &&
            <Button
              content="Upload Post"
              onClick={handleUpload}
              loading={postsApi.loading || uploadApi.loading}
              loadingText="Uploading"
            />
          }

          <Button
            content="Clear Progress"
            onClick={handleClearProgress}
          />
        </div>

      </div>
    </div>
  )
}

export default NewPost;
