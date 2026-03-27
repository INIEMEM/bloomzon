import UnsupportedFeature from "../../Components/UnsupportedFeature/UnsupportedFeature";

const Notifications = () => (
  <UnsupportedFeature
    title="Notifications are not integrated"
    description="The current server exposes notification delivery utilities, not the old admin notification inbox API this page expected."
  />
);

export default Notifications;
