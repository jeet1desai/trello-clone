import React from "react";
import { Avatar, Card, Space, Tag, Typography } from "antd";
import { getRandomColor } from "../../../utils";
import { Button } from "../../../components";
import { Link } from "react-router";
import {
  Invitation,
  manageInvitation,
} from "../../../store/slices/invitationSlice";
import { InvitationStatus, StatusType } from "../../../utils/enums/invitaion";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../store";
import { Check, X } from "lucide-react";
const { Title, Paragraph } = Typography;

interface IProps {
  invitation: Invitation;
}

const InvitationCard = ({ invitation }: IProps) => {
  const { _id, boardId, invitedBy, invitees, status, is_approved_by_admin } =
    invitation;
  const dispatch = useDispatch<AppDispatch>();

  const getStatusTag = (status: string, isApprovedByAdmin: boolean) => {
    switch (status) {
      case InvitationStatus.ADMIN_PENDING:
        return { label: "Pending", color: "warning" };

      case InvitationStatus.ADMIN_APPROVED:
        return { label: "Approved", color: "success" };

      case InvitationStatus.COMPLETED:
        if (isApprovedByAdmin) {
          return { label: "Approved", color: "success" };
        } else {
          return { label: "Rejected", color: "error" };
        }

      default:
        return { label: "Rejected", color: "error" };
    }
  };

  const { label, color } = getStatusTag(status, is_approved_by_admin);

  return (
    <Card
      hoverable
      className="invitations-card"
      styles={{
        body: {
          padding: "16px",
        }
      }}
    >
      <div className="card-grid">
        <div className="member-grid">
          <Avatar style={{ background: getRandomColor(_id) }}>
            {invitees.fullName?.[0]?.toUpperCase()}
          </Avatar>
          <div>
            <Title level={5} className="margin-0 name-wrap">
              {invitees.fullName} <Tag color={color}>{label}</Tag>
            </Title>
            <Paragraph className="margin-0 email-text">
              {invitees.email}
            </Paragraph>
          </div>
        </div>
        {label === StatusType.PENDING ? (
          <div className="card-actions">
            <Button
              type="default"
              className="reject-button margin-0 small-btns"
              icon={<X size={18} />}
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
              icon={<Check size={18} />}
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
        ) : label === StatusType.APPROVED ? (
          <div className="card-actions">
            <Button
              color="green"
              className="approved-button button"
              icon={<Check size={18} />}
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
              icon={<X size={18} />}
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
          {invitedBy.first_name + " " + (invitedBy.last_name ?? "")}(
          {invitedBy.email})
        </span>
        .
      </Paragraph>
    </Card>
  );
};

export default InvitationCard;
