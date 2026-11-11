/* eslint-disable react/prop-types */
import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Button,
  Form,
  Input,
  InputNumber,
  Modal,
  Select,
  Space,
  Tag,
  Upload,
  message,
} from "antd";
import { PlusOutlined, UploadOutlined } from "@ant-design/icons";

const { TextArea } = Input;

const parseCapabilities = (value) =>
  String(value || "")
    .split(",")
    .map((entry) => Number(entry.trim()))
    .filter((entry) => Number.isInteger(entry) && entry > 0);

const mapSpecificationsToText = (specifications = []) =>
  Array.isArray(specifications)
    ? specifications
        .map((item) => `${item?.name || ""}:${item?.value ?? ""}`.trim())
        .filter(Boolean)
        .join("\n")
    : "";

export const StoreCreateModal = ({
  open,
  submitting,
  cities,
  sellers,
  subdomains,
  onCancel,
  onSubmit,
  onUploadAsset,
}) => {
  const [form] = Form.useForm();
  const [uploadingField, setUploadingField] = useState("");

  useEffect(() => {
    if (!open) {
      return;
    }

    form.resetFields();
    form.setFieldsValue({
      status: 1,
      is_verified: 0,
      slogan: "",
      net_worth: 0,
      staff_count: 0,
      floor_space: 1,
      capabilities: "",
    });
  }, [form, open]);

  const handleAssetUpload = async (field, file) => {
    try {
      setUploadingField(field);
      const url = await onUploadAsset(file);
      if (!url) {
        throw new Error("Upload did not return a URL.");
      }
      form.setFieldValue(field, url);
      message.success(`${field} uploaded successfully.`);
    } catch (error) {
      message.error(error?.message || `Failed to upload ${field}.`);
    } finally {
      setUploadingField("");
    }

    return false;
  };

  const handleFinish = async () => {
    const values = await form.validateFields();
    await onSubmit({
      vendor_id: values.vendor_id,
      subdomain_id: values.subdomain_id,
      name: values.name.trim(),
      slogan: values.slogan?.trim() || "",
      city_id: values.city_id,
      address: values.address.trim(),
      status: values.status,
      is_verified: values.is_verified,
      metadata: {
        banner: values.banner,
        picture: values.picture,
        ...(values.logo ? { logo: values.logo } : {}),
        net_worth: Number(values.net_worth || 0),
        staff_count: Number(values.staff_count || 0),
        floor_space: Number(values.floor_space || 0),
        ...(parseCapabilities(values.capabilities).length
          ? { capabilities: parseCapabilities(values.capabilities) }
          : {}),
      },
    });
  };

  const sellerOptions = useMemo(
    () =>
      sellers.map((seller) => ({
        label: `${seller.name || seller.email} (${seller.email})`,
        value: seller.vendor.id,
      })),
    [sellers],
  );

  return (
    <Modal
      title="Create Store"
      open={open}
      width={880}
      onCancel={onCancel}
      onOk={handleFinish}
      okText="Create store"
      okButtonProps={{ loading: submitting }}
      destroyOnHidden
    >
      <Alert
        type="info"
        showIcon
        style={{ marginBottom: 16 }}
        message="Backend requirement"
        description="Store creation requires banner, picture, city, subdomain, vendor, address, and basic metadata fields."
      />
      <Form form={form} layout="vertical">
        <div style={{ display: "grid", gap: 16, gridTemplateColumns: "repeat(2, minmax(0, 1fr))" }}>
          <Form.Item
            name="vendor_id"
            label="Seller"
            rules={[{ required: true, message: "Select a seller/vendor." }]}
          >
            <Select
              showSearch
              optionFilterProp="label"
              placeholder="Select seller"
              options={sellerOptions}
            />
          </Form.Item>
          <Form.Item
            name="subdomain_id"
            label="Service"
            rules={[{ required: true, message: "Select a service." }]}
          >
            <Select
              showSearch
              optionFilterProp="label"
              placeholder="Select service"
              options={subdomains.map((item) => ({
                label: item.label || item.name,
                value: Number(item.id),
              }))}
            />
          </Form.Item>
          <Form.Item
            name="name"
            label="Store Name"
            rules={[{ required: true, message: "Enter a store name." }]}
          >
            <Input placeholder="Store name" />
          </Form.Item>
          <Form.Item
            name="city_id"
            label="City"
            rules={[{ required: true, message: "Select a city." }]}
          >
            <Select
              showSearch
              optionFilterProp="label"
              placeholder="Select city"
              options={cities.map((item) => ({
                label: item.name,
                value: Number(item.id),
              }))}
            />
          </Form.Item>
          <Form.Item name="slogan" label="Slogan">
            <Input placeholder="Store slogan" />
          </Form.Item>
          <Form.Item
            name="address"
            label="Address"
            rules={[{ required: true, message: "Enter a valid address." }]}
          >
            <Input placeholder="Store address" />
          </Form.Item>
          <Form.Item
            name="status"
            label="Status"
            rules={[{ required: true, message: "Choose a status." }]}
          >
            <Select
              options={[
                { label: "Active", value: 1 },
                { label: "Inactive", value: 0 },
              ]}
            />
          </Form.Item>
          <Form.Item
            name="is_verified"
            label="Verification"
            rules={[{ required: true, message: "Choose verification state." }]}
          >
            <Select
              options={[
                { label: "Verified", value: 1 },
                { label: "Unverified", value: 0 },
              ]}
            />
          </Form.Item>
          <Form.Item
            name="net_worth"
            label="Net Worth"
            rules={[{ required: true, message: "Enter store net worth." }]}
          >
            <InputNumber min={0} style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            name="staff_count"
            label="Staff Count"
            rules={[{ required: true, message: "Enter staff count." }]}
          >
            <InputNumber min={0} style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            name="floor_space"
            label="Floor Space"
            rules={[{ required: true, message: "Enter floor space." }]}
          >
            <InputNumber min={1} style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            name="capabilities"
            label="Capability IDs"
            extra="Optional comma-separated IDs. Capability listing is not exposed by the backend yet."
          >
            <Input placeholder="e.g. 1,2,5" />
          </Form.Item>
        </div>

        <div style={{ display: "grid", gap: 16, gridTemplateColumns: "repeat(3, minmax(0, 1fr))" }}>
          {["banner", "picture", "logo"].map((field) => (
            <div key={field}>
              <Form.Item
                name={field}
                label={field.charAt(0).toUpperCase() + field.slice(1)}
                rules={
                  field === "logo"
                    ? []
                    : [{ required: true, message: `Upload or paste a ${field} image URL.` }]
                }
              >
                <Input placeholder={`${field} image URL`} />
              </Form.Item>
              <Upload
                showUploadList={false}
                beforeUpload={(file) => handleAssetUpload(field, file)}
              >
                <Button
                  icon={<UploadOutlined />}
                  loading={uploadingField === field}
                  block
                >
                  Upload {field}
                </Button>
              </Upload>
            </div>
          ))}
        </div>
      </Form>
    </Modal>
  );
};

