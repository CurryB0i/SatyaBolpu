import { useRef } from 'react';
import BaseComponent from './BaseComponent';
import { NodeViewProps } from '@tiptap/react';

const VideoComponent = (props: NodeViewProps) => {
  const { node } = props;
  const IFrameRef = useRef<HTMLDivElement | null>(null);

  const IFrameEl = (
      <div
          className='w-fit mx-auto'
          data-iframe-embed
          ref={IFrameRef}
          dangerouslySetInnerHTML={{ __html: node.attrs.html }}
      />
  );

  return <BaseComponent {...props} enableCaption mediaRef={IFrameRef} mediaElement={IFrameEl} />;
};

export default VideoComponent;

