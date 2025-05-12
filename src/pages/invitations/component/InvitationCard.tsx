import React from "react";
import { Avatar, Card, Space, Tag, Typography } from "antd";
import { getRandomColor } from "../../../utils";
import { Button } from "../../../components";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import { Link } from "react-router";
import {
  Invitation,
  manageInvitation,
} from "../../../store/slices/invitationSlice";
import { InvitationStatus } from "../../../utils/enums/invitaion";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../store";
const { Title, Paragraph } = Typography;

interface IProps {
  invitation: Invitation;
}

const InvitationCard = ({ invitation }: IProps) => {
  const { _id, boardId, invitedBy, invitees, status } =
    invitation;
  const dispatch = useDispatch<AppDispatch>();

  return (
    <Card
      hoverable
      className="invitations-card"
      bodyStyle={{ padding: "16px" }}
    >
      <div className="card-grid">
        <div className="member-grid">
          <Avatar style={{ background: getRandomColor(_id) }}>
            {invitees.fullName?.[0]?.toUpperCase()}
          </Avatar>
          <div>
            <Title level={5} className="margin-0 name-wrap">
              {invitees.fullName}{" "}
              <Tag
                color={
                  status === InvitationStatus.ADMIN_PENDING
                    ? "warning"
                    : status === InvitationStatus.ADMIN_APPROVED
                    ? "success"
                    : "error"
                }
              >
                {status === InvitationStatus.ADMIN_PENDING
                  ? "Pending"
                  : status === InvitationStatus.ADMIN_APPROVED
                  ? "Approved"
                  : "Rejected"}
              </Tag>
            </Title>
            <Paragraph className="margin-0 email-text">
              {invitees.email}
            </Paragraph>
          </div>
        </div>
        {status === InvitationStatus.ADMIN_PENDING ? (
          <div className="card-actions">
            <Button
              type="default"
              className="reject-button margin-0 small-btns"
              icon={<CloseOutlined />}
              breakPoint={720}
              onClick={() =>
                dispatch(
                  manageInvitation({
                    status: InvitationStatus.ADMIN_REJECTED,
                    inviteId: _id,
                  })
                )
              }
            >
              <Space>Reject</Space>
            </Button>
            <Button
              type="primary"
              className="button success-button margin-0 small-btns"
              icon={<CheckOutlined />}
              breakPoint={720}
              onClick={() =>
                dispatch(
                  manageInvitation({
                    status: InvitationStatus.ADMIN_APPROVED,
                    inviteId: _id,
                  })
                )
              }
            >
              <Space>Approve</Space>
            </Button>
          </div>
        ) : status === InvitationStatus.ADMIN_APPROVED ? (
          <div className="card-actions">
            <Button
              color="green"
              className="approved-button button"
              icon={<CheckOutlined />}
              breakPoint={720}
              disabled
            >
              <Space>Approved</Space>
            </Button>
          </div>
        ) : (
          <div className="card-actions">
            <Button
              type="default"
              className="rejected-button button"
              icon={<CloseOutlined />}
              breakPoint={720}
              disabled
            >
              <Space>Rejected</Space>
            </Button>
          </div>
        )}
      </div>
      <Paragraph className="margin-top-10">
        has been invited to{" "}
        <Link to={`/board/${boardId._id}`}>{boardId.name}</Link> by{" "}
        <span className="user-name">
          {invitedBy.first_name + " " + (invitedBy.last_name ?? "")}({invitedBy.email})
        </span>
        .
      </Paragraph>
    </Card>
  );
};

export default InvitationCard;
