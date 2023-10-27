// Modified image component for Tiptap to allow for custom image sizing

import {nodeInputRule} from "@tiptap/core";
import Image from '@tiptap/extension-image'

export interface ImageOptions {
  inline: boolean,
  allowBase64: boolean,
  HTMLAttributes: Record<string, any>,
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    imageResize: {
      setImage: (options: { src: string, alt?: string, title?: string, width?: string|number, height?: string|number}) => ReturnType,
    }
  }
}
export const inputRegex = /(!\[(.+|:?)]\((\S+)(?:(?:\s+)["'](\S+)["'])?\))$/

export const ImageResize = Image.extend<ImageOptions>({

  addAttributes() {
    return {
      src: {
        default: null,
      },
      alt: {
        default: null,
      },
      title: {
        default: null,
      },
      width: {
        default: '100%',
      },
      height: {
        default: 'auto',
      }
    }
  },

  addInputRules() {
    return [
      nodeInputRule({
        find: inputRegex,
        type: this.type,
        getAttributes: match => {
          const [,, alt, src, title, width, height] = match

          return { src, alt, title, width, height }
        },
      }),
    ]
  },
})