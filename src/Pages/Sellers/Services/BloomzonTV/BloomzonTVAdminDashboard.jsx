import { Button, Space } from "antd";
import { useNavigate } from "react-router-dom";

import UnsupportedFeature from "../../../../Components/UnsupportedFeature/UnsupportedFeature";

const BloomzonTVAdminDashboard = () => {
  const navigate = useNavigate();

  return (
    <UnsupportedFeature
      title="Legacy Bloomzon TV dashboard retired"
      description="The old Bloomzon TV dashboard tabs were powered by mock vendor, show, product, moderation, and influencer data. Live TV administration now runs through the airing-session moderation and settings endpoints."
      note={
        <Space wrap>
          <Button
            type="primary"
            onClick={() => navigate("/dashboard/sellers/services/tv")}
          >
            Open TV moderation
          </Button>
          <Button
            onClick={() => navigate("/dashboard/sellers/services/tv/settings")}
          >
            Open TV settings
          </Button>
          <Button
            onClick={() => navigate("/dashboard/sellers/services/bloomzon-tv/analytics")}
          >
            View TV analytics
          </Button>
          <Button
            onClick={() => navigate("/dashboard/admin-system/content")}
          >
            Open content workspace
          </Button>
        </Space>
      }
    />
  );
};

export default BloomzonTVAdminDashboard;
