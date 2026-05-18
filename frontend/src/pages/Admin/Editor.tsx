import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { TextStyle } from '@tiptap/extension-text-style'
import { FontSize } from '../../components/EditorExtensions/FontSize'
import { Placeholder } from '@tiptap/extension-placeholder'
import { RiAttachmentLine } from 'react-icons/ri';
import { GrBlockQuote } from "react-icons/gr";
import { MdCancel, MdPreview } from "react-icons/md";
import { useCallback, useEffect, useRef, useState } from 'react';
import { FaBold, FaItalic, FaUnderline, FaUndo, FaRedo, FaSave } from 'react-icons/fa';
import { ResizableImage } from '../../components/EditorExtensions/Image';
import { Video } from '../../components/EditorExtensions/Video';
import { Audio } from '../../components/EditorExtensions/Audio';
import Button from '../../components/Button';
import { Iframe } from '../../components/EditorExtensions/Iframe';
import { useAuth } from '../../context/AuthContext';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import Title from '../../components/Title';
import { Mode } from '../../types/enums';
import useApi from '../../hooks/useApi';
import { validateCultureDetails, validatePostDetails } from '../../utils/validate';
import { CultureState, PostState } from '../../types/globals';
import { BASE_URL } from '../../App';

type clickedType = {
  bold: boolean;
  italic: boolean;
  underline: boolean;
};

