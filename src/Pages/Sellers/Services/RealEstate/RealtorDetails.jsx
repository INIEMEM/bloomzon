import React from "react";
import { useParams } from "react-router-dom";
import {
  Card,
  Descriptions,
  Divider,
  Image,
  Tag,
  Button,
  Modal,
  Input,
  message,
} from "antd";

const { TextArea } = Input;

const RealestateAdminDetailView = () => {
  const { type, id } = useParams(); // type: 'seller', 'listing', 'buyer-inquiry'

  const handleSuspendUser = () => {
    Modal.confirm({
      title: "Suspend this user?",
      content: "This action will restrict their access to the platform.",
      onOk: () => message.success("User suspended successfully"),
    });
  };

  const handleRemoveListing = () => {
    Modal.confirm({
      title: "Remove this listing?",
      content: "This action will permanently remove the listing from the platform.",
      onOk: () => message.success("Listing removed successfully"),
    });
  };

  const handleTerminateDeal = () => {
    Modal.confirm({
      title: "Terminate Deal",
      content: (
        <TextArea rows={4} placeholder="Enter reason for termination..." />
      ),
      onOk: () => message.success("Deal terminated with note"),
    });
  };

  const dummyData = {
    seller: {
      name: "John Doe",
      email: "john@example.com",
      phone: "+2348012345678",
      address: "123 Real Estate St, Lagos",
      profileImage: "https://via.placeholder.com/150",
      propertiesSold: [
        {
          title: "4-Bedroom Duplex in Lekki",
          price: "₦120,000,000",
          buyer: "Jane Smith",
        },
      ],
    },
    listing: {
      type: "Sell",
      propertyType: "Home",
      tags: ["Flat", "Penthouse"],
      city: "Abuja",
      location: "Maitama",
      areaSize: "500 sqft",
      bedrooms: 4,
      bathrooms: 3,
      garage: 1,
      kitchen: 1,
      title: "C of O",
      builtYear: 2021,
      features: ["Parking", "Elevator", "Gym"],
      customFeatures: ["Solar Inverter"],
      price: "₦95,000,000",
      instalments: true,
      advance: "₦25,000,000",
      monthly: "₦2,000,000",
      monthsLeft: 35,
      images: [
        "https://via.placeholder.com/300",
        "https://via.placeholder.com/300",
      ],
      description: "A beautiful luxury home with full amenities.",
      contact: {
        phone: "+2348000000001",
        email: "agent@example.com",
      },
    },
    buyer: {
      name: "Buyer One",
      email: "buyer1@example.com",
      phone: "+2348099999999",
      property: "4-Bedroom Duplex in Lekki",
      bargainedAmount: "₦85,000,000",
    },
  };

  const renderSellerDetails = () => (
    <>
      <Card title="Seller Information">
        <Descriptions bordered column={1}>
          <Descriptions.Item label="Full Name">{dummyData.seller.name}</Descriptions.Item>
          <Descriptions.Item label="Email">{dummyData.seller.email}</Descriptions.Item>
          <Descriptions.Item label="Phone">{dummyData.seller.phone}</Descriptions.Item>
          <Descriptions.Item label="Address">{dummyData.seller.address}</Descriptions.Item>
        </Descriptions>
        <Divider />
        <Image width={150} src={dummyData.seller.profileImage} />
        <Divider />
        <Card title="Sales History">
          {dummyData.seller.propertiesSold.map((sale, index) => (
            <Descriptions key={index} column={1} bordered size="small">
              <Descriptions.Item label="Property">{sale.title}</Descriptions.Item>
              <Descriptions.Item label="Sold To">{sale.buyer}</Descriptions.Item>
              <Descriptions.Item label="Amount">{sale.price}</Descriptions.Item>
            </Descriptions>
          ))}
        </Card>
        <Divider />
        <Button danger onClick={handleSuspendUser}>Suspend User</Button>
      </Card>
    </>
  );

  const renderListingDetails = () => (
    <>
      <Card title="Listing Details">
        <Descriptions bordered column={1}>
          <Descriptions.Item label="Type">{dummyData.listing.type}</Descriptions.Item>
          <Descriptions.Item label="Property Type">{dummyData.listing.propertyType}</Descriptions.Item>
          <Descriptions.Item label="Tags">{dummyData.listing.tags.map((tag) => <Tag key={tag}>{tag}</Tag>)}</Descriptions.Item>
          <Descriptions.Item label="Location">{dummyData.listing.city}, {dummyData.listing.location}</Descriptions.Item>
          <Descriptions.Item label="Area Size">{dummyData.listing.areaSize}</Descriptions.Item>
          <Descriptions.Item label="Bedrooms">{dummyData.listing.bedrooms}</Descriptions.Item>
          <Descriptions.Item label="Bathrooms">{dummyData.listing.bathrooms}</Descriptions.Item>
          <Descriptions.Item label="Garage">{dummyData.listing.garage}</Descriptions.Item>
          <Descriptions.Item label="Kitchen">{dummyData.listing.kitchen}</Descriptions.Item>
          <Descriptions.Item label="Title">{dummyData.listing.title}</Descriptions.Item>
          <Descriptions.Item label="Built Year">{dummyData.listing.builtYear}</Descriptions.Item>
          <Descriptions.Item label="Features">{dummyData.listing.features.map((feat) => <Tag key={feat}>{feat}</Tag>)}</Descriptions.Item>
          <Descriptions.Item label="Custom Features">{dummyData.listing.customFeatures.join(", ")}</Descriptions.Item>
          <Descriptions.Item label="Total Price">{dummyData.listing.price}</Descriptions.Item>
          <Descriptions.Item label="Instalments Available">{dummyData.listing.instalments ? "Yes" : "No"}</Descriptions.Item>
          <Descriptions.Item label="Advance Amount">{dummyData.listing.advance}</Descriptions.Item>
          <Descriptions.Item label="Monthly Instalments">{dummyData.listing.monthly}</Descriptions.Item>
          <Descriptions.Item label="Remaining Instalments">{dummyData.listing.monthsLeft}</Descriptions.Item>
        </Descriptions>
        <Divider />
        <Card title="Property Images">
          {dummyData.listing.images.map((img, idx) => (
            <Image key={idx} width={200} src={img} style={{ marginRight: 8 }} />
          ))}
        </Card>
        <Divider />
        <p><strong>Description:</strong> {dummyData.listing.description}</p>
        <Divider />
        <Card title="Seller Contact">
          <Descriptions column={1} bordered>
            <Descriptions.Item label="Phone">{dummyData.listing.contact.phone}</Descriptions.Item>
            <Descriptions.Item label="Email">{dummyData.listing.contact.email}</Descriptions.Item>
          </Descriptions>
        </Card>
        <Divider />
        <Button danger onClick={handleRemoveListing}>Take Down Listing</Button>
      </Card>
    </>
  );

  const renderBuyerInquiryDetails = () => (
    <>
      <Card title="Buyer Inquiry Details">
        <Descriptions bordered column={1}>
          <Descriptions.Item label="Full Name">{dummyData.buyer.name}</Descriptions.Item>
          <Descriptions.Item label="Email">{dummyData.buyer.email}</Descriptions.Item>
          <Descriptions.Item label="Phone">{dummyData.buyer.phone}</Descriptions.Item>
          <Descriptions.Item label="Property Interested">{dummyData.buyer.property}</Descriptions.Item>
          <Descriptions.Item label="Bargained Amount">{dummyData.buyer.bargainedAmount}</Descriptions.Item>
        </Descriptions>
        <Divider />
        <Button danger onClick={handleTerminateDeal}>Terminate Deal</Button>
      </Card>
    </>
  );

  return (
    <div className="p-4">
      {type === "seller" && renderSellerDetails()}
      {type === "listing" && renderListingDetails()}
      {type === "buyer-inquiry" && renderBuyerInquiryDetails()}
    </div>
  );
};

export default RealestateAdminDetailView;
