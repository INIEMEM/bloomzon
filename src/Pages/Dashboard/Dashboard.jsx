import React, { useContext, useEffect, useMemo, useState } from "react";
import Axios from "axios";
import { Alert, Button, Empty, Spin } from "antd";
import { useNavigate } from "react-router-dom";
import { Bar } from "react-chartjs-2";
import "chart.js/auto";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import UserMatrxs from "../../Components/UserMatrixs/UserMatrxs";
import BigGraphs from "../../Components/BigGraphs/BigGraphs";
import { MainContext } from "../../Context/Context";
import { ADMIN_BASE_URL, getAuthHeaders } from "../../api/config";
import "./dashboard.css";
import {
  AutomobileRepairs,
  BloomzonHealthCare,
  BloomzonLive,
  BloomzonProductIcon,
  BloomzonReel,
  BloomzonTv,
  ElliteIcon,
  FoodRestaurant,
  GroceriesIcon,
  LogisticsIcon,
  ManufacturerIcon,
  RealEstate,
  TrueView,
  UsedItem,
} from "../../Icons/icon";

const defaultOverview = {
  summary: {
    users: { total: 0, new: 0, active: 0, banned: 0, suspended: 0 },
    sellers: { total: 0, new: 0, active: 0, banned: 0, suspended: 0 },
    buyers: { total: 0, new: 0, active: 0, banned: 0 },
    products: { total: 0, active: 0, inactive: 0 },
    orders: { total: 0, pending: 0, processing: 0, completed: 0 },
  },
  charts: {
    monthly: {
      labels: [],
      users: [],
      sellers: [],
      products: [],
      orders: [],
    },
  },
  productsBySubdomain: [],
};

const normalizeServiceKey = (value) =>
  String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

const serviceIcons = {
  retailer: <BloomzonProductIcon />,
  "bloomzon product": <BloomzonProductIcon />,
  "bloomzon products": <BloomzonProductIcon />,
  "groceries beverages": <GroceriesIcon />,
  "groceries beverages services": <GroceriesIcon />,
  groceries: <GroceriesIcon />,
  "foods restaurants": <FoodRestaurant />,
  food: <FoodRestaurant />,
  restaurant: <FoodRestaurant />,
  "bloomzon healthcare": <BloomzonHealthCare />,
  healthcare: <BloomzonHealthCare />,
  "used item": <UsedItem />,
  "used items": <UsedItem />,
  automobile: <AutomobileRepairs />,
  "automobile parts": <AutomobileRepairs />,
  "real estate": <RealEstate />,
  realestate: <RealEstate />,
  reels: <BloomzonReel />,
  "bloomzon reels": <BloomzonReel />,
  "bloomzon reel": <BloomzonReel />,
  tv: <BloomzonTv />,
  "bloomzon tv": <BloomzonTv />,
  live: <BloomzonLive />,
  "bloomzon live": <BloomzonLive />,
  manufacturer: <ManufacturerIcon />,
  manufacturers: <ManufacturerIcon />,
  trueview: <TrueView />,
  "logistics services": <LogisticsIcon />,
  logistics: <LogisticsIcon />,
  "bloomzon elite": <ElliteIcon />,
  elite: <ElliteIcon />,
};

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "bottom",
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        precision: 0,
      },
    },
  },
};

const sliderSettings = {
  dots: true,
  infinite: true,
  autoplay: true,
  autoplaySpeed: 5000,
  speed: 1000,
  slidesToShow: 1,
  slidesToScroll: 1,
  arrows: false,
  pauseOnHover: true,
};

