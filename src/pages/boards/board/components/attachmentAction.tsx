import { Dropdown, Button, MenuProps } from 'antd';
import { IAttachment } from '../../../../store/slices/taskAttachmentSlice';
import { ArrowDownToLine, EllipsisVertical, Trash2 } from 'lucide-react';

interface AttachmentActionsProps {
  attachment: IAttachment;
  onMenuClick: (key: string, attachment: IAttachment) => void;
}

const AttachmentActions = ({ attachment, onMenuClick }: AttachmentActionsProps) => {
  const items: MenuProps['items'] = [
    {
      key: 'download',
      label: 'Download',
      icon: <ArrowDownToLine size={16} />,
    },
    {
      key: 'delete',
      label: 'Delete',
      icon: <Trash2 size={16} />,
      danger: true,
    },
  ];

  return (
    <Dropdown
      menu={{
        items,
        onClick: ({ key }) => onMenuClick(key, attachment),
      }}
      trigger={['click']}
      placement="bottomRight"
    >
      <Button type="text" icon={<EllipsisVertical size={16} />} />
    </Dropdown>
  );
};

export default AttachmentActions;