const Editor = ({ mode }: { mode: Mode }) => {
  const { id } = useParams();
  const { state: authState } = useAuth();
  const navigate = useNavigate();
  const culturesApi = useApi('/cultures', { auto: false });
  const postsApi = useApi('/posts', { auto: false });
  const draftsApi = useApi('/drafts', { auto: false });
  const uploadApi = useApi('/upload/single', { auto: false });

  const [clicked, setClicked] = useState<clickedType>({
    bold: false,
    italic: false,
    underline: false,
  });
  const [cultureState, setCultureState] = useState<CultureState | null>(null);
  const [postState, setPostState] = useState<PostState | null>(null);
  const [editorState, setEditorState] = useState<'editing' | 'preview'>('editing');
  const [title, setTitle] = useState<string>('Title');
  const [body, setBody] = useState<string>('');
  const [fontSize, setFontSize] = useState<string>('normal');
  const [showAttachmentMenu, setShowAttachmentMenu] = useState<boolean>(false);
  const [askEmbedUrl, setAskEmbedUrl] = useState<boolean>(false);
  const [embedUrl, setEmbedUrl] = useState<string>('');

  const titleRef = useRef<HTMLTextAreaElement | null>(null);
  const fileRef = useRef<HTMLInputElement | null>(null);
  const attachmentRef = useRef<HTMLDivElement | null>(null);
  const objectUrls = useRef<string[]>([]);

  useEffect(() => {
    const fetchDetails = async () => {
      const res = await draftsApi.refetch({ endpoint: `/drafts/${id}`, method: 'GET' });
      if (!res) return;
      setTitle(res.draft.details.title);
      if (mode === Mode.CULTURE) {
        if (!validateCultureDetails(res.draft.details)) {
          navigate(`/create/culture/${id}/details`);
        } else {
          setCultureState({
            content: res.draft.content ?? '',
            details: res.draft.details
          });
        }
      } else if (mode === Mode.POST) {
        if (!validatePostDetails(res.draft.details)) {
          navigate(`/create/post/${id}/details`);
        } else {
          setPostState({
            content: res.draft.content ?? '',
            details: res.draft.details,
            location: res.draft.location
          });
        }
      }
    }

    fetchDetails();
  }, [id]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (attachmentRef.current && !attachmentRef.current.contains(e.target as Node)) {
        setShowAttachmentMenu(false);
      }
    }

    window.addEventListener('mousedown', handleClick);

    return () => window.removeEventListener('mousedown', handleClick);
  }, [])

  const editor = useEditor({
    extensions: [
      StarterKit,
      TextStyle,
      FontSize,
      ResizableImage,
      Video,
      Audio,
      Iframe,
      Placeholder.configure({
        placeholder: '...',
        emptyEditorClass: 'is-editor-empty',
        showOnlyWhenEditable: true,
      })
    ],
    content: '',
    onCreate: async ({ editor }) => {
      const content = (() => {
        if (mode === Mode.POST) {
          return postState?.content || '';
        } else {
          return cultureState?.content || '';
        }
      })();
      const parser = new DOMParser();
      const doc = parser.parseFromString(content, 'text/html');
      editor.commands.setContent(doc.documentElement.outerHTML);
    },
    onUpdate: ({ editor }) => {
      setClicked({
        bold: editor.isActive('bold'),
        italic: editor.isActive('italic'),
        underline: editor.isActive('underline')
      });
      setFontSize(
        editor.getAttributes('textStyle').fontSize || 'normal'
      );
    }
  }, [cultureState?.content, postState?.content]);


  useEffect(() => {
    if (titleRef.current) {
      titleRef.current.style.height = 'auto';
      titleRef.current.style.height = `${titleRef.current.scrollHeight}px`;
    }
  }, [title, editorState]);

  const handleFontSize = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (editor) {
      setFontSize(e.target.value);
      editor.chain().focus().setFontSize(e.target.value).run();
    }
  }

  const handleClick = useCallback((button: keyof clickedType) => {
    const chain = editor?.chain().focus();
    if (!chain) {
      setClicked({ bold: false, italic: false, underline: false });
      return;
    }

    setClicked(prev => {
      const newState = {
        ...prev,
        [button]: !prev[button],
      };

      if (newState[button]) {
        chain.setMark(button).run();
      } else {
        chain.unsetMark(button).run();
      }

      return newState;
    });
  }, [editor]);

  const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const type = file.type.split('/')[0];
      const url = URL.createObjectURL(file);
      objectUrls.current.push(url);
      if (type === 'image') {
        editor?.commands.insertContent({
          type: "image",
          attrs: {
            src: url
          }
        })
      } else if (type === 'video') {
        editor?.commands.insertContent({
          type: "video",
          attrs: {
            src: url,
            controls: true
          }
        })
      } else if (type == 'audio') {
        editor?.commands.insertContent({
          type: "audio",
          attrs: {
            src: url,
            controls: true
          }
        })
      }
    }
  }

  useEffect(() => {
    return () => {
      objectUrls.current?.forEach(URL.revokeObjectURL);
    };
  }, []);

  const handleEmbedUrl = () => {
    if (embedUrl) {
      setAskEmbedUrl(false)
      editor.commands.insertContent({
        type: "iframeEmbed",
        attrs: {
          html: embedUrl
        }
      })
    }
  }

  // const formatHtml = (html: string) => {
  //   return html
  //     .replace(/<p>(.*?)<\/p>/gi, (_, content) => content.trim() === '' ? '<br>' : `${content}<br>`)
  //     .replace(/(<br>\s*)+$/g, '');
  // };

  const decodeHtml = (html: string) => {
    const txt = document.createElement('textarea')
    txt.innerHTML = html;
    return txt.value;
  }

  const uploadFiles = async (content: string): Promise<string> => {
    if (!content) return '';

    const parser = new DOMParser();
    const doc = parser.parseFromString(content, 'text/html');
    const body = doc.body;

    for (let i = 0; i < body.children.length; i++) {
      const child = body.children[i];

      if (child.className.includes('file')) {
        const fileEl = child.querySelector('[src]');
        
        if (fileEl) {
          const src = fileEl.getAttribute("src");
          if(!src?.startsWith("blob:") && !src?.startsWith("data:")) continue;
          const blob = await fetch(src).then(res => res.blob());
          const formData = new FormData();
          formData.append("file", blob);
          const res = await uploadApi.post(formData);
          fileEl.setAttribute("src", `${BASE_URL}${res.path}`);
        }
      }
    }

    return doc.documentElement.outerHTML;
  }

  const handleSave = useCallback(async () => {
  if (!editor) return;

  const content = await uploadFiles(editor.getHTML());

  const isPost = mode === Mode.POST;
  const state = isPost ? postState : cultureState;
  const api = isPost ? postsApi : culturesApi;

  if (!state) return;

  if (title !== state.details?.title) {
    await api.refetch({
      endpoint: `/${isPost ? 'posts' : 'cultures'}/draft/${id}/details`,
      method: "POST",
      body: {
        details: {
          ...state.details,
          title
        }
      }
    });
  }

  const res = await api.refetch({
    endpoint: `/${isPost ? 'posts' : 'cultures'}/draft/${id}/content`,
    method: "POST",
    body: { content }
  });

  if (!res) {
    toast.error("Error while saving.");
    return;
  }

  if(mode === Mode.POST) {
    setPostState(prev => prev ? { ...prev, content } : null);
  } else {
    setCultureState(prev => prev ? { ...prev, content } : null);
  }

  toast.success("Saved successfully.");

}, [editor, title, mode, postState, cultureState, id, postsApi, culturesApi]);

  const handlePreview = useCallback(() => {
    if (editor) {
      setEditorState((prev) => prev === 'editing' ? 'preview' : 'editing');
      setBody(editor.getHTML());
    }
  }, [editor]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && !e.shiftKey) {
        const key = e.key.toLowerCase();

        if (['b', 'i', 'u'].includes(key)) {
          e.preventDefault();
          editor.chain().focus();
          const keyToButton: Record<string, keyof clickedType> = {
            b: "bold",
            i: "italic",
            u: "underline",
          };
          const button = keyToButton[key] || "underline";
          handleClick(button)
          return
        }

        editor.chain().blur()
        if (key === 'p') {
          e.preventDefault()
          handlePreview()
        } else if (key === 's') {
          e.preventDefault();
          handleSave();
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [editor, handleSave, handlePreview, handleClick, editorState]);

  useEffect(() => {
    const videos = document.querySelectorAll('video');
    videos.forEach((vid) => {
      vid.pause();
      vid.currentTime = 0;
    });

    const audios = document.querySelectorAll('audio');
    audios.forEach((aud) => {
      aud.pause();
      aud.currentTime = 0;
    });

    const iframes = document.querySelectorAll('iframe');
    iframes.forEach((iframe) => {
      const src = iframe.src;
      iframe.src = '';
      iframe.src = src;
    });
  }, [editorState]);

  if (!authState.token || authState.user?.role !== "admin")
    return <Navigate to={'/404'} replace />

  return (
    <div className="w-full relative">
      <div className={`w-full relative flex-col items-center justify-center gap-10 py-20 bg-black
               ${askEmbedUrl ? 'pointer-events-none' : ''} 
               ${editorState === 'preview' ? 'hidden' : 'flex'}`}>
        <div className={`w-full h-full absolute top-0 z-10 bg-white bg-opacity-50 overflow-hidden
                   pointer-events-none ${askEmbedUrl ? '' : 'hidden'}`}
        ></div>
        {
          askEmbedUrl &&
          <div 
            className='fixed w-2/3 md:w-1/2 lg:w-1/3 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
              flex flex-col gap-5 items-center justify-center bg-black text-primary text-center p-5
              rounded-xl pointer-events-auto z-50'
          >
            <MdCancel
              className={`absolute text-[2rem] right-0 top-0 cursor-pointer m-5 bg-black 
                text-primary rounded-full hover:scale-110 z-50`}
              onClick={() => {
                setAskEmbedUrl(false);
              }} />
            <label htmlFor="url" className='font-black text-[1.5rem]'>Enter Embed Url</label>
            <input
              type="url"
              name='url'
              className='w-4/5 p-2 text-black'
              onInput={(e) => setEmbedUrl((e.target as HTMLInputElement).value)} />
            <Button
              content='Submit'
              className='text-[1.2rem]'
              onClick={handleEmbedUrl} />
          </div>
        }
        <div className="w-full flex flex-col justify-center items-center gap-10 mb-10">
          <textarea
            className="text-primary w-4/5 text-4xl sm:text-6xl text-center font-bold bg-black overflow-hidden
              text-wrap focus:outline-none resize-none"
            value={title}
            rows={1}
            ref={titleRef}
            onChange={(e) => setTitle(e.target.value)}
          />

          <div className="flex items-center justify-center w-4/5 sm:w-2/3 lg:w-1/2 mx-auto">
            <div className="w-1/2 border-t-2 border-solid border-primary"></div>
            <span className="mx-4 text-xl text-primary font-bold">ॐ</span>
            <div className="w-1/2 border-t-2 border-solid border-primary grow"></div>
          </div>
        </div>

        <EditorContent
          editor={editor}
          className='text-white text-[1.5rem] w-[90%] p-5 wrap-break-word text-justify'
        />

        <div className='flex md:flex-row flex-col gap-5 sticky bottom-10 items-center justify-center'>
          <div className="flex items-center justify-center gap-2 bg-white p-3 rounded-full">

            <div className='relative flex flex-col items-center justify-center' ref={attachmentRef}>
              <button
                className={`text-[1.2rem] sm:text-[2rem] cursor-pointer hover:scale-110 bg-none p-1 rounded-lg `}
                onClick={() => setShowAttachmentMenu(!showAttachmentMenu)}>
                <RiAttachmentLine />
                <input
                  type="file"
                  ref={fileRef}
                  onChange={handleFileInput}
                  accept='video/*,image/*,audio/*'
                  className='hidden'
                />
              </button>
              <ul className={`list-none text-nowrap absolute left-0 bg-white text-center bottom-full 
                            mb-5 rounded-xl overflow-hidden transition-all duration-200 ${showAttachmentMenu ? 'h-auto' : 'h-0'}`}>
                <li
                  className='p-2 border border-solid border-t-2 hover:bg-primary cursor-pointer'
                  onClick={() => { setShowAttachmentMenu(false); fileRef.current?.click() }}
                >Upload File</li>
                <li
                  className='p-2 border border-solid border-t-2 hover:bg-primary cursor-pointer'
                  onClick={() => { setShowAttachmentMenu(false); setAskEmbedUrl(true) }}
                >Embed</li>
              </ul>
            </div>

            <select
              className='text-center outline-none cursor-pointer'
              name="size"
              value={fontSize}
              onChange={handleFontSize}
            >
              <option value="small">Small</option>
              <option value="normal">Normal</option>
              <option value="large">Large</option>
              <option value="huge">Huge</option>
            </select>

            <button
              className={`sm:text-[1.5rem] cursor-pointer hover:scale-110 bg-none p-1 rounded-lg  ${clicked.bold ? 'text-primary scale-110' : 'text-black'
                }`}
              onClick={() => handleClick('bold')}
            >
              <FaBold />
            </button>

            <button
              className={`sm:text-[1.5rem] cursor-pointer hover:scale-110 bg-none p-1 rounded-lg  ${clicked.italic ? 'text-primary scale-110' : 'text-black'
                }`}
              onClick={() => handleClick('italic')}
            >
              <FaItalic />
            </button>

            <button
              className={`sm:text-[1.5rem] cursor-pointer hover:scale-110 bg-none p-1 rounded-lg  ${clicked.underline ? 'text-primary scale-110' : 'text-black'
                }`}
              onClick={() => handleClick('underline')}
            >
              <FaUnderline />
            </button>

            <button
              className={`sm:text-[2rem] cursor-pointer hover:scale-110 bg-none p-1 rounded-lg `}
              onClick={() => editor?.commands.toggleBlockquote()}
            >
              <GrBlockQuote />
            </button>

            <button
              className="sm:text-[1.5rem] cursor-pointer hover:scale-110 bg-none p-1 rounded-lg text-black "
              onClick={() => editor.chain().focus().undo().run()}
            >
              <FaUndo />
            </button>

            <button
              className="sm:text-[1.5rem] cursor-pointer hover:scale-110 bg-none p-1 rounded-lg text-black "
              onClick={() => editor.chain().focus().redo().run()}
            >
              <FaRedo />
            </button>
          </div>

          <div className='bg-white p-3 rounded-full flex gap-3 items-center justify-center'>
            <button
              className={`text-[2.5rem] cursor-pointer hover:scale-110 bg-none rounded-lg text-black 
                                 ${editorState === 'preview' ? 'text-primary' : ''}`}
              onClick={() => handlePreview()}>
              <MdPreview />
            </button>

            <button
              className={`text-[2rem] cursor-pointer hover:scale-110 bg-none rounded-lg text-black 
                        ${editorState === 'preview' ? 'text-primary' : ''}`}
              onClick={() => handleSave()}>
              <FaSave />
            </button>
          </div>

        </div>
      </div>

      <div
        className={`w-full relative flex-col
         items-center justify-center gap-10 bg-black py-20 
          ${editorState === 'preview' ? 'flex' : 'hidden'}`}>
        {
          <MdCancel
            className={`absolute text-[2.5rem] right-0 top-0 cursor-pointer m-5 bg-black 
            text-primary rounded-full hover:scale-110 z-50`}
            id='cancel'
            onClick={() => {
              setEditorState('editing');
            }} />
        }
        <Title title={title} />

        <div
          className='text-white text-[1.5rem] w-[90%] p-5 wrap-break-word whitespace-pre-wrap text-justify'
          dangerouslySetInnerHTML={{
            __html: decodeHtml(body)
          }}
        >
        </div>

      </div>

      <div className="w-full flex items-center justify-between p-10">
        <div
          className="text-white text-[1.2rem] sm:text-[1.75rem] cursor-pointer hover:text-primary"
          onClick={() =>
            mode === Mode.POST ?
              navigate(`/create/post/${id}/details`) :
              navigate(`/create/culture/${id}/details`)
          }
        >
          {
            mode === Mode.POST ?
              `< Post Details` :
              `< Culture Details`
          }
        </div>

        {
          postState?.content && mode === Mode.POST && (
            <div
              className="text-white text-[1.2rem] sm:text-[1.75rem] cursor-pointer hover:text-primary"
              onClick={() => navigate(postState?.details?.locationSpecific ? `/create/post/${id}/map` : `/create/post/${id}`)}>
              {postState?.details?.locationSpecific ? `Map >` : 'Upload Post >'}
            </div>
          )
        }
        {
          cultureState?.content && mode === Mode.CULTURE && (
            <div
              className="text-white text-[1.2rem] sm:text-[1.75rem] cursor-pointer hover:text-primary"
              onClick={() => navigate(`/create/culture/${id}`)}>
              {`Upload Culture >`}
            </div>
          )
        }
      </div>

    </div>
  );
};

export default Editor;