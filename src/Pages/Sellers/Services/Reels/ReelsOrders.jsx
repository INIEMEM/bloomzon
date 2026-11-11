import { Button, Space } from "antd";
import { useLocation, useNavigate } from "react-router-dom";

import UnsupportedFeature from "../../../../Components/UnsupportedFeature/UnsupportedFeature";

const ReelsOrdersPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isTvRoute = location.pathname.includes("/services/tv/");

  const title = isTvRoute
    ? "Legacy TV orders screen retired"
    : "Legacy reels orders screen retired";
  const description = isTvRoute
    ? "This screen previously showed mock order and delivery data for Bloomzon TV. The current backend does not expose a dedicated TV-order admin endpoint for this route."
    : "This screen previously showed mock reel-linked order and delivery data. The current backend does not expose a dedicated Reels-order admin endpoint for this route.";

  return (
    <UnsupportedFeature
      title={title}
      description={description}
      note={
        <Space wrap>
          <Button
            type="primary"
            onClick={() =>
              navigate(
                isTvRoute
                  ? "/dashboard/sellers/services/tv"
                  : "/dashboard/admin-system/marketing",
              )
            }
          >
            {isTvRoute ? "Open TV moderation" : "Open marketing workspace"}
          </Button>
          <Button onClick={() => navigate("/dashboard/orders/products")}>
            View real product orders
          </Button>
          <Button
            onClick={() =>
              navigate(
                isTvRoute
                  ? "/dashboard/sellers/services/tv/analytics"
                  : "/dashboard/sellers/services/reels/analytics",
              )
            }
          >
            View analytics
          </Button>
        </Space>
      }
    />
  );
};

export default ReelsOrdersPage;
