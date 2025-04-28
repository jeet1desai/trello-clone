import { Mentions } from "antd";
import { useMemo } from "react";
import { memberId } from "../../../store/slices/boardSlice";

const { Option } = Mentions;

export interface MentionTextCommentProps {
  value: string;
  onChange: (value: string, mentions: string[]) => void;
  members: memberId[];
  className: string;
  placeholder: string;
}

const MentionTextComment: React.FC<MentionTextCommentProps> = ({
  value,
  onChange,
  members,
  className,
  placeholder,
}) => {
  const lineHeight = 42;
  const maxLines = 5;

  const mentionedMembers = useMemo(() => {
    return Array.from(value.matchAll(/@([a-zA-Z]+\s+[a-zA-Z]+)/g)).map((m) =>
      m[1].trim()
    );
  }, [value]);

  const textAreaHeight =
    Math.min(value.split("\n").length, maxLines) * lineHeight;

  const handleChange = (val: string) => {
    const mentions = Array.from(val.matchAll(/@(\w+)/g)).map((m) => m[1]);
    onChange(val, mentions);
  };

  const filteredMembers = useMemo(() => {
    return members
      .filter((member) => {
        const fullName = `${member.first_name} ${member.last_name}`;
        return !mentionedMembers.includes(fullName);
      })
      .sort((a, b) => {
        const fullNameA = `${a.first_name} ${a.last_name}`;
        const fullNameB = `${b.first_name} ${b.last_name}`;
        return fullNameA.localeCompare(fullNameB);
      });
  }, [mentionedMembers, members]);

  return (
    <Mentions
      className={className}
      style={{
        flex: 1,
        borderRadius: "4px",
        height: textAreaHeight,
        overflowY: "auto",
      }}
      value={value}
      onChange={handleChange}
      placeholder={placeholder}
      prefix={["@", "#"]}
    >
      {filteredMembers.map((member) => (
        <Option
          key={member._id}
          value={`${member.first_name} ${member.last_name}`}
        >
          {member.first_name} {member.last_name}
        </Option>
      ))}
    </Mentions>
  );
};

export default MentionTextComment;
