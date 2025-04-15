import React from "react";
import { Button, Form, FormInstance, Input, Select, Space } from "antd";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";

interface IProps {
  form: FormInstance<any>;
  isEdit: any;
  defaultWorkspace?: string;
  onCancel: () => void;
  onFinish: any;
}

const AddBoardForm = ({
  form,
  isEdit,
  defaultWorkspace,
  onCancel,
  onFinish,
}: IProps) => {
  const { workspaces } = useSelector((state: RootState) => state.workspace);

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
            Board Name <span style={{ color: "red" }}>*</span>
          </span>
        }
        name="name"
        rules={[{ required: true, message: "Please enter board name" }]}
      >
        <Input placeholder="Enter board name" className="form-input" />
      </Form.Item>
      <Form.Item
        label={
          <span className="input-label">
            Description <span style={{ color: "red" }}>*</span>
          </span>
        }
        name="description"
        rules={[{ required: true, message: "Please enter board description" }]}
      >
        <Input.TextArea
          placeholder="Enter board description"
          className="form-input"
          rows={4}
          showCount
          maxLength={100}
          style={{ height: 100, resize: "none" }}
        />
      </Form.Item>
      <Form.Item
        label={
          <span className="input-label">
            Workspace <span style={{ color: "red" }}>*</span>
          </span>
        }
        name="workspace"
        rules={[{ required: true, message: "Please select workspace" }]}
      >
        <Select
          showSearch
          placeholder="Select workspace"
          filterOption={(input, option) =>
            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
          }
          className="form-input"
          defaultValue={defaultWorkspace}
          disabled={!!defaultWorkspace}
          options={workspaces.map((workspace) => {
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
          <Button type="primary" className="button" htmlType="submit">
            {isEdit ? "Update" : "Create"}
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
};

export default AddBoardForm;
