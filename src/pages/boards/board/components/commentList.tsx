import React from "react";
import { Avatar, Typography, Space, Image, Button, Input, Upload } from "antd";
import { CloseCircleFilled, PictureOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import {
  ITaskCommentBy,
  IAttachment,
} from "../../../../store/slices/taskCommentSlice";
import { getRandomColor } from "../../../../utils";

dayjs.extend(relativeTime);

const { Text } = Typography;

interface CommentCardProps {
  comment: string;
  attachments: IAttachment[];
  createdAt: string;
  commentedBy: ITaskCommentBy;
  onDelete: (commentId: string) => void;
  key: string;
  onUpdate: (
    commentId: string,
    updateTask: {
      comment: string;
      newAttachments: File[];
      removedAttachments: string[];
    }
  ) => void;
  commentId: string;
}

const CommentCard: React.FC<CommentCardProps> = ({
  comment,
  attachments,
  createdAt,
  commentedBy,
  onDelete,
  onUpdate,
  key,
  commentId,
}) => {
  const { _id, profile_image, first_name, last_name } = commentedBy;
  const [isEditing, setIsEditing] = React.useState(false);
  const [msg, setMsg] = React.useState(comment);
  const [fileList, setFileList] = React.useState<File[]>([]);
  const [removedAttachments, setRemovedAttachments] = React.useState<string[]>(
    []
  );
  const [existingAttachments, setExistingAttachments] =
    React.useState<IAttachment[]>(attachments);

  return (
    <>
      <div className="comment-list-container">
        <Avatar
          src={profile_image?.url}
          style={{ background: getRandomColor(_id) }}
        >
          {first_name[0].toUpperCase()}
          {last_name[0].toUpperCase()}
        </Avatar>
        <div className="comment-container">
          <div className="commenter-container">
            <Text strong>
              {first_name} {last_name}
            </Text>
            <Text type="secondary" className="commenter-time">
              {dayjs(createdAt).fromNow()}
            </Text>
          </div>
          <div className="comment-wrapper">
            <Space className="comment-detail-container">
              <div>
                <Text>{comment}</Text>
              </div>
              {attachments.length > 0 && (
                <div className="comment-attachment-container">
                  {attachments.map((file, index) => (
                    <Image
                      key={index}
                      src={file.url}
                      alt={file.imageName}
                      className="comment-attachment-img"
                    />
                  ))}
                </div>
              )}
            </Space>
          </div>
          <div className="show-edit-btn-container">
            <span
              style={{
                fontSize: "12px",
                padding: "0 8px 0 15px",
                cursor: "pointer",
              }}
              onClick={() => setIsEditing(true)}
            >
              Edit
            </span>

            {onDelete && (
              <span
                className="delete-comment-btn"
                onClick={() => onDelete(commentId)}
              >
                Delete
              </span>
            )}
          </div>
        </div>
      </div>
      <>
        {isEditing && (
          <div className="edit-container">
            <div className="edit-preview-container">
              {existingAttachments.length > 0 && (
                <>
                  {existingAttachments.map((file, idx) => (
                    <div key={idx} className="exist-image-container">
                      <Image src={file.url} className="edit-preview-img" />
                      <CloseCircleFilled
                        onClick={() => {
                          setRemovedAttachments([
                            ...removedAttachments,
                            file.imageId,
                          ]);
                          setExistingAttachments(
                            existingAttachments.filter((f) => f !== file)
                          );
                        }}
                        className="edit-img-remove-icon"
                      />
                    </div>
                  ))}
                </>
              )}

              {/* New Image Previews */}
              {fileList.length > 0 && (
                <>
                  {fileList.map((file, index) => (
                    <div key={index} className="exist-image-container">
                      <Image
                        className="edit-preview-img"
                        src={URL.createObjectURL(file)}
                      />
                      <CloseCircleFilled
                        onClick={() =>
                          setFileList(fileList.filter((_, i) => i !== index))
                        }
                        className="edit-img-remove-icon"
                      />
                    </div>
                  ))}
                </>
              )}
            </div>

            {/* Input Row */}
            <div className="edit-comment-container">
              <div className="edit-comment-box">
                <Input.TextArea
                  value={msg}
                  onChange={(e) => setMsg(e.target.value)}
                  placeholder="Edit your comment..."
                  autoSize={{ minRows: 1, maxRows: 4 }}
                  className="edit-text-box"
                />
                <Upload
                  beforeUpload={(file) => {
                    setFileList([...fileList, file]);
                    return false;
                  }}
                  multiple
                  accept="image/*"
                  showUploadList={false}
                >
                  <PictureOutlined className="edit-file-upload-icon" />
                </Upload>
              </div>
            </div>

            {/* Save / Cancel Buttons */}
            <div className="edit-btn-container">
              <Button
                type="primary"
                className="button small-btn"
                onClick={() => {
                  onUpdate(commentId, {
                    comment: msg,
                    newAttachments: fileList,
                    removedAttachments,
                  });
                  setIsEditing(false);
                }}
                disabled={
                  (!msg.trim() || msg.trim() === comment) &&
                  removedAttachments.length === 0 &&
                  fileList.length === 0
                }
              >
                Save
              </Button>
              <Button
                size="small"
                className="button small-btn"
                onClick={() => {
                  setIsEditing(false);
                  setMsg(comment);
                  setFileList([]);
                  setRemovedAttachments([]);
                  setExistingAttachments(attachments);
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </>
    </>
  );
};

export default CommentCard;
