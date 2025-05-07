import React from "react";
import { Typography, Space, Segmented } from "antd";
import "../../layout/styles/invitations.css";
import InvitationCard from "./component/InvitationCard";
const { Title, Paragraph } = Typography;

const Invitations = () => {
  return (
    <div className="invitations-container">
      <div className="invitations-header">
        <div className="invitations-header-left">
          <Title level={3} className="page-title">
            Invitation Requests
          </Title>
          <Paragraph style={{ marginBottom: 0 }}>
            Review and manage pending invitation requests
          </Paragraph>
        </div>
        <div className="invitations-header-right">
          <Space>
            <Segmented
              size="large"
              options={["All", "Pending", "Approved", "Rejected"]}
              onChange={(value) => {
                console.log(value);
              }}
            />
          </Space>
        </div>
      </div>

      <div className="invitations-grid">
        {[1, 2, 3].map((invitation) => (
          <InvitationCard
            invitation={{
              _id: "123",
              board: { _id: "1234455", name: "Board" },
              user: {
                _id: "12333",
                first_name: "Test",
                last_name: "User",
                email: "user@yopmail.com",
              },
              invitedBy: {
                _id: "12333",
                first_name: "Test",
                last_name: "User",
                email: "user@yopmail.com",
              },
              status: "Pending",
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default Invitations;
