import React, { useState, useMemo } from "react";
import {
  Card,
  Select,
  Input,
  DatePicker,
  List,
  Typography,
  Row,
  Col,
  Statistic,
  Divider,
} from "antd";
import type { RangePickerProps } from "antd/es/date-picker";
import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

const { Option } = Select;
const { RangePicker } = DatePicker;
const { Text } = Typography;

interface Member {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  board: string;
  joinDate: string;
}

interface Props {
  members: Member[];
  boards: string[];
  roles: string[];
  statuses: string[];
}

const AnalyticalMemberCard: React.FC<Props> = ({
  members,
  boards,
  roles,
  statuses,
}) => {
  const [selectedBoard, setSelectedBoard] = useState<string>();
  const [selectedRole, setSelectedRole] = useState<string>();
  const [selectedStatus, setSelectedStatus] = useState<string>();
  const [search, setSearch] = useState("");
  const [dateRange, setDateRange] = useState<RangePickerProps["value"]>(null);

  const filteredMembers = useMemo(() => {
    return members.filter((member) => {
      const joinDate = dayjs(member.joinDate);
      return (
        (!selectedBoard || member.board === selectedBoard) &&
        (!selectedRole || member.role === selectedRole) &&
        (!selectedStatus || member.status === selectedStatus) &&
        (!search ||
          member.name.toLowerCase().includes(search.toLowerCase()) ||
          member.email.toLowerCase().includes(search.toLowerCase())) &&
        (!dateRange ||
          (joinDate.isSameOrAfter(dateRange[0], "day") &&
            joinDate.isSameOrBefore(dateRange[1], "day")))
      );
    });
  }, [members, selectedBoard, selectedRole, selectedStatus, search, dateRange]);

  const stats = useMemo(() => {
    const total = filteredMembers.length;
    const active = filteredMembers.filter((m) => m.status === "Active").length;
    const byRole: Record<string, number> = {};
    filteredMembers.forEach((m) => {
      byRole[m.role] = (byRole[m.role] || 0) + 1;
    });
    return { total, active, byRole };
  }, [filteredMembers]);

  return (
    <Card title="Board Members Analytics" style={{ width: "100%" }}>
      {/* KPIs */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Statistic title="Total Members" value={stats.total} />
        </Col>
        <Col span={6}>
          <Statistic title="Active Members" value={stats.active} />
        </Col>
        {Object.entries(stats.byRole).map(([role, count]) => (
          <Col key={role} span={6}>
            <Statistic title={`${role}s`} value={count} />
          </Col>
        ))}
      </Row>

      {/* Filters */}
      <Row gutter={[16, 16]}>
        <Col span={12} md={6}>
          <Select
            allowClear
            placeholder="Board"
            value={selectedBoard}
            onChange={setSelectedBoard}
            style={{ width: "100%" }}
          >
            {boards.map((b) => (
              <Option key={b} value={b}>
                {b}
              </Option>
            ))}
          </Select>
        </Col>
        <Col span={12} md={6}>
          <Select
            allowClear
            placeholder="Role"
            value={selectedRole}
            onChange={setSelectedRole}
            style={{ width: "100%" }}
          >
            {roles.map((r) => (
              <Option key={r} value={r}>
                {r}
              </Option>
            ))}
          </Select>
        </Col>
        <Col span={12} md={6}>
          <Select
            allowClear
            placeholder="Status"
            value={selectedStatus}
            onChange={setSelectedStatus}
            style={{ width: "100%" }}
          >
            {statuses.map((s) => (
              <Option key={s} value={s}>
                {s}
              </Option>
            ))}
          </Select>
        </Col>
        <Col span={12} md={6}>
          <Input.Search
            allowClear
            placeholder="Search name/email"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: "100%" }}
          />
        </Col>
        <Col span={24} md={12}>
          <RangePicker
            style={{ width: "100%" }}
            value={dateRange}
            onChange={setDateRange}
          />
        </Col>
      </Row>

      <Divider />

      {/* Filtered List */}
      <List
        bordered
        style={{ marginTop: 16 }}
        dataSource={filteredMembers}
        locale={{ emptyText: "No members match filters" }}
        renderItem={(member) => (
          <List.Item>
            <div style={{ flexGrow: 1 }}>
              <Text strong>{member.name}</Text> -{" "}
              <Text type="secondary">{member.email}</Text>
              <br />
              <Text>
                {member.role} | {member.status} | {member.board}
              </Text>
            </div>
            <div>
              <Text type="secondary">
                {dayjs(member.joinDate).format("YYYY-MM-DD")}
              </Text>
            </div>
          </List.Item>
        )}
      />
    </Card>
  );
};

export default AnalyticalMemberCard;
