import React, { useState } from "react";
import { EditOutlined, LeftOutlined } from "@ant-design/icons";
import { Checkbox, Button, List, Typography } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../../store";
import { Input } from "../../../../components";
import ColorPicker from "./colorPicker";
import {
  addLabelInTask,
  addNewLabel,
  deleteLabel,
  editLabel,
  removeLabelFromTask,
} from "../../../../store/slices/boardSlice";

const { Title } = Typography;

interface IProps {
  boardId: string;
  selectedTaskId: string;
}

const LabelPopup = ({ boardId, selectedTaskId }: IProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { boardLabels, selectedTaskLabels } = useSelector(
    (state: RootState) => state.board
  );
  const [search, setSearch] = useState("");
  const [title, setTitle] = useState("");
  const [selectedColor, setSelectedColor] = useState("black");
  const [isAddFlag, setIsAddFlag] = useState(false);
  const [selectedLabelId, setSelectedLabelId] = useState("");

  const toggleLabel = (id: string) => {
    if (selectedTaskLabels?.map((label) => label?._id).includes(id)) {
      dispatch(removeLabelFromTask({ taskId: selectedTaskId, labelId: id }));
    } else {
      dispatch(addLabelInTask({ task_id: selectedTaskId, label_id: id }));
    }
  };

  const filteredLabels = boardLabels.filter((label) =>
    label.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleCreateUpdateLabel = () => {
    selectedLabelId
      ? dispatch(
          editLabel({
            _id: selectedLabelId,
            name: title,
            background_color: selectedColor,
            text_color: "#FFFFFF",
          })
        )
      : dispatch(
          addNewLabel({
            name: title,
            background_color: selectedColor,
            text_color: "#FFFFFF",
            board: boardId,
          })
        );
    setIsAddFlag(false);
  };

  const handleDeleteLabel = () => {
    dispatch(deleteLabel(selectedLabelId));
    setIsAddFlag(false);
  };

  return (
    <div
      style={{
        width: 300,
        borderRadius: 8,
        color: "#fff",
      }}
    >
      {isAddFlag ? (
        <>
          <Title style={{ marginTop: 0, fontSize: "16px" }}>
            <LeftOutlined
              className="color-inherit"
              onClick={() => {
                setTitle("");
                setSelectedColor("black");
                setIsAddFlag(false);
                setSearch("");
                setSelectedLabelId("");
              }}
            />{" "}
            Create Label
          </Title>
          <div
            style={{ minHeight: "30px", background: "black", padding: "20px" }}
          >
            <div
              style={{
                background: `${selectedColor}`,
                padding: "4px",
                borderRadius: "4px",
              }}
            >
              {title}
            </div>
          </div>
          <Input
            className="form-input"
            placeholder="Enter label title"
            value={title}
            autoFocus
            onChange={(e) => setTitle(e.target.value)}
            style={{ marginTop: 12, marginBottom: 12, borderRadius: "4px" }}
          />
          <ColorPicker value={selectedColor} onChange={setSelectedColor} />
          <div style={{ display: "flex", gap: "8px" }}>
            {selectedLabelId ? (
              <Button
                className="button small-btn"
                block
                danger
                style={{ marginTop: 16 }}
                disabled={
                  selectedTaskLabels?.filter(
                    (label) => label._id === selectedLabelId
                  ).length > 0
                }
                onClick={handleDeleteLabel}
              >
                Delete
              </Button>
            ) : (
              <Button
                className="button small-btn"
                block
                style={{ marginTop: 16 }}
                onClick={() => {
                  setSelectedLabelId("");
                  setTitle("");
                  setSelectedColor("black");
                  setSearch("");
                  setIsAddFlag(false);
                }}
              >
                Cancel
              </Button>
            )}
            <Button
              className="button small-btn"
              type="primary"
              block
              disabled={!title}
              style={{ marginTop: 16 }}
              onClick={handleCreateUpdateLabel}
            >
              {selectedLabelId ? "Update" : "Create"}
            </Button>
          </div>
        </>
      ) : (
        <>
          <Title style={{ marginTop: 0, fontSize: "16px" }}>Labels</Title>
          <Input
            className="form-input"
            placeholder="Search labels..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ marginBottom: 12, borderRadius: "4px" }}
          />
          <List
            style={{ minHeight: "250px", overflowX: "auto" }}
            dataSource={filteredLabels}
            renderItem={(label) => (
              <List.Item
                style={{ padding: "4px 0", borderBlockEnd: "initial" }}
              >
                <Checkbox
                  checked={selectedTaskLabels
                    ?.map((label) => label?._id)
                    .includes(label?._id)}
                  style={{
                    width: 20,
                    marginRight: 8,
                  }}
                  onChange={() => toggleLabel(label._id)}
                />
                <div
                  style={{
                    backgroundColor: label.backgroundColor,
                    flex: 1,
                    height: 30,
                    borderRadius: 4,
                    display: "flex",
                    alignItems: "center",
                    padding: "0 8px",
                    color: label.textColor,
                  }}
                >
                  {label.name || <span style={{ flex: 1 }} />}
                </div>
                <Button
                  className="button small-btn"
                  icon={<EditOutlined />}
                  size="small"
                  style={{ marginLeft: 8 }}
                  onClick={() => {
                    setSelectedLabelId(label._id);
                    setTitle(label.name);
                    setSelectedColor(label.backgroundColor);
                    setIsAddFlag(true);
                  }}
                />
              </List.Item>
            )}
          />
          <Button
            className="button small-btn"
            block
            style={{ marginTop: 16 }}
            onClick={() => {
              setSelectedLabelId("");
              setTitle("");
              setSelectedColor("black");
              setSearch("");
              setIsAddFlag(true);
            }}
          >
            Create a new label
          </Button>
        </>
      )}
    </div>
  );
};

export default LabelPopup;
