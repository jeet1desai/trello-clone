import React from "react";
import { Modal, Typography } from "antd";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { Logs } from "lucide-react";

const { Text } = Typography;

interface IProps {
  open: boolean;
  onClose: () => void;
}

const UserActivityModal = ({ open, onClose }: IProps) => {
  const { userActivity } = useSelector((state: RootState) => state.user);
  return (
    <Modal
      title={null}
      open={open}
      onCancel={() => {
        onClose();
      }}
      footer={null}
      className="task-modal"
      styles={{
        body: {
          display: "flex",
          alignItems: "center",
        },
      }}
    >
      <Logs size={20} />
      <Text strong style={{ fontSize: "16px", marginLeft: 8 }}>
        {(userActivity?.user?.first_name ?? "") +
          " " +
          (userActivity?.user?.last_name ?? "")}{" "}
        ({userActivity?.user?.email})
      </Text>
    </Modal>
  );
};

export default UserActivityModal;
