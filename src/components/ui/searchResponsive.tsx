import { Popover, Button } from "antd";
import { useState } from "react";
import { useMedia } from "../../hooks/useMedia";
import { Search } from "lucide-react";

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
      <Button type="default" className="button" icon={<Search size={16} />} />
    </Popover>
  ) : (
    <>{children}</>
  );
};

export default ResponsiveSearch;
