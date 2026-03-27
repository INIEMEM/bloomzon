import UnsupportedFeature from "../../Components/UnsupportedFeature/UnsupportedFeature";

const PaymentOptionsDetails = () => (
  <UnsupportedFeature
    title="Payment option details are not integrated"
    description="This detail view depended on a deprecated payment-options service that does not exist in the current backend."
  />
);

export default PaymentOptionsDetails;
