import { LoginForm } from "@/components/login-form";
import PublicNavbar from "@/components/ui/public-navbar";

export default function Page() {
  return (
    <>
    <PublicNavbar />
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <LoginForm />
      </div>
    </div></>
  );
}