const Dashboard = () => {
  const { token } = useContext(MainContext);
  const navigate = useNavigate();
  const [overview, setOverview] = useState(defaultOverview);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOverview = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await Axios.get(`${ADMIN_BASE_URL}/dashboard/overview`, {
          headers: getAuthHeaders(token),
        });

        setOverview(response?.data?.data || defaultOverview);
      } catch (fetchError) {
        setError(
          fetchError?.response?.data?.message ||
            "Failed to load the dashboard overview.",
        );
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchOverview();
    }
  }, [token]);

  const carouselItems = useMemo(
    () => [
      {
        title: "All Users",
        subtitle: "Live metrics for every authenticated account in the system.",
        stats: [
          { matrix: overview.summary.users.total, title: "All users" },
          { matrix: overview.summary.users.new, title: "New users" },
          { matrix: overview.summary.users.active, title: "Active users" },
          { matrix: overview.summary.users.banned, title: "Banned users" },
          {
            matrix: overview.summary.users.suspended,
            title: "Suspended users",
          },
        ],
        class: "dashboard-header-image1",
      },
      {
        title: "All Sellers",
        subtitle: "Vendor-backed seller accounts across Bloomzon services.",
        stats: [
          { matrix: overview.summary.sellers.total, title: "All sellers" },
          { matrix: overview.summary.sellers.new, title: "New sellers" },
          { matrix: overview.summary.sellers.active, title: "Active sellers" },
          { matrix: overview.summary.sellers.banned, title: "Banned sellers" },
          {
            matrix: overview.summary.sellers.suspended,
            title: "Suspended sellers",
          },
        ],
        class: "dashboard-header-image2",
      },
      {
        title: "All Buyers",
        subtitle: "Customer accounts that are not attached to a seller profile.",
        stats: [
          { matrix: overview.summary.buyers.total, title: "All buyers" },
          { matrix: overview.summary.buyers.new, title: "New buyers" },
          { matrix: overview.summary.buyers.active, title: "Active buyers" },
          { matrix: overview.summary.buyers.banned, title: "Banned buyers" },
          { matrix: overview.summary.orders.total, title: "Total orders" },
        ],
        class: "dashboard-header-image3",
      },
    ],
    [overview],
  );

  const userGrowthData = useMemo(
    () => ({
      labels: overview.charts.monthly.labels,
      datasets: [
        {
          label: "Users",
          data: overview.charts.monthly.users,
          backgroundColor: "#41CCC7",
          borderRadius: 6,
        },
        {
          label: "Sellers",
          data: overview.charts.monthly.sellers,
          backgroundColor: "#F67F00",
          borderRadius: 6,
        },
      ],
    }),
    [overview],
  );

  const commerceGrowthData = useMemo(
    () => ({
      labels: overview.charts.monthly.labels,
      datasets: [
        {
          label: "Products",
          data: overview.charts.monthly.products,
          backgroundColor: "#2F6FED",
          borderRadius: 6,
        },
        {
          label: "Orders",
          data: overview.charts.monthly.orders,
          backgroundColor: "#18A957",
          borderRadius: 6,
        },
      ],
    }),
    [overview],
  );

  const topServices = useMemo(
    () =>
      [...overview.productsBySubdomain]
        .sort((left, right) => right.totalProducts - left.totalProducts)
        .slice(0, 6),
    [overview],
  );

  const serviceBreakdownData = useMemo(
    () => ({
      labels: topServices.map((item) => item.label || item.name),
      datasets: [
        {
          label: "Products",
          data: topServices.map((item) => item.totalProducts),
          backgroundColor: [
            "#F67F00",
            "#41CCC7",
            "#2F6FED",
            "#18A957",
            "#A855F7",
            "#EF4444",
          ],
          borderRadius: 6,
        },
      ],
    }),
    [topServices],
  );

  const serviceCards = useMemo(
    () =>
      [...overview.productsBySubdomain]
        .sort((left, right) => right.totalProducts - left.totalProducts)
        .map((service) => {
          const key = normalizeServiceKey(service.label || service.name);
          return {
            ...service,
            icon: serviceIcons[key] || <BloomzonProductIcon />,
          };
        }),
    [overview],
  );

  return (
    <div style={{ padding: 20 }}>
      <div className="flex flex-justify-between flex-align">
        <h1 style={{ fontSize: "2rem", color: "#323232" }}>Dashboard</h1>
        <Button
          style={{
            background: "var(--primary-color)",
            color: "white",
            border: "none",
          }}
          onClick={() => navigate("/dashboard/others/admins")}
        >
          Admin Directory
        </Button>
      </div>

      {error ? (
        <Alert
          style={{ marginTop: 16 }}
          type="warning"
          showIcon
          message="Dashboard data could not be loaded"
          description={error}
        />
      ) : null}

      {loading ? (
        <div
          className="flex flex-center"
          style={{ minHeight: 300, width: "100%" }}
        >
          <Spin size="large" />
        </div>
      ) : (
        <>
          <Slider {...sliderSettings}>
            {carouselItems.map((item, index) => (
              <div key={index} className={`dashboard-header-image ${item.class}`}>
                <div className="flex" style={{ justifyContent: "end" }}>
                  <div className="dashboard-header-dimmer">
                    <p className="dashboard-header-dimmer-title ">{item.title}</p>
                    <p className="dashboard-header-dimmer-sub-title ">
                      {item.subtitle}
                    </p>
                    <div
                      className="flex"
                      style={{
                        gap: 20,
                        position: "absolute",
                        bottom: 20,
                        left: 20,
                        right: 20,
                        flexWrap: "wrap",
                      }}
                    >
                      {item.stats.map((stat, statIndex) => (
                        <UserMatrxs
                          key={statIndex}
                          matrix={stat.matrix}
                          title={stat.title}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </Slider>

          <div className="flex flex-justify-between" style={{ gap: 20, marginTop: 20 }}>
            <UserMatrxs
              matrix={overview.summary.sellers.total}
              title="All Sellers"
              icon={<LogisticsIcon />}
              border={true}
              link="/dashboard/sellers/all"
            />
            <UserMatrxs
              matrix={overview.summary.products.total}
              title="All Products"
              icon={<BloomzonProductIcon />}
              border={true}
              link="/dashboard/products"
            />
            <UserMatrxs
              matrix={overview.summary.orders.total}
              title="All Orders"
              icon={<BloomzonLive />}
              border={true}
            />
          </div>

          <div className="flex" style={{ gap: 20, marginTop: 20, flexWrap: "wrap" }}>
            <BigGraphs
              title="User Growth"
              content={
                <div style={{ height: 280 }}>
                  <Bar data={userGrowthData} options={chartOptions} />
                </div>
              }
              subTitle={`${overview.summary.users.new} new users and ${overview.summary.sellers.new} new sellers in the last 30 days`}
              links="/dashboard/user/all"
            />
            <BigGraphs
              title="Commerce Flow"
              content={
                <div style={{ height: 280 }}>
                  <Bar data={commerceGrowthData} options={chartOptions} />
                </div>
              }
              subTitle={`${overview.summary.products.active} active products and ${overview.summary.orders.pending} pending orders right now`}
              links="/dashboard/products"
            />
            <BigGraphs
              title="Top Product Services"
              content={
                <div style={{ height: 280 }}>
                  {topServices.length ? (
                    <Bar data={serviceBreakdownData} options={chartOptions} />
                  ) : (
                    <Empty description="No product data yet" />
                  )}
                </div>
              }
              subTitle="Products grouped by live subdomain counts"
              links="/dashboard/products"
            />
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: 20,
              marginTop: 20,
            }}
          >
            {serviceCards.map((service) => (
              <UserMatrxs
                key={service.id}
                matrix={service.totalProducts}
                title={service.label || service.name}
                icon={service.icon}
                border={true}
                link={`/dashboard/products?subdomainId=${service.id}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
