import { Node, ReactNodeViewRenderer } from '@tiptap/react';
import AudioComponent from './AudioComponent';

export const Audio = Node.create({
  name: 'audio',

  group: 'block',
  selectable: true,
  draggable: true,
  atom: true,

  addAttributes() {
    return {
        idbKey: {
          default: null,
          parseHTML: (element: HTMLElement) => element.getAttribute('data-idbkey'),
          renderHTML: (attributes: Record<string, any>) => ({
            'data-idbkey': attributes.idbKey
          })
        },
        src: {
            default: null,
            parseHTML: (element: HTMLElement) => element.getAttribute('src'),
            renderHTML: (attributes: Record<string, any>) => ({
              src: attributes.src,
            }),
        },
        type: {
            default: null,
            parseHTML: (element: HTMLElement) => element.getAttribute('type'),
              renderHTML: (attributes: Record<string, any>) => ({
                type: attributes.type,
            }),
        },
        controls : {
            default: true,
            parseHtml: (element: HTMLElement) => element.getAttribute('controls'),
            renderHTML: (attributes: Record<string, any>) => ({
                controls: attributes.controls
            })
        },
        width: {
            default: '300px',
            parseHTML: (element: HTMLElement) => element.getAttribute('width') || '300px',
              renderHTML: (attributes) => ({ width: attributes.width }),
        },
        align: {
            default: 'center',
            parseHTML: (element) => element.getAttribute('align') || 'center',
              renderHTML: (attributes) => ({
                'align': attributes.align,
            }),
        },
        caption: {
            default: '',
            parseHTML: (element: HTMLElement) => {
                const captionElement = element.querySelector('p.caption')
                return captionElement?.textContent ?? ''
            },
            renderHTML: (attributes: Record<string, any>) => ({
                caption: attributes.caption,
            }),
        },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'div.file',
        priority: 100,
        getAttrs: (element: HTMLElement) => {
          const img = element.querySelector('audio');
          if (!img) return false;
          
          const captionEl = element.querySelector('p.caption');
          
          return {
            src: img.getAttribute('src'),
            type: img.getAttribute('type'),
            idbKey: img.getAttribute('data-idbkey') || null,
            width: element.getAttribute('width') || element.style.width || '300px',
            caption: captionEl?.textContent || '',
          };
        }
      },
      {
        tag: 'audio[src]',
        getAttrs: (element: HTMLElement) => ({
          src: element.getAttribute('src'),
          type: element.getAttribute('type'),
          idbKey: element.getAttribute('data-idbkey'),
        })
      }
    ];
  },

  renderHTML({ HTMLAttributes }) {
    const { src, type, width, caption, controls } = HTMLAttributes

    const audioChildren = [
      [
        'audio',
        {
          'data-idbkey': HTMLAttributes['data-idbkey'],
          src,
          type,
          controls,
          class: 'w-full',
        },
      ],
    ]

    if (caption) {
      audioChildren.push([
        'p',
        {
          class: 'caption text-center text-[1rem] text-gray-300 mt-2',
        },
        caption,
      ])
    }

    return [
      'div',
      {
        class: `file relative max-w-full mx-auto`,
        style: `width: ${width}`
      },
      ...audioChildren,
    ]
  },

  addNodeView() {
    return ReactNodeViewRenderer(AudioComponent);
  },
});

