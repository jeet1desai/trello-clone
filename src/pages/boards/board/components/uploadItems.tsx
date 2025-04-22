import React, { useState } from "react";
import { Tooltip, Button } from "antd";
import type { UploadFile } from "antd/es/upload/interface";
import {
  EyeOutlined,
  DeleteOutlined,
  DownloadOutlined,
} from "@ant-design/icons";

interface CustomUploadItemProps {
  file: UploadFile;
  originNode: React.ReactElement;
  remove: () => void;
  getFileIcon: (file: UploadFile) => React.ReactNode;
  handlePreview: () => void;
}

const CustomUploadItem: React.FC<CustomUploadItemProps> = ({
  file,
  originNode,
  remove,
  getFileIcon,
  handlePreview,
}) => {
  const [hovered, setHovered] = useState<boolean>(false);
  const isDownloadable = [
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "application/vnd.ms-excel",
  ].includes(file.type ?? "");

  const handleDownload = () => {
    let downloadUrl = file.url ?? file.preview;

    if (!downloadUrl && file.originFileObj instanceof File) {
      downloadUrl = URL.createObjectURL(file.originFileObj);
    }

    if (!downloadUrl) {
      console.warn("No URL available to download this file.");
      return;
    }

    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = file.name;
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    if (file.originFileObj instanceof File && !file.url && !file.preview) {
      setTimeout(() => URL.revokeObjectURL(downloadUrl!), 100);
    }
  };

  const handleKeyPress =
    (callback: () => void) => (e: React.KeyboardEvent<HTMLButtonElement>) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        callback();
      }
    };

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="upload-img-container"
    >
      {originNode}

      {hovered && (
        <div className="hover-btn-container">
          {!isDownloadable && (
            <Tooltip title="Preview">
              <Button
                tabIndex={0}
                onClick={(e) => {
                  e.stopPropagation();
                  handlePreview();
                }}
                onKeyDown={handleKeyPress(() => handlePreview())}
                className="hover-btn"
              >
                <EyeOutlined />
              </Button>
            </Tooltip>
          )}

          {isDownloadable && (
            <Tooltip title="Download">
              <Button
                tabIndex={0}
                onClick={(e) => {
                  e.stopPropagation();
                  handleDownload();
                }}
                onKeyDown={handleKeyPress(handleDownload)}
                className="hover-btn"
              >
                <DownloadOutlined />
              </Button>
            </Tooltip>
          )}

          <Tooltip title="Remove">
            <Button
              tabIndex={0}
              onClick={(e) => {
                e.stopPropagation();
                remove();
              }}
              onKeyDown={handleKeyPress(() => remove())}
              className="hover-btn"
            >
              <DeleteOutlined />
            </Button>
          </Tooltip>
        </div>
      )}
    </div>
  );
};

export default CustomUploadItem;
