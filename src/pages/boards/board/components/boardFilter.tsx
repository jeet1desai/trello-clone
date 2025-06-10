import React from 'react';
import { Avatar, Checkbox } from 'antd';
import { getRandomColor } from '../../../../utils';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../store';
import { Calendar, Clock, Tag, UserRound } from 'lucide-react';

interface IProps {
  selectedFilters: any;
  handleMemberFilter: (e: any, key: string) => void;
}

const BoardFilter = ({ selectedFilters, handleMemberFilter }: IProps) => {
  const { currentUser } = useSelector((state: RootState) => state.user);
  const { boardLabels, invitedMemberList } = useSelector((state: RootState) => state.board);

  return (
    <>
      <p className="filter-sub-title" style={{ marginTop: 0 }}>
        Members
      </p>
      <div className="custom-filter-content">
        <Checkbox
          value="no-members"
          checked={selectedFilters.hasMember !== undefined ? !selectedFilters.hasMember : false}
          onChange={(e) => {
            handleMemberFilter({ target: { value: 'no-members', checked: !e.target.checked } }, 'hasMember');
          }}
        >
          <div
            style={{
              display: 'flex',
              gap: 4,
              alignItems: 'center',
            }}
          >
            <Avatar
              style={{
                background: '#CCCCCC',
                width: '26px',
                height: '26px',
              }}
            >
              <UserRound size={14} />
            </Avatar>
            No members
          </div>
        </Checkbox>
        <Checkbox
          value="all"
          checked={selectedFilters.filterBy.includes('all') || selectedFilters.filterBy?.length === invitedMemberList?.length}
          onChange={(e) => handleMemberFilter(e, 'filterBy')}
        >
          All
        </Checkbox>
        <Checkbox checked={true}>
          <div
            style={{
              display: 'flex',
              gap: 4,
              alignItems: 'center',
            }}
          >
            <Avatar
              style={{
                background: getRandomColor(currentUser?.id ?? ''),
                width: '26px',
                height: '26px',
              }}
            >
              <p style={{ fontSize: '11px' }}>
                {currentUser?.first_name?.[0]?.toUpperCase()}
                {currentUser?.last_name?.[0]?.toUpperCase()}
              </p>
            </Avatar>
            Cards assigned to me
          </div>
        </Checkbox>
        {invitedMemberList
          ?.filter((member) => member.memberId._id !== currentUser?.id)
          ?.map((member) => (
            <Checkbox
              value={member.memberId._id}
              key={member._id}
              checked={selectedFilters.filterBy.includes(member.memberId._id) || selectedFilters.filterBy.includes('all')}
              onChange={(e) => handleMemberFilter(e, 'filterBy')}
            >
              <div
                style={{
                  display: 'flex',
                  gap: 4,
                  alignItems: 'center',
                }}
              >
                <Avatar
                  style={{
                    background: getRandomColor(member.memberId?._id),
                    width: '26px',
                    height: '26px',
                  }}
                >
                  <p style={{ fontSize: '11px' }}>
                    {member.memberId.first_name?.[0]?.toUpperCase()}
                    {member.memberId.last_name?.[0]?.toUpperCase()}
                  </p>
                </Avatar>
                {member.memberId.first_name} {member.memberId.last_name ?? ''}
              </div>
            </Checkbox>
          ))}
      </div>
      <p className="filter-sub-title">Card status</p>
      <div className="custom-filter-content">
        <Checkbox
          value="completed"
          checked={selectedFilters.markAsDone}
          onChange={(e) => {
            handleMemberFilter(e, 'markAsDone');
          }}
        >
          Marked as complete
        </Checkbox>
        <Checkbox
          value="not-completed"
          checked={selectedFilters.markAsDone !== undefined ? !selectedFilters.markAsDone : false}
          onChange={(e) => {
            handleMemberFilter({ target: { value: 'not-completed', checked: false } }, 'markAsDone');
          }}
        >
          Not marked as complete
        </Checkbox>
      </div>
      <p className="filter-sub-title">Due date</p>
      <div className="custom-filter-content">
        <Checkbox
          value="no-dates"
          checked={selectedFilters.hasDueDate !== undefined ? !selectedFilters.hasDueDate : false}
          onChange={(e) => {
            handleMemberFilter(
              {
                target: {
                  checked: false,
                  value: false,
                },
              },
              'hasDueDate'
            );
          }}
        >
          <div
            style={{
              display: 'flex',
              gap: 4,
              alignItems: 'center',
            }}
          >
            <Avatar
              style={{
                background: '#CCCCCC',
                width: '26px',
                height: '26px',
              }}
            >
              <Calendar size={14} />
            </Avatar>
            No dates
          </div>
        </Checkbox>
        <Checkbox
          value="overdue"
          onChange={(e) => {
            handleMemberFilter(e, 'hasOverDue');
          }}
        >
          <div
            style={{
              display: 'flex',
              gap: 4,
              alignItems: 'center',
            }}
          >
            <Clock
              size={14}
              style={{
                color: 'white',
                background: 'rgb(211, 32, 41)',
                padding: '4px',
                borderRadius: '50%',
                width: '24px',
                height: '24px',
              }}
            />
            Overdue
          </div>
        </Checkbox>
        <Checkbox
          value="day"
          onChange={(e) => {
            handleMemberFilter(e, 'dueTimeframe');
          }}
        >
          <div
            style={{
              display: 'flex',
              gap: 4,
              alignItems: 'center',
            }}
          >
            <Clock
              size={14}
              style={{
                color: 'white',
                background: '#F5CD47',
                padding: '4px',
                borderRadius: '50%',
                width: '24px',
                height: '24px',
              }}
            />
            Due in the next day
          </div>
        </Checkbox>
        <Checkbox
          value="week"
          onChange={(e) => {
            handleMemberFilter(e, 'dueTimeframe');
          }}
        >
          <div
            style={{
              display: 'flex',
              gap: 4,
              alignItems: 'center',
            }}
          >
            <Clock
              size={14}
              style={{
                color: 'white',
                padding: '4px',
                background: '#CCCCCC',
                borderRadius: '50%',
                width: '24px',
                height: '24px',
              }}
            />
            Due in the next week
          </div>
        </Checkbox>
        <Checkbox
          value="month"
          onChange={(e) => {
            handleMemberFilter(e, 'dueTimeframe');
          }}
        >
          <div
            style={{
              display: 'flex',
              gap: 4,
              alignItems: 'center',
            }}
          >
            <Clock
              size={14}
              style={{
                color: 'white',
                padding: '4px',
                background: '#CCCCCC',
                borderRadius: '50%',
                width: '24px',
                height: '24px',
              }}
            />
            Due in the next month
          </div>
        </Checkbox>
      </div>
      <p className="filter-sub-title">Labels</p>
      <div className="custom-filter-content">
        <Checkbox>
          <div
            style={{
              display: 'flex',
              gap: 4,
              alignItems: 'center',
            }}
          >
            <Avatar
              style={{
                background: '#CCCCCC',
                width: '26px',
                height: '26px',
              }}
            >
              <Tag size={14} />
            </Avatar>
            No labels
          </div>
        </Checkbox>
        {boardLabels?.map((label) => {
          return (
            <Checkbox
              value={label._id}
              onChange={(e) => {
                handleMemberFilter(e, 'labelIds');
              }}
            >
              <div
                style={{
                  background: label.backgroundColor,
                  width: '100%',
                  padding: '3px 8px',
                  borderRadius: '4px',
                  color: 'white',
                }}
              >
                {label.name}
              </div>
            </Checkbox>
          );
        })}
      </div>
    </>
  );
};

export default BoardFilter;
