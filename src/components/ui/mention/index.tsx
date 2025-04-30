import { Mentions } from "antd";
import { useMemo } from "react";
import { IMemberId } from "../../../store/slices/boardSlice";

export interface MentionTextCommentProps {
  value: string;
  members: IMemberId[];
  className: string;
  placeholder: string;
  setMentions: (members: string[]) => void;
  onChange: (value: string) => void;
}

const MentionTextComment: React.FC<MentionTextCommentProps> = ({
  value,
  members,
  className,
  placeholder,
  setMentions,
  onChange,
}) => {
  const lineHeight = 35;
  const maxLines = 5;

  const mentionedMembers = useMemo(() => {
    return Array.from(value.matchAll(/@([a-zA-Z]+\s+[a-zA-Z]+)/g)).map((m) =>
      m[1].trim()
    );
  }, [value]);

  const textAreaHeight =
    Math.min(value.split("\n").length, maxLines) * lineHeight;

  const handleChange = (val: string) => {
    onChange(val);
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
      onSelect={(option) =>
        // @ts-ignore
        setMentions((prev: any) => {
          return [...prev, option.key] as string[];
        })
      }
      placeholder={placeholder}
      prefix={["@", "#"]}
      options={filteredMembers.map((member) => {
        return {
          label: member.first_name + " " + member.last_name,
          value: member.first_name + " " + member.last_name,
          key: member._id,
        };
      })}
    />
  );
};

export default MentionTextComment;
