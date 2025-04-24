import { useEffect } from "react";
import Quill from "quill";

// Fix typing for BlockEmbed
const BlockEmbed = Quill.import("blots/block/embed");

// Grab Scope
const Parchment = Quill.import("parchment");
const Scope = Parchment.Scope;

class CustomImage extends (BlockEmbed as any) {
  static readonly blotName = "customImage";
  static readonly tagName = "img";
  static readonly className = "my-preview-image";
  static readonly scope = Scope.BLOCK;

  static create(value: { src: string; className?: string }) {
    const node = super.create() as HTMLImageElement;
    node.setAttribute("src", value.src);
    if (value.className) {
      node.setAttribute("class", value.className);
    }
    return node;
  }

  static value(node: HTMLImageElement) {
    return {
      src: node.getAttribute("src") ?? "",
      className: node.getAttribute("class") ?? "",
    };
  }
}

export const useCustomImageBlot = () => {
  useEffect(() => {
    const isRegistered = (Quill as any).imports["formats/customImage"];
    if (!isRegistered) {
      Quill.register({ "formats/customImage": CustomImage });
    }
  }, []);
};