export const ProductEditorModal = ({
  open,
  mode = "create",
  submitting,
  currencies,
  subcategories,
  collections,
  initialValues,
  onCancel,
  onSubmit,
  onUploadImage,
}) => {
  const [form] = Form.useForm();
  const [imageUrls, setImageUrls] = useState([]);
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    if (!open) {
      return;
    }

    const nextValues = initialValues || {};
    setImageUrls(nextValues.imageUrls || []);
    form.setFieldsValue({
      store_id: nextValues.store_id,
      name: nextValues.name || "",
      description: nextValues.description || "",
      base_price: nextValues.base_price ?? nextValues.basePrice ?? 0,
      currency_id: nextValues.currency_id ?? nextValues.currencyId ?? 238,
      subcategory_id: nextValues.subcategory_id ?? nextValues.subcategoryId,
      collection_id: nextValues.collection_id ?? nextValues.collectionId,
      weight: nextValues.weight ?? 0.1,
      specifications_text:
        nextValues.specifications_text ||
        mapSpecificationsToText(nextValues.specifications || []),
    });
  }, [form, initialValues, open]);

  const handleImageUpload = async (file) => {
    try {
      setUploadingImage(true);
      const url = await onUploadImage(file);
      if (!url) {
        throw new Error("Upload did not return a URL.");
      }
      setImageUrls((current) => [...current, url]);
      message.success("Product image uploaded.");
    } catch (error) {
      message.error(error?.message || "Failed to upload product image.");
    } finally {
      setUploadingImage(false);
    }

    return false;
  };

  const handleFinish = async () => {
    const values = await form.validateFields();
    await onSubmit({ ...values, imageUrls });
  };

  return (
    <Modal
      title={mode === "edit" ? "Edit Product" : "Add Product To Store"}
      open={open}
      width={920}
      onCancel={onCancel}
      onOk={handleFinish}
      okText={mode === "edit" ? "Save changes" : "Create product"}
      okButtonProps={{ loading: submitting }}
      destroyOnHidden
    >
      <Alert
        type="info"
        showIcon
        style={{ marginBottom: 16 }}
        message={
          mode === "edit"
            ? "Backend scope"
            : "Upload workflow"
        }
        description={
          mode === "edit"
            ? "Current backend update support covers core product info, pricing, subcategory, collection, currency, and merged metadata. Media, options, and variants remain read-only."
            : "This flow creates a simple product with product-level media. Options and variants remain optional and are not surfaced in this admin form yet."
        }
      />
      <Form form={form} layout="vertical">
        <div style={{ display: "grid", gap: 16, gridTemplateColumns: "repeat(2, minmax(0, 1fr))" }}>
          {mode === "create" ? (
            <Form.Item
              name="store_id"
              label="Store ID"
              rules={[{ required: true, message: "Store ID is required." }]}
            >
              <InputNumber min={1} style={{ width: "100%" }} disabled />
            </Form.Item>
          ) : null}
          <Form.Item
            name="name"
            label="Product Name"
            rules={[{ required: true, message: "Enter a product name." }]}
          >
            <Input placeholder="Product name" />
          </Form.Item>
          <Form.Item
            name="base_price"
            label="Base Price"
            rules={[{ required: true, message: "Enter base price." }]}
          >
            <InputNumber min={0.01} step={0.01} style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            name="currency_id"
            label="Currency"
            rules={[{ required: true, message: "Select a currency." }]}
          >
            <Select
              showSearch
              optionFilterProp="label"
              placeholder="Select currency"
              options={currencies.map((item) => ({
                label: `${item.code || item.name || "Currency"}${item.symbol ? ` (${item.symbol})` : ""}`,
                value: Number(item.id),
              }))}
            />
          </Form.Item>
          <Form.Item
            name="subcategory_id"
            label="Subcategory"
            rules={[{ required: true, message: "Select a subcategory." }]}
          >
            <Select
              showSearch
              optionFilterProp="label"
              placeholder="Select subcategory"
              options={subcategories.map((item) => ({
                label: item.label || item.name,
                value: Number(item.id),
              }))}
            />
          </Form.Item>
          <Form.Item name="collection_id" label="Collection">
            <Select
              allowClear
              showSearch
              optionFilterProp="label"
              placeholder="Optional collection"
              options={collections.map((item) => ({
                label: item.label || item.name,
                value: Number(item.id),
              }))}
            />
          </Form.Item>
          <Form.Item
            name="weight"
            label="Weight"
            rules={[{ required: mode === "create", message: "Enter product weight." }]}
          >
            <InputNumber min={0} step={0.1} style={{ width: "100%" }} />
          </Form.Item>
        </div>
        <Form.Item
          name="description"
          label="Description"
          rules={[{ required: true, message: "Enter product description." }]}
        >
          <TextArea rows={5} placeholder="Product description" />
        </Form.Item>
        <Form.Item
          name="specifications_text"
          label="Specifications"
          extra="Optional. One per line using Name:Value format."
        >
          <TextArea rows={5} placeholder={"Color:Black\nMaterial:Cotton"} />
        </Form.Item>
        {mode === "create" ? (
          <>
            <Space wrap style={{ marginBottom: 12 }}>
              {imageUrls.map((url) => (
                <Tag
                  key={url}
                  closable
                  onClose={() =>
                    setImageUrls((current) => current.filter((item) => item !== url))
                  }
                >
                  {url.length > 48 ? `${url.slice(0, 45)}...` : url}
                </Tag>
              ))}
            </Space>
            <Upload
              multiple
              showUploadList={false}
              beforeUpload={handleImageUpload}
            >
              <Button icon={<PlusOutlined />} loading={uploadingImage}>
                Upload product image
              </Button>
            </Upload>
          </>
        ) : null}
      </Form>
    </Modal>
  );
};
