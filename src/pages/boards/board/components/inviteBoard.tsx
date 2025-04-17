import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../../store";
import { useParams } from "react-router";
import {
  getBoardMemberListById,
  removeBoardMemberFromListById,
  MemberData,
  inviteBoardMember,
} from "../../../../store/slices/boardSlice";
import { Modal, Select, Button, List, Avatar, Space, Typography, Divider } from 'antd';
import { LinkOutlined, UserOutlined } from '@ant-design/icons';
import '../../../../layout/styles/Board.css';

const { Text } = Typography;

interface InviteBoardProps {
  isOpen: boolean;
  onClose: () => void;
}

const InviteBoard: React.FC<InviteBoardProps> = ({ isOpen, onClose }) => {
  const [emails, setEmails] = useState<string[]>([]);
  const [emailError, setEmailError] = useState<string>('');
  const [role, setRole] = useState('Member');
  const [removeModalVisible, setRemoveModalVisible] = useState(false);
  const [selectedMember, setSelectedMember] = useState<any>(null);
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();

  const { invitedMemeberList, loading } = useSelector((state: RootState) => state.board);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailChange = (newEmails: string[]) => {
    const lastEmail = newEmails[newEmails.length - 1];
    
    if (newEmails.length < emails.length) {
      setEmails(newEmails);
      return;
    }
    
    if (lastEmail && validateEmail(lastEmail)) {
      setEmailError('')
      setEmails(newEmails);
    } else {
      if (lastEmail) {
        setEmailError("Invalid Email address")
      }
    }
  };

  const handleShare = async () => {
    if (id) await dispatch(inviteBoardMember({
      _id: id,
      members: emails
    }))
    setEmails([]);
  };

  const handleCreateLink = () => {
    console.log('Creating share link');
  };

  const handleRemoveMember = (member: MemberData) => {
    setSelectedMember(member);
    setRemoveModalVisible(true);
  };

  const confirmRemoveMember = async () => {
    if (selectedMember) {
      setRemoveModalVisible(false);
      setSelectedMember(null);
      if (id) await dispatch(removeBoardMemberFromListById({
        _id: selectedMember.boardId._id,
        memberId: selectedMember.memberId._id
      }));
    }
  };

  useEffect(() => {
    if (id) (async () => await dispatch(getBoardMemberListById(id)))();
  }, [dispatch, id]);

  const mockMember = {
    name: 'tatva',
    email: '@tatva1590',
    role: 'Admin',
    isAdmin: true,
  };

  return (
    <>
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
            <Select
              mode="tags"
              style={{ flex: 1 }}
              placeholder="Email address"
              value={emails}
              onChange={handleEmailChange}
              tokenSeparators={[',', ' ']}
              open={false}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  const inputValue = (e.target as HTMLInputElement).value;
                  if (!validateEmail(inputValue)) {
                    e.preventDefault();
                    e.stopPropagation();
                  }
                } else {
                  setEmailError('')
                }
              }}
            />
            <Select
              defaultValue="Member"
              value={role}
              onChange={(value) => setRole(value)}
              style={{ width: 120 }}
            >
              <Select.Option value="Member">Member</Select.Option>
            </Select>
            <Button loading={loading} type="primary" onClick={handleShare}>
              Share
            </Button>
          </div>
          <span className="color-red">{emailError}</span>

          <div className="link-section">
            <Space align="center">
              <Button
                type="default"
                icon={<LinkOutlined />}
                className="button"
              />
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
              <Text type="secondary">{invitedMemeberList.length}</Text>
            </div>

            <List
              itemLayout="horizontal"
              dataSource={invitedMemeberList}
              renderItem={(item) => (
                <List.Item
                  extra={
                    <Select
                      value={item.role}
                      style={{ width: 150 }}
                      disabled={item.role === "ADMIN"}
                      onChange={(value: "MEMBER" | "ADMIN" | "REMOVE") => {
                        if (value === 'REMOVE') {
                          handleRemoveMember(item);
                        } else {
                          console.log('Role changed to:', value);
                        }
                      }}
                    >
                      <Select.Option value="MEMBER">Member</Select.Option>
                      <Select.Option disabled={item.role === "MEMBER"} value="ADMIN">Admin</Select.Option>
                      <Select.Option value="REMOVE">Remove Member</Select.Option>
                    </Select>
                  }
                >
                  <List.Item.Meta
                    avatar={
                      <Avatar icon={<UserOutlined />}>
                        {item.memberId.first_name.charAt(0).toUpperCase()}
                      </Avatar>
                    }
                    title={`${item.memberId.first_name} ${item.memberId.last_name}`}
                    description={item.memberId.email}
                  />
                </List.Item>
              )}
            />
          </div>
        </div>
      </Modal>

      <Modal
        title="Remove from board"
        open={removeModalVisible}
        onCancel={() => {
          setRemoveModalVisible(false);
          setSelectedMember(null);
        }}
          footer={[
          <Button 
            key="cancel" 
            onClick={() => {
              setRemoveModalVisible(false);
              setSelectedMember(null);
            }}
          >
            Cancel
          </Button>,
          <Button 
            key="remove" 
            danger 
            type="primary" 
            onClick={confirmRemoveMember}
          >
            Remove
          </Button>
        ]}
      >
        <p>
          {selectedMember ? 
            `${selectedMember.memberId.first_name} ${selectedMember.memberId.last_name} will be removed from all cards on this board.` 
            : 'Member will be removed from all cards on this board.'}
        </p>
      </Modal>
    </>
  );
};

export default InviteBoard;
