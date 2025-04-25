import React from "react";
import { Link } from "react-router-dom";
import { Result, Button } from "antd";
import { PUBLIC_ROUTE } from "../../utils/enums/route";

const NotFound: React.FC = () => {
  return (
    <Result
      status="404"
      title="404"
      subTitle="Sorry, the page you visited does not exist."
      extra={
        <Link to={PUBLIC_ROUTE.HOME}>
          <Button type="primary">Back Home</Button>
        </Link>
      }
    />
  );
};

export default NotFound;
