import React, { useState, useEffect } from 'react';
import { Form, Button, Card } from 'antd';
import { Input } from '../../../../components';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../../../store';
import { createTask } from '../../../../store/slices/taskSlice';
import { Check, X } from 'lucide-react';

interface AddTaskFormProps {
  boardId: string;
  statusId: string;
  onCancel: () => void;
  onSuccess?: () => void;
}

const AddTaskForm: React.FC<AddTaskFormProps> = ({ boardId, statusId, onCancel, onSuccess }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch<AppDispatch>();

  // Focus on the input when the component mounts
  useEffect(() => {
    const inputElement = document.querySelector('.task-title-input input');
    if (inputElement) {
      setTimeout(() => {
        (inputElement as HTMLInputElement).focus();
      }, 100);
    }
  }, []);

  const handleSubmit = async (values: { title: string }) => {
    try {
      setLoading(true);
      await dispatch(
        createTask({
          title: values.title,
          board_id: boardId,
          status_list_id: statusId,
        })
      );
      form.resetFields();
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error creating task:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card
      size="small"
      style={{
        boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
        borderRadius: '4px',
      }}
    >
      <Form form={form} onFinish={handleSubmit} layout="vertical" requiredMark={false}>
        <Form.Item name="title" rules={[{ required: true, message: 'Please enter a title' }]} style={{ marginBottom: 8 }}>
          <Input
            className="form-input"
            placeholder="Enter task title..."
            autoFocus
            size="middle"
            autoComplete="off"
            style={{ borderRadius: '4px' }}
          />
        </Form.Item>
        <div style={{ display: 'flex', gap: 5, justifyContent: 'flex-end' }}>
          <Button type="text" size="small" className="add-btn dashed" icon={<X size={16} />} style={{ height: 32 }} onClick={onCancel}>
            Cancel
          </Button>
          <Button type="primary" htmlType="submit" className="button add-btn" icon={<Check size={16} />} loading={loading}>
            Add
          </Button>
        </div>
      </Form>
    </Card>
  );
};

export default AddTaskForm;
