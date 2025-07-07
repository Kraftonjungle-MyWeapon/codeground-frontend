import ProfileSetupForm from "@/pages/setup-profile/components/ProfileSetupForm";

const ProfileSetupPage = () => (
  <div className="min-h-screen cyber-grid flex items-center justify-center">
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto">
        <ProfileSetupForm />
      </div>
    </div>
  </div>
);

export default ProfileSetupPage;