import React, { useEffect } from 'react';
import { List, Avatar, Tag, Spin } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import dayjs from 'dayjs';
import { UserRound } from 'lucide-react';
import { Priority } from '../../utils/enums/task';
import { getUpcomingTasks } from '../../store/slices/dashboardSlice';

const UpcomingTasks: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { upcomingTasks, loading } = useSelector((state: RootState) => state.dashboard);

  useEffect(() => {
    (async () => await dispatch(getUpcomingTasks()))();
  }, [dispatch]);

  if (loading) {
    return (
      <div className="dashboard-loading-container">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div style={{ marginBottom: 24, height: '390px', overflow: 'auto' }}>
      <List
        size="small"
        dataSource={upcomingTasks}
        renderItem={(item) => (
          <List.Item
            style={{
              border: '1px solid rgb(204 204 204 / 25%)',
              borderRadius: 8,
              marginBottom: 12,
            }}
          >
            <List.Item.Meta
              avatar={
                <Avatar size={40}>
                  {item?.assigned_to ? (
                    (item?.assigned_to?.first_name?.[0]?.toUpperCase() ?? '') + (item?.assigned_to?.last_name?.[0]?.toUpperCase() ?? '')
                  ) : (
                    <UserRound size={20} />
                  )}
                </Avatar>
              }
              title={
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <span style={{ fontWeight: 500 }}>{item.title}</span>
                  <Tag
                    color={
                      item.priority === Priority.CRITICAL
                        ? 'red'
                        : item.priority === Priority.HIGH
                          ? 'yellow'
                          : item.priority === Priority.LOW
                            ? 'green'
                            : 'blue'
                    }
                    style={{ marginLeft: 8 }}
                  >
                    {item.priority}
                  </Tag>
                </div>
              }
              description={
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span
                    style={{
                      color: 'rgb(127 137 235)',
                      fontWeight: 500,
                    }}
                  >
                    {dayjs(item.end_date).format('MMM DD, YYYY')}
                  </span>
                  <span
                    style={{ color: '#595959', fontSize: 13 }}
                    dangerouslySetInnerHTML={{
                      __html: item.description,
                    }}
                  />
                </div>
              }
            />
          </List.Item>
        )}
      />
    </div>
  );
};

export default UpcomingTasks;
