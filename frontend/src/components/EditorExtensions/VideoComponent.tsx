import { useRef } from 'react';
import BaseComponent from './BaseComponent';
import { NodeViewProps } from '@tiptap/react';

const VideoComponent = (props: NodeViewProps) => {
  const { node } = props;
  const vidRef = useRef<HTMLVideoElement>(null);

  const videoEl = (
    <video
      data-idbkey={node.attrs.idbKey}
      controls
      ref={vidRef}
      width={node.attrs.width}
      className="w-full h-full"
    >
        <source src={node.attrs.src} type={node.attrs.type}/>
    </video>
  );

  return <BaseComponent {...props} enableAlign enableResize enableCaption mediaRef={vidRef} mediaElement={videoEl} />;
};

export default VideoComponent;
