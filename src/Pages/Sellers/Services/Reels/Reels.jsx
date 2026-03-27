import UnsupportedFeature from "../../../../Components/UnsupportedFeature/UnsupportedFeature";

const AdminReelsDashboard = () => (
  <UnsupportedFeature
    title="Reels analytics are not integrated"
    description="The current backend exposes generic reels CRUD, but not the legacy seller-admin analytics endpoints this dashboard view expected."
  />
);

export default AdminReelsDashboard;
