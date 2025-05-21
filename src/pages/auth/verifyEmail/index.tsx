import React, { useEffect } from "react";
import { Typography } from "antd";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import "../../../layout/styles/Auth.css";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../store";
import { verifyUser } from "../../../store/slices/userSlice";
import { PUBLIC_ROUTE } from "../../../utils/enums/route";
import { verifyEmailIcon } from "../../../assets";

const { Title, Text } = Typography;

const VerifyEmail: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch<AppDispatch>();
  const { verificationSuccess } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    const token = searchParams.get("token");
    if (token) (async () => await dispatch(verifyUser(token)))();
  }, [dispatch, searchParams]);

  useEffect(() => {
    // Redirect if authenticated
    if (verificationSuccess) {
      navigate(PUBLIC_ROUTE.LOGIN);
    }
  }, [verificationSuccess, navigate]);

  return (
    <div className="auth-container">
      <div className="auth-form-container flex">
        <img
          src={verifyEmailIcon}
          alt="Verify Email"
          style={{ width: "65%", marginTop: "-35px" }}
        />
        <Title level={2} className="auth-title">
          Please verify your email
        </Title>
        <Text type="secondary" className="auth-subtitle">
          You're almost there! We sent an email to your registered email.
        </Text>

        <Text type="secondary">
          Verify your email to complete your signup. If you don't see it, you
          may need to check{" "}
          <span style={{ fontWeight: 700 }}>your spam folder</span>.
        </Text>
        <br />
        <Text
          type="secondary"
          style={{ display: "block", marginTop: "20px", textAlign: "center" }}
        >
          Once verified,{" "}
          <Link to="/login" className="auth-link">
            Try Login
          </Link>
          .
        </Text>
      </div>
    </div>
  );
};

export default VerifyEmail;
