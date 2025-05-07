import React from "react";
import { Avatar, Card, Space, Tag, Typography } from "antd";
import { getRandomColor } from "../../../utils";
import { Button } from "../../../components";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import { Link } from "react-router";
const { Title, Paragraph } = Typography;

interface IProps {
  invitation: {
    _id: string;
    board: {
      _id: string;
      name: string;
    };
    user: {
      _id: string;
      first_name: string;
      last_name: string;
      email: string;
    };
    invitedBy: {
      _id: string;
      first_name: string;
      last_name: string;
      email: string;
    };
    status: string;
  };
}

const InvitationCard = ({ invitation }: IProps) => {
  const { user, board, invitedBy, status } = invitation;
  return (
    <Card
      hoverable
      className="invitations-card"
      bodyStyle={{ padding: "16px" }}
    >
      <div className="card-grid">
        <div className="member-grid">
          <Avatar style={{ background: getRandomColor(user._id) }}>
            {user.first_name}
            {user.last_name}
          </Avatar>
          <div>
            <Title level={5} className="margin-0 name-wrap">
              {user.first_name} {user.last_name} <Tag>{status}</Tag>
            </Title>
            <Paragraph className="margin-0 email-text">{user.email}</Paragraph>
          </div>
        </div>
        <div className="card-actions">
          <Button
            type="default"
            className="button margin-0 small-btn"
            icon={<CloseOutlined />}
            breakPoint={720}
          >
            <Space>Reject</Space>
          </Button>
          <Button
            type="primary"
            className="button margin-0 small-btn"
            icon={<CheckOutlined />}
            breakPoint={720}
          >
            <Space>Approve</Space>
          </Button>
        </div>
      </div>
      <Paragraph className="margin-top-10">
        has been invited to <Link to={`/board/${board._id}`}>{board.name}</Link>{" "}
        by{" "}
        <span className="user-name">
          {invitedBy.first_name + " " + invitedBy.last_name}({invitedBy.email})
        </span>.
      </Paragraph>
    </Card>
  );
};

export default InvitationCard;
