import React from 'react';
import { Modal, Typography, List, Avatar, Space, Button } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import { Logs } from 'lucide-react';
import { getRandomColor } from '../../utils';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { generatePath, useNavigate } from 'react-router-dom';
import { PRIVATE_ROUTE } from '../../utils/enums/route';
import { clearUserActivity } from '../../store/slices/userSlice';
dayjs.extend(relativeTime);

const { Text } = Typography;

interface IProps {
  open: boolean;
  onClose: () => void;
  onNextPageLoad?: () => void;
}

const UserActivityModal = ({ open, onClose, onNextPageLoad }: IProps) => {
  const { userActivity } = useSelector((state: RootState) => state.user);
  const user = userActivity?.activities?.[0]?.created_by;
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const navigateToTicket = (boardId: string | undefined, taskId: string | undefined) => {
    const path = boardId ? generatePath(PRIVATE_ROUTE.BOARD, { id: boardId }) + (taskId ? `?task_id=${taskId}` : '') : '#';
    navigate(path);
    onClose();
  };

  return (
    <Modal
      title={null}
      open={open}
      onCancel={onClose}
      footer={null}
      className="task-modal"
      styles={{
        body: {
          padding: 0,
        },
      }}
      width={500}
    >
      <div style={{ display: 'flex', alignItems: 'center', padding: 16, borderBottom: '1px solid #222' }}>
        <Logs size={22} />
        <Avatar src={user?.profile_image?.url} style={{ background: getRandomColor(user?._id ?? ''), marginLeft: 12 }}>
          {user?.first_name?.[0]?.toUpperCase()}
          {user?.last_name?.[0]?.toUpperCase()}
        </Avatar>
        <div style={{ marginLeft: 12 }}>
          <Text strong style={{ fontSize: 18 }}>
            {user?.first_name} {user?.last_name}
          </Text>
          <div style={{ color: '#aaa', fontSize: 14 }}>{user?.email}</div>
        </div>
      </div>
      <div style={{ maxHeight: 400, overflow: 'auto' }}>
        <List
          itemLayout="horizontal"
          dataSource={userActivity?.activities || []}
          renderItem={(item) => {
            const detailsText = (item.details || '')
              .replace(/^"+|"+$/g, '') // Remove leading/trailing quotes
              .replace(/"([^"]*?)"/g, '$1') // Remove internal quotes like "name"
              .replace(/(\w)"(?=\s)/g, '$1') // Remove stray trailing quote after a word
              .replace(/^"\s*"|"\s*"$/, '') // Remove entirely empty quoted strings
              .trim();
            return (
              <List.Item style={{ border: 0, padding: '18px 24px 8px 24px' }}>
                <List.Item.Meta
                  avatar={
                    <Avatar src={item.created_by.profile_image?.url} style={{ background: getRandomColor(item.created_by._id) }}>
                      {item.created_by.first_name?.[0]?.toUpperCase()}
                      {item.created_by.last_name?.[0]?.toUpperCase()}
                    </Avatar>
                  }
                  description={
                    <div>
                      <span className="activity-description">
                        <b>
                          {item.created_by.first_name} {item.created_by.last_name}
                        </b>
                        &nbsp;
                        {item.details ? (
                          item.task?.title && detailsText.includes(item.task.title) ? (
                            <>
                              {detailsText.split(item.task.title).map((part, idx, arr) => (
                                <React.Fragment key={idx}>
                                  <span>{part}</span>
                                  {idx < arr.length - 1 && (
                                    <span className="task-title-link" onClick={() => navigateToTicket(item.board?._id, item.task?._id)}>
                                      {item.task?.title}
                                    </span>
                                  )}
                                </React.Fragment>
                              ))}
                              &nbsp;
                            </>
                          ) : (
                            <>
                              <span className="task-title-link" onClick={() => navigateToTicket(item.board?._id, item.task?._id)}>
                                {item.task?.title || ''}
                              </span>{' '}
                              {item.details}&nbsp;
                            </>
                          )
                        ) : null}
                      </span>
                      <div style={{ color: '#aaa', fontSize: 13, marginTop: 2 }}>
                        {dayjs(item.createdAt).fromNow()} &nbsp;
                        <span style={{ fontSize: 12 }}>{dayjs(item.createdAt).format('MMM D, YYYY, h:mm A')}</span>
                      </div>
                    </div>
                  }
                />
              </List.Item>
            );
          }}
        />
        {userActivity?.pagination.totalPages > 1 && userActivity.pagination.currentPage < userActivity.pagination.totalPages && (
          <Button
            size="small"
            className="button small-btn"
            style={{
              fontSize: '12px',
              margin: '15px 0',
              boxShadow: 'none',
            }}
            onClick={onNextPageLoad}
          >
            Load more activity
          </Button>
        )}
      </div>
    </Modal>
  );
};

export default UserActivityModal;
