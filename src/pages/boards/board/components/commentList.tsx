import React from "react";
import { Card, Avatar, Typography, Space, Image, Button } from "antd";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import {
  ITaskCommentBy,
  IAttachment,
} from "../../../../store/slices/taskCommentSlice";

dayjs.extend(relativeTime);

const { Text } = Typography;

interface CommentCardProps {
  comment: string;
  attachments: IAttachment[];
  createdAt: string;
  commentedBy: ITaskCommentBy;
  onDelete: (commentId: string) => void;
  key: string;
}

const CommentCard: React.FC<CommentCardProps> = ({
  comment,
  attachments,
  createdAt,
  commentedBy,
  onDelete,
  key,
}) => {
  const { profile_image, first_name, last_name } = commentedBy;
  return (
    <div
      style={{
        display: "flex",
        gap: 8,
        alignItems: "flex-start",
        marginLeft: "-22px",
        marginTop: "10px",
      }}
    >
      <Avatar src={profile_image.url}></Avatar>
      <div style={{ display: "flex", gap: "8px", flexDirection: "column" }}>
        <div
          style={{
            flex: 1,
            display: "flex",
            gap: "10px",
            alignItems: "center",
          }}
        >
          <Text strong style={{ marginRight: "10px" }}>
            {first_name} {last_name}
          </Text>
          <Text type="secondary" style={{ fontSize: 12 }}>
            {dayjs(createdAt).fromNow()}
          </Text>
        </div>
        <Card style={{ marginBottom: 16 }}>
          <Space
            align="start"
            style={{ width: "100%", flexDirection: "column" }}
          >
            <div>
              <Text>{comment}</Text>
            </div>
            {attachments.length > 0 && (
              <div
                style={{
                  display: "flex",
                  gap: 12,
                  flexWrap: "wrap",
                }}
              >
                {attachments.map((file, index) => (
                  <Image
                    key={index}
                    src={file.url}
                    alt={file.imageName}
                    width={100}
                    height={100}
                    style={{ objectFit: "cover", borderRadius: 4 }}
                  />
                ))}
              </div>
            )}
          </Space>
        </Card>
        {onDelete && (
          <Button
            type="text"
            danger
            style={{ alignSelf: "flex-start", padding: 0 }}
            onClick={() => onDelete(key)}
          >
            Delete
          </Button>
        )}
      </div>
    </div>
  );
};

export default CommentCard;
