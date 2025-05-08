import React, { useEffect, useState } from "react";
import { Button } from "antd";
import { useQuill } from "react-quilljs";
import "quill/dist/quill.snow.css";
import { useCustomImageBlot } from "../../../hooks/useCustomImageBolt";

interface RichTextEditorProps {
  initialValue?: string;
  onSave: (value: string) => void;
  onCancel: () => void;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  initialValue = "",
  onSave,
  onCancel,
}) => {
  const [error, setError] = useState<string | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);

  const { quill, quillRef } = useQuill({
    modules: {
      toolbar: "#custom-toolbar",
    },
    formats: [
      "header",
      "bold",
      "italic",
      "underline",
      "strike",
      "list",
      "bullet",
      "link",
      "image",
      "video",
      "script",
      "size",
      "customImage",
    ],
    placeholder: "Write your content...",
  });

  useCustomImageBlot();

  useEffect(() => {
    if (quill && initialValue) {
      quill.clipboard.dangerouslyPasteHTML(initialValue);
    }
  }, [quill, initialValue]);

  const handleImageButton = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = async () => {
      const file = input.files?.[0];
      if (file && validateFileType(file)) {
        const base64 = await readFileAsDataURL(file);
        const range = quill?.getSelection();
        if (range) {
          quill?.insertEmbed(range.index, "customImage", {
            src: base64,
            className: "my-preview-image",
          });
        }
      } else {
        setError("Only images are allowed.");
      }
    };
    input.click();
  };

  const handleAttachmentButton = () => {
    setShowUploadModal(true);
  };

  const validateFileType = (file: File) =>
    [
      "image/jpeg",
      "image/png",
      "image/gif",
      "application/pdf",
      "video/mp4",
      "video/webm",
    ].includes(file.type);

  const cleanHtml = (html: string) => {
    const div = document.createElement("div");
    div.innerHTML = html;

    // Convert childNodes to array of Element nodes only
    const nodes = Array.from(div.childNodes).filter(
      (node): node is Element => node.nodeType === Node.ELEMENT_NODE
    );

    // Remove leading empty <p><br></p>
    while (
      nodes.length &&
      nodes[0].tagName === "P" &&
      nodes[0].innerHTML === "<br>"
    ) {
      div.removeChild(nodes[0]);
      nodes.shift();
    }

    // Remove trailing empty <p><br></p>
    while (
      nodes.length &&
      nodes[nodes.length - 1].tagName === "P" &&
      nodes[nodes.length - 1].innerHTML === "<br>"
    ) {
      div.removeChild(nodes[nodes.length - 1]);
      nodes.pop();
    }

    return div.innerHTML.trim();
  };

  const readFileAsDataURL = (file: File): Promise<string> =>
    new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.readAsDataURL(file);
    });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    const validFiles = selectedFiles.filter(validateFileType);
    const previewPromises = validFiles.map(readFileAsDataURL);

    Promise.all(previewPromises).then((results) => {
      setError(null);
      setFiles((prev) => [...prev, ...validFiles]);
      setPreviews((prev) => [...prev, ...results]);
    });
  };

  const insertFilesToEditor = () => {
    const range = quill?.getSelection();
    if (!range) return;

    previews.forEach((url, i) => {
      const type = files[i].type;
      if (type.startsWith("image/")) {
        quill?.insertEmbed(range.index, "image", url);
      } else if (type.startsWith("video/")) {
        quill?.insertEmbed(range.index, "video", url);
      } else if (type === "application/pdf") {
        quill?.insertEmbed(range.index, "link", url);
      }
    });

    setShowUploadModal(false);
    setFiles([]);
    setPreviews([]);
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div>
      <div id="custom-toolbar">
        <select className="ql-size" defaultValue="">
          <option value="small" />
          <option value="" />
          <option value="large" />
          <option value="huge" />
        </select>
        <button className="ql-bold" />
        <button className="ql-italic" />
        <button className="ql-underline" />
        <button className="ql-strike" />
        <button className="ql-list" value="ordered" />
        <button className="ql-list" value="bullet" />
        <button className="ql-script" value="sub" />
        <button className="ql-script" value="super" />
        <button className="ql-link" />
        <button onClick={handleImageButton}>🖼️</button>
        {/* <button onClick={handleAttachmentButton}>📎</button> */}
        <button className="ql-clean" />
      </div>

      <div
        ref={quillRef}
        style={{ height: 300, marginBottom: 20 }}
        className="editor-css"
      />

      {error && <div className="editor-error">{error}</div>}

      <div className="editor-btn-container">
        <Button
          type="primary"
          onClick={() => onSave(cleanHtml(quill?.root.innerHTML ?? ""))}
        >
          Save
        </Button>
        <Button onClick={onCancel}>Cancel</Button>
      </div>

      {showUploadModal && (
        <div className="upload-modal">
          <h3>Upload Attachments</h3>
          <input
            type="file"
            multiple
            accept="image/*,application/pdf,video/*"
            onChange={handleFileChange}
          />
          <div className="preview-container">
            {previews.map((url, i) => {
              const file = files[i];
              const isImage = file.type.startsWith("image/");
              const isVideo = file.type.startsWith("video/");
              return (
                <div key={i} style={{ marginTop: 8 }}>
                  {isImage && <img src={url} alt="preview" width={100} />}
                  {isVideo && (
                    <video
                      controls
                      className="attachment-width"
                      src={url}
                      width={100}
                    >
                      <track
                        kind="captions"
                        srcLang="en"
                        label="English captions"
                        src="path-to-captions.vtt"
                        default
                      />
                      Your browser does not support the video tag.
                    </video>
                  )}
                  {!isImage && !isVideo && (
                    <a href={url} target="_blank" rel="noopener noreferrer">
                      {file.name}
                    </a>
                  )}
                  <button onClick={() => removeFile(i)}>❌</button>
                </div>
              );
            })}
          </div>
          <div>
            <button onClick={insertFilesToEditor}>Insert</button>
            <button
              onClick={() => {
                setShowUploadModal(false);
                setFiles([]);
                setPreviews([]);
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RichTextEditor;
