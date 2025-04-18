import { Input, Popover, Button } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { useState } from "react";
import { useMedia } from "../../../hooks/useMedia";

const ResponsiveSearch = () => {
  const [searchText, setSearchText] = useState("");
  const [visible, setVisible] = useState(false);
  const isSmallScreen = useMedia({ max: 520 });

  const content = (
    <Input
      autoFocus
      placeholder="Search"
      allowClear
      value={searchText}
      onChange={(e) => setSearchText(e.target.value)}
      className="form-input pop-search-width"
    />
  );

  return isSmallScreen ? (
    <Popover
      content={content}
      trigger="click"
      open={visible}
      onOpenChange={setVisible}
      placement="bottomRight"
    >
      <Button icon={<SearchOutlined />} />
    </Popover>
  ) : (
    <Input
      prefix={<SearchOutlined />}
      placeholder="Search"
      allowClear
      value={searchText}
      onChange={(e) => setSearchText(e.target.value)}
      className="form-input"
    />
  );
};

export default ResponsiveSearch;
