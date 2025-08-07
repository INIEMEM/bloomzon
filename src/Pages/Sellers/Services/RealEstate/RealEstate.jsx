import React from "react";
import { Tabs, Card, Statistic, Row, Col } from "antd";
import {
  HomeOutlined,
  UserSwitchOutlined,
  FileProtectOutlined,
  MessageOutlined,
  SolutionOutlined,
} from "@ant-design/icons";
import SellerManagement from "./SellerManagement";
import ListingsManagement from "./ListingsManagement";
import VerificationRequests from "./VerificationRequests";
import BuyerInquiries from "./BuyerInquiries";
import LegalServices from "./LegalServices";

const { TabPane } = Tabs;

const AdminRealEstateDashboard = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Bloomzon Real Estate Admin Panel</h1>

      {/* KPI Summary Cards */}
      <Row gutter={[16, 16]} className="mb-8">
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Total Listings"
              value={128}
              prefix={<HomeOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Verified Agents"
              value={42}
              prefix={<UserSwitchOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Verifications Pending"
              value={9}
              prefix={<FileProtectOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Legal Service Requests"
              value={6}
              prefix={<SolutionOutlined />}
            />
          </Card>
        </Col>
      </Row>

      {/* Tabs */}
      <Card className="col-span-1 lg:col-span-3 mt-4" title="Management Control">

      <Tabs defaultActiveKey="1" >
        <TabPane tab="Sellers & Agents" key="1">
          <SellerManagement />
        </TabPane>
        <TabPane tab="Listings" key="2">
          <ListingsManagement />
        </TabPane>
        <TabPane tab="Verification Requests" key="3">
          <VerificationRequests />
        </TabPane>
        <TabPane tab="Buyer Inquiries" key="4">
          <BuyerInquiries />
        </TabPane>
        <TabPane tab="Legal Services" key="5">
          <LegalServices />
        </TabPane>
      </Tabs>
      </Card>
    </div>
  );
};

export default AdminRealEstateDashboard;
