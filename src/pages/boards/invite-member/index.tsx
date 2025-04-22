import React, { useEffect, useState } from 'react';
import { useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { AppDispatch, RootState } from "../../../store";
import { Button, Typography, Space } from 'antd';
import '../../../layout/styles/Board.css'; // Import the CSS file
import {
  getInvitationDetailsById,
  updateInvitationMemberById,
  InvitationMember,
} from "../../../store/slices/boardSlice";

const { Title, Text, Link } = Typography;

const InviteMemberPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { invitedMemberDetail } = useSelector(
    (state: RootState) => state.board
  );
  const { currentUser } = useSelector(
    (state: RootState) => state.user
  );

  const [invitedMemberDetails, setInvitedMemberDetails] = useState(invitedMemberDetail || ({} as InvitationMember))

  const handleAccept = async () => {
    if (id)
      await dispatch(
        updateInvitationMemberById({
          _id: id,
          status: "COMPLETED",
        })
      );
      navigate("/dashboard")
  };

  const handleReject = async () => {
    if (id)
      await dispatch(
        updateInvitationMemberById({
          _id: id,
          status: "REJECTED",
        })
      );
      navigate("/dashboard")
  };

  const handleRegister = () => {
    navigate("/register")
  };

  useEffect(() => {
    if (id)
      (async () => await dispatch(getInvitationDetailsById(id)))();
  }, [dispatch, id]);

  useEffect(() => {
    if (invitedMemberDetails && invitedMemberDetail) {
      setInvitedMemberDetails(invitedMemberDetail);
    }
  }, [invitedMemberDetails, invitedMemberDetail]);

  return (
    <div className="invite-member-container">
      <div className="invite-member-card">
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          <Space align="center">
            <img
              src={require("../../../assets/base-team-logo.png")}
              alt="Base Team"
              style={{
                width: "32px",
                height: "auto",
                display: "flex",
                alignItems: "center",
                borderRadius: "4px",
              }}
            />
            <Title level={4} style={{ margin: 0 }}>You're invited to join a board</Title>
          </Space>

          <Text strong>Hi {currentUser?.first_name} {currentUser?.last_name},</Text>

          <Text>
            {invitedMemberDetails.invitedBy?.first_name} {invitedMemberDetails.invitedBy?.last_name} has invited you to collaborate on the board '{invitedMemberDetails.boardId?.name}' in the workspace '{invitedMemberDetails.workspaceId?.name}'.
          </Text>

          <Text>
            If you don't have an account, you can{' '}
            <Link onClick={handleRegister}>register here</Link>
          </Text>

          <Space style={{ width: '100%', justifyContent: 'space-between', marginTop: '20px' }}>
            <Button type="primary" size="large" onClick={handleAccept} block style={{ marginRight: '8px' }}>
              Accept
            </Button>
            <Button size="large" onClick={handleReject} block style={{ marginLeft: '8px', background: '#f4f5f7', borderColor: '#f4f5f7', color: '#172b4d' }}>
              Reject
            </Button>
          </Space>
        </Space>
      </div>
    </div>
  );
};

export default InviteMemberPage;