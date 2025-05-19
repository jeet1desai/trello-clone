import React from "react";
import { Avatar, Checkbox } from "antd";
import { getRandomColor } from "../../../../utils";
import { useSelector } from "react-redux";
import { RootState } from "../../../../store";
import { Calendar, Clock, Tag, UserRound } from "lucide-react";

interface IProps {
  selectedFilters: any[];
  handleMemberFilter: (e: any) => void;
}

const BoardFilter = ({ selectedFilters, handleMemberFilter }: IProps) => {
  const { currentUser } = useSelector((state: RootState) => state.user);
  const { boardLabels, invitedMemberList } = useSelector(
    (state: RootState) => state.board
  );

  return (
    <>
      <p className="filter-sub-title">Members</p>
      <div className="custom-filter-content">
        <Checkbox
          value="no-members"
          checked={selectedFilters.includes("no-members")}
          onChange={(e) => {
            handleMemberFilter(e);
          }}
        >
          <div
            style={{
              display: "flex",
              gap: 4,
              alignItems: "center",
            }}
          >
            <Avatar
              style={{
                background: "#CCCCCC",
                width: "26px",
                height: "26px",
              }}
            >
              <UserRound size={14} />
            </Avatar>
            No members
          </div>
        </Checkbox>
        <Checkbox checked={true}>
          <div
            style={{
              display: "flex",
              gap: 4,
              alignItems: "center",
            }}
          >
            <Avatar
              style={{
                background: getRandomColor(currentUser?.id ?? ""),
                width: "26px",
                height: "26px",
              }}
            >
              <p style={{ fontSize: "11px" }}>
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
              checked={
                selectedFilters.includes(member.memberId._id) ||
                selectedFilters.includes("all")
              }
              onChange={(e) => handleMemberFilter(e)}
            >
              <div
                style={{
                  display: "flex",
                  gap: 4,
                  alignItems: "center",
                }}
              >
                <Avatar
                  style={{
                    background: getRandomColor(member.memberId?._id),
                    width: "26px",
                    height: "26px",
                  }}
                >
                  <p style={{ fontSize: "11px" }}>
                    {member.memberId.first_name?.[0]?.toUpperCase()}
                    {member.memberId.last_name?.[0]?.toUpperCase()}
                  </p>
                </Avatar>
                {member.memberId.first_name} {member.memberId.last_name ?? ""}
              </div>
            </Checkbox>
          ))}
      </div>
      <p className="filter-sub-title">Card status</p>
      <div className="custom-filter-content">
        <Checkbox value="completed">Marked as complete</Checkbox>
        <Checkbox>Not marked as complete</Checkbox>
      </div>
      <p className="filter-sub-title">Due date</p>
      <div className="custom-filter-content">
        <Checkbox>
          <div
            style={{
              display: "flex",
              gap: 4,
              alignItems: "center",
            }}
          >
            <Avatar
              style={{
                background: "#CCCCCC",
                width: "26px",
                height: "26px",
              }}
            >
              <Calendar size={14} />
            </Avatar>
            No dates
          </div>
        </Checkbox>
        <Checkbox>
          <div
            style={{
              display: "flex",
              gap: 4,
              alignItems: "center",
            }}
          >
            <Clock
              size={14}
              style={{
                color: "white",
                background: "rgb(211, 32, 41)",
                padding: "4px",
                borderRadius: "50%",
                width: "24px",
                height: "24px",
              }}
            />
            Overdue
          </div>
        </Checkbox>
        <Checkbox>
          <div
            style={{
              display: "flex",
              gap: 4,
              alignItems: "center",
            }}
          >
            <Clock
              size={14}
              style={{
                color: "white",
                background: "#4CAF50",
                padding: "4px",
                borderRadius: "50%",
                width: "24px",
                height: "24px",
              }}
            />
            Ahead of schedule
          </div>
        </Checkbox>
      </div>
      <p className="filter-sub-title">Labels</p>
      <div className="custom-filter-content">
        <Checkbox>
          <div
            style={{
              display: "flex",
              gap: 4,
              alignItems: "center",
            }}
          >
            <Avatar
              style={{
                background: "#CCCCCC",
                width: "26px",
                height: "26px",
              }}
            >
              <Tag size={14} />
            </Avatar>
            No labels
          </div>
        </Checkbox>
        {boardLabels?.map((label) => {
          return (
            <Checkbox>
              <div
                style={{
                  background: label.backgroundColor,
                  width: "100%",
                  padding: "3px 8px",
                  borderRadius: "4px",
                  color: "white",
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
