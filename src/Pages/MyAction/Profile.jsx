import { useCallback, useContext, useEffect, useState } from "react";
import {
  Form,
  Input,
  Button,
  Alert,
  Spin,
  Tag,
  Card,
  Descriptions,
  Space,
  message,
} from "antd";
import { UserOutlined, MailOutlined, LogoutOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { MainContext } from "../../Context/MainContext";
import {
  getUser,
  logoutCurrentUser,
  updateOwnUserProfile,
} from "../../api/getUser";
import "../Admin/adminWorkspace.css";

const ProfilePage = () => {
  const { token, baseUrl, setUser: setContextUser, clearToken } = useContext(MainContext);
  const navigate = useNavigate();
  const [form] = Form.useForm();
  
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [error, setError] = useState("");
  const [userData, setUserData] = useState(null);

  const loadProfile = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getUser(baseUrl, token);
      setUserData(data);
      if (setContextUser) {
        setContextUser(data);
      }
      form.setFieldsValue({
        firstname: data?.firstname || "",
        lastname: data?.lastname || "",
        email: data?.email || "",
      });
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load profile data.");
    } finally {
      setLoading(false);
    }
  }, [baseUrl, form, setContextUser, token]);

  useEffect(() => {
    if (token) {
      loadProfile();
    }
  }, [loadProfile, token]);

  const onFinish = async (values) => {
    try {
      setUpdating(true);
      setError("");
      const updatedData = await updateOwnUserProfile(baseUrl, token, values);
      setUserData(updatedData);
      if (setContextUser) {
        setContextUser(updatedData);
      }
      message.success("Profile updated successfully.");
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to update profile.");
      message.error("Failed to update profile.");
    } finally {
      setUpdating(false);
    }
  };

  const handleLogout = async () => {
    try {
      setLoggingOut(true);
      setError("");
      const result = await logoutCurrentUser(token);
      message.success(result?.message || "Logout successful.");
    } catch (err) {
      message.warning(
        err?.response?.data?.message ||
          "Logged out locally, but the server session could not be cleared.",
      );
    } finally {
      if (setContextUser) {
        setContextUser({});
      }
      if (clearToken) {
        clearToken();
      }
      navigate("/", { replace: true });
      setLoggingOut(false);
    }
  };

  return (
    <div className="admin-workspace">
      <div className="admin-workspace__header">
        <div className="admin-workspace__copy">
          <div className="admin-workspace__eyebrow">Profile</div>
          <h1 className="admin-workspace__title">Admin Profile</h1>
          <div className="admin-workspace__subtitle">
            Manage your personal details and view your system access.
          </div>
        </div>
        <Space>
          <Button
            danger
            icon={<LogoutOutlined />}
            onClick={handleLogout}
            loading={loggingOut}
          >
            Logout
          </Button>
        </Space>
      </div>

      {error ? (
        <Alert style={{ marginBottom: 18 }} type="error" showIcon message={error} />
      ) : null}

      {loading ? (
        <div className="flex flex-center" style={{ minHeight: 320 }}>
          <Spin size="large" />
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <Card title="Personal Information" className="admin-panel admin-panel--soft" bordered={false}>
            <Form
              form={form}
              layout="vertical"
              onFinish={onFinish}
              autoComplete="off"
              style={{ maxWidth: 600 }}
            >
              <Form.Item
                label="First Name"
                name="firstname"
                rules={[{ required: true, message: "Please input your first name!" }]}
              >
                <Input prefix={<UserOutlined style={{ color: "rgba(0,0,0,.25)" }} />} placeholder="First Name" size="large" />
              </Form.Item>

              <Form.Item
                label="Last Name"
                name="lastname"
                rules={[{ required: true, message: "Please input your last name!" }]}
              >
                <Input prefix={<UserOutlined style={{ color: "rgba(0,0,0,.25)" }} />} placeholder="Last Name" size="large" />
              </Form.Item>

              <Form.Item
                label="Email Address"
                name="email"
                rules={[
                  { required: true, message: "Please input your email address!" },
                  { type: "email", message: "Please enter a valid email!" },
                ]}
              >
                <Input prefix={<MailOutlined style={{ color: "rgba(0,0,0,.25)" }} />} placeholder="Email Address" size="large" disabled />
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  size="large"
                  loading={updating}
                  disabled={loggingOut}
                >
                  Save Changes
                </Button>
              </Form.Item>
            </Form>
          </Card>

          <Card title="Access & Security" className="admin-panel admin-panel--soft" bordered={false}>
            <Descriptions column={1} bordered size="small">
              <Descriptions.Item label="Account Type">
                <Tag color="blue">{(userData?.role || userData?.userRole || "Admin").toUpperCase()}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Assigned Roles">
                {userData?.roles?.length ? (
                  userData.roles.map((role, idx) => (
                    <Tag key={idx} color="purple">{String(role).toUpperCase()}</Tag>
                  ))
                ) : (
                  <span style={{ color: "#9ca3af" }}>No additional roles</span>
                )}
              </Descriptions.Item>
              <Descriptions.Item label="Permissions">
                {userData?.permissions?.length ? (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                    {userData.permissions.map((perm, idx) => (
                      <Tag key={idx} color="geekblue">{perm}</Tag>
                    ))}
                  </div>
                ) : (
                  <span style={{ color: "#9ca3af" }}>No explicit permissions assigned</span>
                )}
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
