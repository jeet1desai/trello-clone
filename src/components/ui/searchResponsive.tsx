import { Popover, Button } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { useState } from "react";
import { useMedia } from "../../hooks/useMedia";

const ResponsiveSearch = ({
  children,
  breakPoint,
}: {
  children: React.ReactNode;
  breakPoint: number;
}) => {
  const [visible, setVisible] = useState(false);
  const isSmallScreen = useMedia({ max: breakPoint });
  return isSmallScreen ? (
    <Popover
      content={children}
      trigger="click"
      open={visible}
      onOpenChange={setVisible}
      placement="bottomRight"
    >
      <Button type="default" className="button" icon={<SearchOutlined />} />
    </Popover>
  ) : (
    <>{children}</>
  );
};

export default ResponsiveSearch;
