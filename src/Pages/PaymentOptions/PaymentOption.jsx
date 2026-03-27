import UnsupportedFeature from "../../Components/UnsupportedFeature/UnsupportedFeature";

const PaymentOptionsPage = () => (
  <UnsupportedFeature
    title="Payment options are not integrated"
    description="The current backend does not expose the legacy payment-option admin endpoints this screen depended on."
    note="The obsolete dashboard calls were removed. Re-enable this page only after the server grows a matching admin payment-options module."
  />
);

export default PaymentOptionsPage;
