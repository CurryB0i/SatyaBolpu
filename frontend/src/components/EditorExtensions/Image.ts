import { ReactNodeViewRenderer } from '@tiptap/react'
import { Image } from '@tiptap/extension-image'
import ImageComponent from './ImageComponent'

export const ResizableImage = Image.extend({
  group: 'block',
  atom: true,
  addAttributes() {
    return {
      ...this.parent?.(),
      idbKey: {
        default: null,
        parseHTML: (element: HTMLElement) => element.getAttribute('data-idbkey'),
        renderHTML: (attributes: Record<string, any>) => ({
          'data-idbkey': attributes.idbKey
        })
      },
      width: {
        default: '300px',
        parseHTML: (element: HTMLElement) => 
          element.getAttribute('width') ?? '300px',
        renderHTML: (attributes: Record<string, any>) => ({
          width: attributes.width,
        }),
      },
      align: {
        default: 'center',
        parseHTML: (element: HTMLElement) =>
          element.getAttribute('align') ?? 'center',
        renderHTML: (attributes: Record<string, any>) => ({
          align: attributes.align,
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
    }
  },

  parseHTML() {
    return [
      {
        tag: 'div.file',
        priority: 100,
        getAttrs: (element: HTMLElement) => {
          const img = element.querySelector('img');
          if (!img) return false;
          
          const captionEl = element.querySelector('p.caption');
          
          return {
            src: img.getAttribute('src'),
            alt: img.getAttribute('alt'),
            idbKey: img.getAttribute('data-idbkey') || null,
            width: element.getAttribute('width') || element.style.width || '300px',
            align: element.classList.contains('mr-auto') ? 'left' : 
                   element.classList.contains('ml-auto') ? 'right' : 'center',
            caption: captionEl?.textContent || '',
          };
        }
      },
      {
        tag: 'img[src]',
        getAttrs: (element: HTMLElement) => ({
          src: element.getAttribute('src'),
          alt: element.getAttribute('alt'),
          idbKey: element.getAttribute('data-idbkey'),
        })
      }
    ];
  },

  renderHTML({ HTMLAttributes }: { HTMLAttributes: Record<string, any> }) {
    const { src, alt, width, align, caption } = HTMLAttributes
    const tailwindAlignClass =
      align === 'left'
        ? 'mr-auto'
        : align === 'right'
        ? 'ml-auto'
        : 'mx-auto'
    
    const figureChildren = [
      [
        'img',
        {
          'data-idbkey': HTMLAttributes['data-idbkey'],
          src,
          alt,
          class: 'w-full h-full object-cover',
        },
      ],
    ]
    
    if (caption) {
      figureChildren.push([
        'p',
        {
          class: 'caption w-full text-center text-[1rem] text-gray-300 mt-2',
        },
        caption,
      ])
    }
    
    return [
      'div',
      {
        style: `width: ${width};`,
        width,
        class: `file relative max-w-full ${tailwindAlignClass}`,
      },
      ...figureChildren,
    ]
  },

  addNodeView() {
    return ReactNodeViewRenderer(ImageComponent)
  },
})
