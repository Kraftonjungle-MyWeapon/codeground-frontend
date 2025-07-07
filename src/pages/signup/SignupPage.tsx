import SignupForm from "@/pages/signup/components/SignupForm";

const SignupPage = () => (
  <div className="min-h-screen cyber-grid flex items-center justify-center">
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto">
        <SignupForm />
      </div>
    </div>
  </div>
);

export default SignupPage;