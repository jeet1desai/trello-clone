import React, { useEffect, useState } from 'react';
import { Typography, Space, Segmented, Pagination, Empty } from 'antd';
import '../../layout/styles/invitations.css';
import InvitationCard from './component/InvitationCard';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import { getInvitationsList } from '../../store/slices/invitationSlice';
import { StatusType } from '../../utils/enums/invitaion';
import { Loader } from '../../components';
const { Title, Paragraph } = Typography;

const InvitationsHero: React.FC = () => (
  <div className="header-hero gradient-bg">
    <h1 className="header-hero-title">Invitations</h1>
    <p className="header-hero-subtitle">Manage your board access and invitations.</p>
  </div>
);

const Invitations = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, invitationList, pagination } = useSelector((state: RootState) => state.invitation);
  const [selectedStatus, setSelectedStatus] = useState(StatusType.All);

  useEffect(() => {
    dispatch(getInvitationsList({ page: 1, status: 'All' }));
  }, [dispatch]);

  return (
    <>
      <Loader loading={loading} fullScreen />
      <div className="invitations-container">
        <InvitationsHero />
        <div className="invitations-header">
          <div className="invitations-header-left">
            <Title level={3} className="page-title">
              Invitation Requests
            </Title>
            <Paragraph style={{ marginBottom: 0 }}>Review and manage pending invitation requests</Paragraph>
          </div>
          <div className="invitations-header-right">
            <Space>
              <Segmented
                size="large"
                options={[StatusType.All, StatusType.PENDING, StatusType.APPROVED, StatusType.REJECTED]}
                onChange={(value) => {
                  setSelectedStatus(value);
                  dispatch(getInvitationsList({ page: 1, status: value }));
                }}
              />
            </Space>
          </div>
        </div>

        {invitationList?.length > 0 ? (
          <div className="invitations-grid">
            {invitationList.map((invitation) => (
              <InvitationCard key={invitation._id} invitation={invitation} />
            ))}
          </div>
        ) : (
          <Empty description="No Invitations found" className="empty-container" />
        )}
      </div>
      {pagination.totalPages > 1 && (
        <Pagination
          align="center"
          style={{ marginTop: '40px' }}
          defaultCurrent={1}
          pageSize={pagination.limit}
          current={pagination.currentPage}
          total={pagination.totalRecords}
          onChange={(page) => {
            dispatch(
              getInvitationsList({
                page,
                status: selectedStatus,
              })
            );
          }}
        />
      )}
    </>
  );
};

export default Invitations;
