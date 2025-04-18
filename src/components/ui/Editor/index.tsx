import { Button } from "antd";
import React, { useRef, useState } from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

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
  const [value, setValue] = useState<string>(initialValue);
  const [error, setError] = useState<string | null>(null);
  const [showUploadModal, setShowUploadModal] = useState<boolean>(false);
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const quillRef = useRef<ReactQuill | null>(null);

  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/gif",
    "application/pdf",
    "video/mp4",
    "video/webm",
  ];

  const validateFileType = (file: File): boolean =>
    allowedTypes.includes(file.type);

  const handleInlineFileInsert = (file: File) => {
    if (!validateFileType(file)) {
      setError("Only images, PDFs, and videos are allowed.");
      return;
    }

    setError(null);
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result;
      const editor = quillRef.current?.getEditor();
      const range = editor?.getSelection();

      if (range && base64 && editor) {
        if (file.type.startsWith("image/")) {
          editor.insertEmbed(range.index, "image", base64);
        } else if (file.type === "application/pdf") {
          editor.insertEmbed(range.index, "link", base64);
        } else if (file.type.startsWith("video/")) {
          editor.insertEmbed(range.index, "video", base64);
        }
      }
    };
    reader.readAsDataURL(file);
  };

  const handleImageButton = () => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();

    input.onchange = () => {
      const file = input.files?.[0];
      if (file) {
        handleInlineFileInsert(file);
      }
    };
  };

  const handleAttachmentButton = () => {
    setShowUploadModal(true);
  };

  const readFileAsDataURL = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.readAsDataURL(file);
    });
  };

  const getValidFilesWithPreviews = (
    files: File[]
  ): { validFiles: File[]; previewPromises: Promise<string>[] } => {
    const validFiles: File[] = [];
    const previewPromises: Promise<string>[] = [];

    for (const file of files) {
      if (validateFileType(file)) {
        validFiles.push(file);
        previewPromises.push(readFileAsDataURL(file));
      } else {
        setError("Only images, PDFs, and videos are allowed.");
      }
    }

    return { validFiles, previewPromises };
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files ? Array.from(e.target.files) : [];

    const { validFiles, previewPromises } =
      getValidFilesWithPreviews(selectedFiles);

    Promise.all(previewPromises).then((previews) => {
      setError(null);
      setFiles((prev) => [...prev, ...validFiles]);
      setPreviews((prev) => [...prev, ...previews]);
    });
  };

  const insertFilesToEditor = () => {
    const editor = quillRef.current?.getEditor();
    const range = editor?.getSelection();

    if (editor && range) {
      previews.forEach((url, idx) => {
        const type = files[idx]?.type;
        if (type?.startsWith("image/")) {
          editor.insertEmbed(range.index, "image", url);
        } else if (type === "application/pdf") {
          editor.insertEmbed(range.index, "link", url);
        } else if (type?.startsWith("video/")) {
          editor.insertEmbed(range.index, "video", url);
        }
      });

      // Cleanup
      setShowUploadModal(false);
      setFiles([]);
      setPreviews([]);
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const modules = {
    toolbar: {
      container: "#custom-toolbar",
      handlers: {
        image: handleImageButton,
        attachment: handleAttachmentButton,
      },
    },
  };

  const formats = [
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
  ];

  return (
    <div>
      <div id="custom-toolbar">
        <select className="ql-header" defaultValue="">
          <option value="1" />
          <option value="2" />
          <option value="" />
        </select>
        <button className="ql-bold" />
        <button className="ql-italic" />
        <button className="ql-underline" />
        <button className="ql-strike" />
        <button className="ql-list" value="ordered" />
        <button className="ql-list" value="bullet" />
        <button className="ql-link" />
        {/* <button className="ql-image" /> */}
        <button className="ql-clean" />
        {/* <button className="ql-attachment">
          <img
            src="/icons/attachment.png"
            alt="Attach"
            style={{ width: 16, height: 16, pointerEvents: "none" }}
          />
        </button> */}
      </div>

      <ReactQuill
        ref={quillRef}
        value={value}
        onChange={setValue}
        modules={modules}
        formats={formats}
        placeholder="Write your content..."
        style={{ height: "200px", marginBottom: "20px" }}
      />

      {error && (
        <div style={{ color: "red", marginBottom: "10px" }}>{error}</div>
      )}

      <div style={{ display: "flex", gap: "10px" }}>
        <Button
          variant="solid"
          color="primary"
          className="ant-btn-primary"
          onClick={() => onSave(value)}
        >
          Save
        </Button>
        <Button variant="text" color="primary" onClick={onCancel}>
          Cancel
        </Button>
      </div>

      {showUploadModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
          }}
        >
          <div
            style={{
              background: "#fff",
              padding: "30px",
              borderRadius: "8px",
              width: "500px",
              maxHeight: "90vh",
              overflowY: "auto",
              textAlign: "center",
            }}
          >
            <h3>Upload Attachments</h3>
            <input
              type="file"
              multiple
              accept="image/*,application/pdf,video/*"
              onChange={handleFileChange}
            />
            <div style={{ marginTop: "20px" }}>
              {previews.map((url, idx) => {
                const file = files[idx];
                const isImage = file.type.startsWith("image/");
                const isVideo = file.type.startsWith("video/");

                let mediaElement: React.ReactNode;

                if (isImage) {
                  mediaElement = <img src={url} alt="preview" width="100" />;
                } else if (isVideo) {
                  mediaElement = (
                    <video width="100" controls src={url}>
                      <track
                        kind="captions"
                        srcLang="en"
                        label="English captions"
                      />
                      Your browser does not support the video tag.
                    </video>
                  );
                } else {
                  mediaElement = (
                    <a href={url} target="_blank" rel="noopener noreferrer">
                      {file.name}
                    </a>
                  );
                }

                return (
                  <div
                    key={`${file.name}-${url}`}
                    style={{ marginBottom: "10px" }}
                  >
                    {mediaElement}
                    <button
                      onClick={() => removeFile(idx)}
                      style={{ marginLeft: 10 }}
                    >
                      ❌
                    </button>
                  </div>
                );
              })}
            </div>
            <div
              style={{
                marginTop: "20px",
                display: "flex",
                gap: "10px",
                justifyContent: "center",
              }}
            >
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
        </div>
      )}
    </div>
  );
};

export default RichTextEditor;
