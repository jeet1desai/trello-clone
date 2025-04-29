import { Typography } from "antd";
import { IMemberId } from "../../../../store/slices/boardSlice";

const { Text } = Typography;

interface Props {
  comment: string;
  members: IMemberId[];
}

const CommentTextRenderer: React.FC<Props> = ({ comment, members }) => {
  const parts = comment.split(/(@\w+ \w+|\r\n|\n)/g).filter(Boolean);

  const renderPart = (part: string, index: number) => {
    if (part === "\r\n" || part === "\n") {
      return <br key={index} />;
    }

    // Check if the part starts with '@' to identify mentions
    if (part.startsWith("@")) {
      const member = members.find(
        (m) =>
          `@${m.first_name} ${m.last_name}`.toLowerCase() === part.toLowerCase()
      );

      if (member) {
        return (
          <Text
            key={index}
            style={{
              color: "#1890ff",
              fontWeight: 600,
              textTransform: "capitalize",
            }}
          >
            {member.first_name.charAt(0).toUpperCase() +
              member.first_name.slice(1)}{" "}
            {member.last_name.charAt(0).toUpperCase() +
              member.last_name.slice(1)}
          </Text>
        );
      } else {
        return <Text key={index}>{part}</Text>;
      }
    }

    // If it's just regular text, render it normally
    return <Text key={index}>{part}</Text>;
  };

  return <>{parts.map((part, index) => renderPart(part, index))}</>;
};

export default CommentTextRenderer;
