import { Alert, Card, Typography } from "antd";

const UnsupportedFeature = ({
  title = "Feature unavailable",
  description = "This screen still depends on backend functionality that does not exist in the current server.",
  note,
}) => {
  return (
    <Card style={{ margin: 20 }}>
      <Typography.Title level={3}>{title}</Typography.Title>
      <Alert
        type="warning"
        showIcon
        message={description}
        description={note}
      />
    </Card>
  );
};

export default UnsupportedFeature;
