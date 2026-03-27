import UnsupportedFeature from "../../Components/UnsupportedFeature/UnsupportedFeature";

const ProfilePage = () => (
  <UnsupportedFeature
    title="Profile settings are partially unsupported"
    description="The backend exposes /api/user/profile for identity data, but the old PIN-management endpoints used by this screen do not exist."
    note="The obsolete profile-settings calls were removed instead of leaving the page pointed at dead routes."
  />
);

export default ProfilePage;
