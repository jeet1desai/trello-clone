import React, { useEffect, useState } from "react";
import { Button, Form, FormInstance, Input, Select, Space } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../store";
import { getWorkspacesForBoards } from "../../../store/slices/boardSlice";

interface IProps {
  form: FormInstance<any>;
  isEdit: any;
  defaultWorkspace?: string;
  loading: boolean;
  onCancel: () => void;
  onFinish: any;
}

const AddBoardForm = ({
  form,
  isEdit,
  defaultWorkspace,
  loading,
  onCancel,
  onFinish,
}: IProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { boardWorkspaces } = useSelector(
    (state: RootState) => state.board
  );

  const [searchText, setSearchText] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState(searchText);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchText);
    }, 300);

    return () => clearTimeout(handler);
  }, [searchText]);

  useEffect(() => {
    (async () =>
      await dispatch(
        getWorkspacesForBoards({ page: 1, search: searchText, sortType: 1 })
      ))();
  }, [debouncedSearch]);

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
      className="board-form"
      requiredMark={false}
      initialValues={defaultWorkspace ? { workspace: defaultWorkspace } : {}}
    >
      <Form.Item
        label={
          <span className="input-label">
            Board Name <span className="require-mark">*</span>
          </span>
        }
        name="name"
        rules={[{ required: true, message: "Please enter board name" }]}
      >
        <Input placeholder="Enter board name" className="form-input" />
      </Form.Item>
      <Form.Item
        label={<span className="input-label">Description</span>}
        name="description"
      >
        <Input.TextArea
          placeholder="Enter board description"
          className="form-input description"
          rows={4}
          showCount
          maxLength={100}
        />
      </Form.Item>
      <Form.Item
        label={
          <span className="input-label">
            Workspace <span className="require-mark">*</span>
          </span>
        }
        name="workspace"
        rules={[{ required: true, message: "Please select workspace" }]}
      >
        <Select
          showSearch
          placeholder="Select workspace"
          filterOption={(input, option) =>
            (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
          }
          onSearch={(value) => setSearchText(value)}
          className="form-input"
          defaultValue={defaultWorkspace}
          disabled={!!defaultWorkspace}
          options={boardWorkspaces?.map((workspace) => {
            return { value: workspace._id, label: workspace.name };
          })}
        />
      </Form.Item>
      <Form.Item
        label={<span className="input-label">Members (Optional)</span>}
        name="members"
      >
        <Select
          showSearch
          mode="tags"
          tokenSeparators={[",", " "]}
          placeholder="Enter member emails"
          className="form-input"
        />
      </Form.Item>
      <Form.Item className="form-actions">
        <Space>
          <Button type="default" className="button" onClick={onCancel}>
            Cancel
          </Button>
          <Button
            type="primary"
            className="button"
            htmlType="submit"
            loading={loading}
          >
            {isEdit ? "Update" : "Create"}
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
};

export default AddBoardForm;
