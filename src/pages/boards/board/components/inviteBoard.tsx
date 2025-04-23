import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../../store";
import { useParams } from "react-router";
import {
  removeBoardMemberFromListById,
  MemberData,
  inviteBoardMember,
  getBoardMemberListById
} from "../../../../store/slices/boardSlice";
import {
  Modal,
  Select,
  Button,
  List,
  Avatar,
  Space,
  Typography,
  Divider,
  App,
  Spin,
} from "antd";
import {
  LinkOutlined,
  UserOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import "../../../../layout/styles/Board.css";

const { Text } = Typography;

interface InviteBoardProps {
  isOpen: boolean;
  onClose: () => void;
}

const InviteBoard: React.FC<InviteBoardProps> = ({ isOpen, onClose }) => {
  const { modal } = App.useApp();

  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const { invitedMemberList, loading: memberLoading } = useSelector(
    (state: RootState) => state.board
  );
  const [loading, setLoading] = useState(false);
  const [emails, setEmails] = useState<string[]>([]);
  const [emailError, setEmailError] = useState<string>("");
  const [role, setRole] = useState("Member");

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
      setEmailError("");
      setEmails(newEmails);
    } else {
      if (lastEmail) {
        setEmailError("Invalid Email address");
      }
    }
  };

  const handleShare = async () => {
    setLoading(true);
    if (id)
      await dispatch(
        inviteBoardMember({
          _id: id,
          members: emails,
        })
      );
    setLoading(false);
    setEmails([]);
  };

  const handleCreateLink = () => {
    console.log("Creating share link");
  };

  const handleRemoveMember = (member: MemberData) => {
    modal.confirm({
      title: `Are you sure you want to remove "${member.memberId.first_name} ${member.memberId.last_name}" from the board?`,
      icon: <ExclamationCircleOutlined />,
      content:
        "This action can be done again by inviting the member back to the board.",
      okText: "Remove",
      okType: "danger",
      cancelText: "Cancel",
      okButtonProps: {
        className: "button",
      },
      cancelButtonProps: {
        className: "button",
      },
      onOk() {
        if (id) {
          dispatch(
            removeBoardMemberFromListById({
              _id: member.boardId._id,
              memberId: member.memberId._id,
            })
          );
        }
      },
    });
  };

  useEffect(() => {
    if (id && isOpen)
      (async () => await dispatch(getBoardMemberListById(id)))();
  }, [dispatch, id, isOpen]);

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
          <Select
            mode="tags"
            style={{ flex: 1 }}
            placeholder="Email address"
            value={emails}
            onChange={handleEmailChange}
            tokenSeparators={[",", " "]}
            open={false}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                const inputValue = (e.target as HTMLInputElement).value;
                if (!validateEmail(inputValue)) {
                  e.preventDefault();
                  e.stopPropagation();
                }
              } else {
                setEmailError("");
              }
            }}
          />
          <Select
            className="form-input"
            defaultValue="Member"
            value={role}
            onChange={(value) => setRole(value)}
            style={{ width: 120 }}
          >
            <Select.Option value="Member">Member</Select.Option>
          </Select>
          <Button
            loading={loading}
            type="primary"
            className="button"
            style={{ marginTop: 0 }}
            onClick={handleShare}
          >
            Share
          </Button>
        </div>
        <span className="color-red">{emailError}</span>

        <div className="link-section">
          <Space align="center">
            <Button type="default" icon={<LinkOutlined />} className="button" />
            <div className="link-content">
              <Text>Share this board with a link</Text>
              <p className="display-start" onClick={handleCreateLink}>
                Create link
              </p>
            </div>
          </Space>
        </div>
        <div className="members-section">
          <div className="member-count">
            <Text strong>Board members</Text>

            <Text
              style={{
                padding: "0 5px",
                fontSize: "12px",
                borderRadius: "50%",
                background: "grey",
                color: "white",
              }}
            >
              {invitedMemberList?.length}
            </Text>
          </div>
          <Divider style={{ margin: "12px 0" }} />
          {memberLoading ? (
              <Spin spinning={memberLoading} style={{ display: "flow" }} />
            ) : (
          <List
            itemLayout="horizontal"
            dataSource={invitedMemberList}
            renderItem={(item) => (
              <List.Item
                extra={
                  <Select
                    className="form-input"
                    value={item.role}
                    style={{ width: 150 }}
                    disabled={item.role === "ADMIN"}
                    onChange={(value: "MEMBER" | "ADMIN" | "REMOVE") => {
                      if (value === "REMOVE") {
                        handleRemoveMember(item);
                      }
                    }}
                  >
                    <Select.Option value="MEMBER">Member</Select.Option>
                    <Select.Option
                      disabled={item.role === "MEMBER"}
                      value="ADMIN"
                    >
                      Admin
                    </Select.Option>
                    <Select.Option value="REMOVE">
                      <span style={{ color: "red" }}>Remove Member</span>
                    </Select.Option>
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
            )}
        </div>
      </div>
    </Modal>
  );
};

export default InviteBoard;
