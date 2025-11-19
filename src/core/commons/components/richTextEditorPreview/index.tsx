'use client';

import '../richTextEditor/index.scss';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import React, { useEffect } from 'react';
import TextAlign from '@tiptap/extension-text-align';
import Highlight from '@tiptap/extension-highlight';

interface RichTextEditorProps {
  content: string | undefined;
}

export default function RichTextEditorPreview({
  content,
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: {
          HTMLAttributes: {
            class: 'list-disc ml-3',
          },
        },
        orderedList: {
          HTMLAttributes: {
            class: 'list-decimal ml-3',
          },
        },
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Highlight,
    ],
    editable: false,
    immediatelyRender: false,
    content: content, // Initial HTML content
    editorProps: {
      attributes: {
        class:
          'min-h-[156px] dark:bg-transparent bg-white outline-none rounded-md py-2',
      },
    },
  });

  // Update editor content when the `content` prop changes
  useEffect(() => {
    if (editor && typeof content === 'string' && content !== editor.getHTML()) {
      editor.commands.setContent(content); // false prevents emitting an update event
    }
  }, [editor, content]);

  return (
    <div>
      <EditorContent editor={editor} disabled readOnly />
    </div>
  );
}
