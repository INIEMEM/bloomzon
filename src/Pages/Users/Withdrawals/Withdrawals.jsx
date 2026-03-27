import UnsupportedFeature from "../../../Components/UnsupportedFeature/UnsupportedFeature";

const WithdrawalsPage = () => (
  <UnsupportedFeature
    title="Withdrawals are not integrated"
    description="The backend does not expose the legacy withdrawal-transaction endpoints used by this screen."
  />
);

export default WithdrawalsPage;
