import React, { useState } from "react";
import { Avatar, Typography, Space, Image, Button, Upload } from "antd";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import {
  ITaskCommentBy,
  IAttachment,
} from "../../../../store/slices/taskCommentSlice";
import CommentTextRenderer from "./commentRender";
import MentionTextComment from "../../../../components/ui/mention";
import { useSelector } from "react-redux";
import { RootState } from "../../../../store";
import { getRandomColor } from "../../../../utils";
import { CircleX, Image as ImageIcon } from "lucide-react";

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
      mentionedMembers: string[];
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
  commentId,
}) => {
  const { _id, profile_image, first_name, last_name } = commentedBy;
  const { invitedMemberList } = useSelector((state: RootState) => state.board);
  const { currentUser } = useSelector((state: RootState) => state.user);
  const [isEditing, setIsEditing] = React.useState(false);
  const [msg, setMsg] = React.useState<string>(comment);
  const [fileList, setFileList] = React.useState<File[]>([]);
  const [removedAttachments, setRemovedAttachments] = React.useState<string[]>(
    []
  );
  const [mentionedMembers, setMentionedMembers] = useState<string[]>([]);

  const handleMentionChange = (value: string) => {
    setMsg(value);
  };

  const [existingAttachments, setExistingAttachments] =
    React.useState<IAttachment[]>(attachments);

  return (
    <>
      <div className="comment-list-container">
        <Avatar
          src={profile_image?.url}
          style={{ background: getRandomColor(_id) }}
        >
          {first_name?.[0]?.toUpperCase()}
          {last_name?.[0]?.toUpperCase()}
        </Avatar>
        <div className="comment-container">
          <div className="commenter-container">
            <Text strong>
              {first_name} {last_name ?? ""}
            </Text>
            <Text type="secondary" className="commenter-time">
              {dayjs(createdAt).fromNow()}
            </Text>
          </div>
          <div className="comment-wrapper">
            <Space className="comment-detail-container">
              <div>
                <CommentTextRenderer
                  comment={comment}
                  members={invitedMemberList.map((item) => item.memberId)}
                />
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
          {currentUser?.id === commentedBy._id && (
            <div className="show-edit-btn-container">
              <span
                className="edit-comment-btn"
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
          )}
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
                      <CircleX
                        size={14}
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
                      <CircleX
                        size={14}
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
                <MentionTextComment
                  value={msg}
                  placeholder="Edit your comment..."
                  className="edit-text-box"
                  members={invitedMemberList.map((item) => item.memberId)}
                  setMentions={setMentionedMembers}
                  onChange={handleMentionChange}
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
                  <ImageIcon size={16} className="edit-file-upload-icon" />
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
                    mentionedMembers,
                  });
                  setIsEditing(false);
                  setMentionedMembers([]);
                }}
                disabled={
                  (!msg.trim() ||
                    msg.trim() === "@" ||
                    msg.trim() === comment) &&
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
