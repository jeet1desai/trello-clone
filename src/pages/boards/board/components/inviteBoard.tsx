import React, { useState } from 'react';
import { Modal, Input, Select, Button, List, Avatar, Space, Typography, Divider } from 'antd';
import { LinkOutlined, UserOutlined } from '@ant-design/icons';
import '../../../../layout/styles/Board.css';

const { Text } = Typography;

interface InviteBoardProps {
  isOpen: boolean;
  onClose: () => void;
}

const InviteBoard: React.FC<InviteBoardProps> = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('Member');

  const handleShare = () => {
    // Handle share logic here
    console.log('Sharing with:', email, 'as', role);
    setEmail('');
  };

  const handleCreateLink = () => {
    // Handle create link logic here
    console.log('Creating share link');
  };

  const mockMember = {
    name: 'tatva',
    email: '@tatva1590',
    role: 'Admin',
    isAdmin: true,
  };

  return (
    <Modal
      title="Share board"
      open={isOpen}
      onCancel={onClose}
      footer={null}
      width={520}
      className="invite-modal"
    >
      <div className="share-container">
        <div className="share-input-group">
          <Input
            placeholder="Email address or name"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ flex: 1 }}
          />
          <Select
            defaultValue="Member"
            value={role}
            onChange={(value) => setRole(value)}
            style={{ width: 120 }}
          >
            <Select.Option value="Member">Member</Select.Option>
            <Select.Option value="Admin">Admin</Select.Option>
          </Select>
          <Button type="primary" onClick={handleShare}>
            Share
          </Button>
        </div>

        <div className="link-section">
          <Space align="center">
            <LinkOutlined className="link-icon" />
            <div className="link-content">
              <Text>Share this board with a link</Text>
              <p className="display-start" onClick={handleCreateLink}>
                Create link
              </p>
            </div>
          </Space>
        </div>

        <Divider style={{ margin: '12px 0' }} />

        <div className="members-section">
          <div className="member-count">
            <Text strong>Board members</Text>
            <Text type="secondary">1</Text>
          </div>

          <List
            itemLayout="horizontal"
            dataSource={[mockMember]}
            renderItem={(item) => (
              <List.Item
                extra={
                  <Select
                    defaultValue={item.role}
                    style={{ width: 120 }}
                    disabled={item.isAdmin}
                  >
                    <Select.Option value="Member">Member</Select.Option>
                    <Select.Option value="Admin">Admin</Select.Option>
                  </Select>
                }
              >
                <List.Item.Meta
                  avatar={
                    <Avatar icon={<UserOutlined />}>
                      {item.name.charAt(0).toUpperCase()}
                    </Avatar>
                  }
                  title={item.name}
                  description={item.email}
                />
              </List.Item>
            )}
          />
        </div>
      </div>
    </Modal>
  );
};

export default InviteBoard;
