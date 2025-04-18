import { Input, Checkbox, Button, List, Tooltip } from "antd";
import { EditOutlined } from "@ant-design/icons";
import React, { useState } from "react";

const labelsData = [
  { id: "1", name: "", color: "#007b5a" },
  { id: "2", name: "", color: "#d9a900" },
  { id: "3", name: "", color: "#d9822b" },
  { id: "4", name: "", color: "#cb3c2e" },
  { id: "5", name: "", color: "#6558c3" },
  { id: "6", name: "", color: "#0052cc" },
  { id: "7", name: "hello", color: "#4a4a4a" },
];

const LabelPopup: React.FC = () => {
  const [selectedLabels, setSelectedLabels] = useState<string[]>([]);
  const [search, setSearch] = useState("");

  const toggleLabel = (id: string) => {
    setSelectedLabels((prev) =>
      prev.includes(id)
        ? prev.filter((labelId) => labelId !== id)
        : [...prev, id]
    );
  };

  const filteredLabels = labelsData.filter((label) =>
    label.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div
      style={{
        width: 300,
        padding: 16,
        borderRadius: 8,
        color: "#fff",
      }}
    >
      <h4 style={{ color: "#fff" }}>Labels</h4>
      <Input
        placeholder="Search labels..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ marginBottom: 16 }}
      />

      <List
        dataSource={filteredLabels}
        renderItem={(label) => (
          <List.Item style={{ padding: "8px 0" }}>
            <Checkbox
              checked={selectedLabels.includes(label.id)}
              onChange={() => toggleLabel(label.id)}
              style={{
                width: 20,
                marginRight: 8,
              }}
            />
            <div
              style={{
                backgroundColor: label.color,
                flex: 1,
                height: 28,
                borderRadius: 4,
                display: "flex",
                alignItems: "center",
                padding: "0 8px",
                color: "#fff",
              }}
            >
              {label.name || <span style={{ flex: 1 }} />}
            </div>
            <Tooltip title="Edit label">
              <Button
                icon={<EditOutlined />}
                size="small"
                style={{ marginLeft: 8 }}
              />
            </Tooltip>
          </List.Item>
        )}
      />

      <Button block style={{ marginTop: 16 }}>
        Create a new label
      </Button>
      <Button block type="default" style={{ marginTop: 8 }}>
        Enable colorblind friendly mode
      </Button>
    </div>
  );
};

export default LabelPopup;
