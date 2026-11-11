import { Button, Space } from "antd";
import { useNavigate, useParams } from "react-router-dom";

import UnsupportedFeature from "../../../../Components/UnsupportedFeature/UnsupportedFeature";

const ReelUserDetailsPage = () => {
  const navigate = useNavigate();
  const { reels } = useParams();

  return (
    <UnsupportedFeature
      title="Legacy reels detail screen retired"
      description={`Reels creator moderation for ${reels || "this record"} is not backed by a current admin endpoint. The previous screen used mock engagement, takedown, and promotion data that did not reflect live backend state.`}
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
            Review campaign records
          </Button>
        </Space>
      }
    />
  );
};

export default ReelUserDetailsPage;
