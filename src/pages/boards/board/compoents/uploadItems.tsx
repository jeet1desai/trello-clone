import React, { useState } from "react";
import { UploadFile, Tooltip, Button } from "antd";
import {
  EyeOutlined,
  DeleteOutlined,
  DownloadOutlined,
} from "@ant-design/icons";

interface CustomUploadItemProps {
  file: UploadFile;
  originNode: React.ReactElement;
  actions: {
    remove: (file: UploadFile) => void;
  };
  handlePreview: (file: UploadFile) => void;
}

const CustomUploadItem: React.FC<CustomUploadItemProps> = ({
  file,
  originNode,
  actions,
  handlePreview,
}) => {
  const [hovered, setHovered] = useState<boolean>(false);
  const isDownloadable =
    file.type === "application/pdf" ||
    file.type ===
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
    file.type === "application/vnd.ms-excel";

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = file.url ?? file.preview ?? "";
    link.download = file.name;
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
                onClick={() => handlePreview(file)}
                onKeyDown={handleKeyPress(() => handlePreview(file))}
                className="hover-btn"
              >
                <EyeOutlined />
              </Button>
            </Tooltip>
          )}
          <Tooltip title="Remove">
            <Button
              tabIndex={0}
              onClick={() => actions.remove(file)}
              onKeyDown={handleKeyPress(() => actions.remove(file))}
              className="hover-btn"
            >
              <DeleteOutlined />
            </Button>
          </Tooltip>
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
        </div>
      )}
    </div>
  );
};

export default CustomUploadItem;
