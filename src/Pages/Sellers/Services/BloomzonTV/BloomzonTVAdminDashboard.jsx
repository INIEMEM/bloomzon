import React from "react";
import { Tabs } from "antd";
import VendorApplications from "./VendorApplications";
import ShowManagement from "./ShowManagement";
import ProductsOnTV from "./ProductsOnTV";
import ViewerEngagement from "./ViewerEngagement";
import OrdersManagement from "./OrdersManagement";
import ReportsAnalytics from "./ReportsAnalytics";
import ContentModeration from "./ContentModeration";
import InfluencerManagement from "./InfluencerManagement";

const { TabPane } = Tabs;

const BloomzonTVAdminDashboard = () => {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold mb-4">Bloomzon TV Admin</h1>
      <Tabs defaultActiveKey="1" tabPosition="top" size="large">
        <TabPane tab="Vendor Applications" key="1">
          <VendorApplications />
        </TabPane>
        <TabPane tab="Show Management" key="2">
          <ShowManagement />
        </TabPane>
        <TabPane tab="Products on TV" key="3">
          <ProductsOnTV />
        </TabPane>
        <TabPane tab="Viewer Engagement" key="4">
          <ViewerEngagement />
        </TabPane>
        <TabPane tab="Orders" key="5">
          <OrdersManagement />
        </TabPane>
        <TabPane tab="Reports & Analytics" key="6">
          <ReportsAnalytics />
        </TabPane>
        <TabPane tab="Content Moderation" key="7">
          <ContentModeration />
        </TabPane>
        <TabPane tab="Influencers" key="8">
          <InfluencerManagement />
        </TabPane>
      </Tabs>
    </div>
  );
};

export default BloomzonTVAdminDashboard;