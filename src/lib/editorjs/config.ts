import type { EditorConfig } from "@editorjs/editorjs";
import { uploadImageAction } from "@/app/actions";

export async function getEditorTools(): Promise<EditorConfig["tools"]> {
  const [
    { default: Header },
    { default: List },
    { default: ImageTool },
    { default: CodeTool },
    { default: Embed },
    { default: Table },
    { default: Delimiter },
    { default: Quote },
    { default: InlineCode },
  ] = await Promise.all([
    import("@editorjs/header"),
    import("@editorjs/list"),
    import("@editorjs/image"),
    import("@editorjs/code"),
    import("@editorjs/embed"),
    import("@editorjs/table"),
    import("@editorjs/delimiter"),
    import("@editorjs/quote"),
    import("@editorjs/inline-code"),
  ]);

  return {
    header: {
      class: Header,
      config: { levels: [1, 2, 3, 4], defaultLevel: 2 },
    },
    list: { class: List, inlineToolbar: true },
    image: {
      class: ImageTool,
      config: {
        uploader: {
          async uploadByFile(file: File) {
            const formData = new FormData();
            formData.append("file", file);
            const { url } = await uploadImageAction(formData);
            return { success: 1, file: { url } };
          },
        },
      },
    },
    code: CodeTool,
    embed: { class: Embed, inlineToolbar: true },
    table: { class: Table, inlineToolbar: true },
    delimiter: Delimiter,
    quote: { class: Quote, inlineToolbar: true },
    inlineCode: { class: InlineCode },
  };
}
