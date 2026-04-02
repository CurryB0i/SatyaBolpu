import { Extension } from '@tiptap/core';

const sizeMap = {
  small: '1rem',
  normal: '1.5rem',
  large: '2rem',
  huge: '2.5rem',
};

const reverseMap = Object.fromEntries(
  Object.entries(sizeMap).map(([k, v]) => [v, k])
);

export const FontSize = Extension.create({
  name: 'fontSize',

  addOptions() {
    return {
      types: ['textStyle'],
      fontSizes: ['small','normal','large','huge'],
    };
  },

  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          fontSize: {
            default: null,
            parseHTML: (element) => reverseMap[element.style.fontSize] || null,
            renderHTML: (attributes) => {
              if (!attributes.fontSize) return {};
              const size = sizeMap[attributes.fontSize as 'small' | 'large'];
              return { style: `font-size: ${size}; line-height: ${size};` };
            },
          },
        },
      },
    ];
  },

  addCommands() {
    return {
      setFontSize: (fontSize) => ({ commands }) => {
        return commands.setMark('textStyle', { fontSize })
      },
      unsetFontSize: () => ({ commands }) => {
        return commands.setMark('textStyle', { fontSize: null });
      },
    };
  },
});
