import { Dropdown, Button, MenuProps } from "antd";
import {
  EllipsisOutlined,
  DownloadOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { IAttachment } from "../../../../store/slices/taskAttachmentSlice";

interface AttachmentActionsProps {
  attachment: IAttachment;
  onMenuClick: (key: string, attachment: IAttachment) => void;
}

const AttachmentActions = ({
  attachment,
  onMenuClick,
}: AttachmentActionsProps) => {
  const items: MenuProps["items"] = [
    {
      key: "download",
      label: "Download",
      icon: <DownloadOutlined />,
    },
    {
      key: "delete",
      label: "Delete",
      icon: <DeleteOutlined />,
      danger: true,
    },
  ];

  return (
    <Dropdown
      menu={{
        items,
        onClick: ({ key }) => onMenuClick(key, attachment),
      }}
      trigger={["click"]}
      placement="bottomRight"
    >
      <Button type="text" icon={<EllipsisOutlined />} />
    </Dropdown>
  );
};

export default AttachmentActions;
