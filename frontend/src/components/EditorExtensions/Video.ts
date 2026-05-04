import { Node, ReactNodeViewRenderer } from '@tiptap/react';
import VideoComponent from './VideoComponent';

export const Video = Node.create({
    name: "video",

    group: "block",
    selectable: true,
    draggable: true,
    atom: false,

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
            controls: {
                default: true,
                parseHTML: (element: HTMLElement) => element.getAttribute('controls'),
                renderHTML: (attributes: Record<string, any>) => ({
                  controls: attributes.controls,
                }),
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
          const img = element.querySelector('video');
          if (!img) return false;
          
          const captionEl = element.querySelector('p.caption');
          
          return {
            src: img.getAttribute('src'),
            type: img.getAttribute('type'),
            idbKey: img.getAttribute('data-idbkey') || null,
            width: element.getAttribute('width') || element.style.width || '300px',
            align: element.classList.contains('mr-auto') ? 'left' : 
                   element.classList.contains('ml-auto') ? 'right' : 'center',
            caption: captionEl?.textContent || '',
          };
        }
      },
      {
        tag: 'video[src]',
        getAttrs: (element: HTMLElement) => ({
          src: element.getAttribute('src'),
          type: element.getAttribute('type'),
          idbKey: element.getAttribute('data-idbkey'),
        })
      }
    ];
  },

  renderHTML({ HTMLAttributes }: { HTMLAttributes: Record<string, any> }) {
    const { src, type, width, align, caption, controls } = HTMLAttributes
    console.log(HTMLAttributes)

    const tailwindAlignClass =
      align === 'left'
        ? 'mr-auto'
        : align === 'right'
        ? 'ml-auto'
        : 'mx-auto'

    const videoChildren = [
      [
        'video',
        {
          'data-idbkey': HTMLAttributes['data-idbkey'],
          src,
          type,
          controls,
          class: 'w-full h-full',
        },
      ],
    ]

    if (caption) {
      videoChildren.push([
        'p',
        {
          class: 'caption text-center text-[1rem] text-gray-300 mt-1',
        },
        caption,
      ])
    }

    return [
      'div',
      {
        width,
        class: `file relative max-w-full ${tailwindAlignClass}`,
        style: `width: ${width}`
      },
      ...videoChildren,
    ]
  },

    addNodeView() {
        return ReactNodeViewRenderer(VideoComponent);
    },
});

