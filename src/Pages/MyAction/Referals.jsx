import { Button, Space } from "antd";
import { useNavigate } from "react-router-dom";

import UnsupportedFeature from "../../Components/UnsupportedFeature/UnsupportedFeature";

const Referals = () => {
  const navigate = useNavigate();

  return (
    <UnsupportedFeature
      title="Legacy referrals screen retired"
      description="Referral payout and coupon workflows now run through the admin marketing workspace. The old referral-history and referral-code endpoints used by this page are not available on the current backend."
      note={
        <Space wrap>
          <Button
            type="primary"
            onClick={() => navigate("/dashboard/admin-system/marketing")}
          >
            Open marketing workspace
          </Button>
          <Button
            onClick={() => navigate("/dashboard/admin-system/marketing")}
          >
            Manage referrals and coupons
          </Button>
        </Space>
      }
    />
  );
};

export default Referals;
