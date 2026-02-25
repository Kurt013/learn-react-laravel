import { useState } from "react";
import LoginForm from "./Login";
import RegisterForm from "./Register";
import { useEffect } from "react";
import { Loader, Center } from "@mantine/core";
import { useAuth } from "../../hooks/auth";
import { useNavigate } from "react-router-dom";

export default function AuthTabs() {
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const { user, userLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user]);

  const goToTab = (tab: "login" | "register") => {
    setActiveTab(tab);
  };

  if (userLoading)
    return (
      <Center h="100vh">
        <Loader />
      </Center>
    );

  return (
    <div>
      {activeTab === "login" && <LoginForm goToTab={goToTab} />}
      {activeTab === "register" && <RegisterForm goToTab={goToTab} />}
    </div>
  );
}
