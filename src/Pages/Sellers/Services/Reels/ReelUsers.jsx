import { Button, Space } from "antd";
import { useNavigate } from "react-router-dom";

import UnsupportedFeature from "../../../../Components/UnsupportedFeature/UnsupportedFeature";

const ReelUserManagementPage = () => {
  const navigate = useNavigate();

  return (
    <UnsupportedFeature
      title="Reels moderation is not integrated"
      description="The obsolete reels admin summary endpoints were removed. The backend currently has no replacement admin user-management or creator-moderation surface for Reels."
      note={
        <Space wrap>
          <Button
            type="primary"
            onClick={() => navigate("/dashboard/admin-system/content")}
          >
            Open content workspace
          </Button>
          <Button
            onClick={() => navigate("/dashboard/sellers/services/reels/analytics")}
          >
            View reels analytics
          </Button>
          <Button
            onClick={() => navigate("/dashboard/admin-system/marketing")}
          >
            Review promotions
          </Button>
        </Space>
      }
    />
  );
};

export default ReelUserManagementPage;
