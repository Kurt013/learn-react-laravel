import { useForm, type SubmitHandler } from "react-hook-form";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  TextInput,
  PasswordInput,
  Container,
  Center,
  Loader,
  Stack,
  Title,
  Text,
  Anchor,
} from "@mantine/core";
import { useAuth, type LoginType } from "../../hooks/auth";

interface LoginFormProps {
  goToTab: (tab: "login" | "register") => void;
}

export default function Login({ goToTab }: LoginFormProps) {
  const navigate = useNavigate();
  const { user, refetchUser, login, userLoading } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginType>({ defaultValues: { email: "", password: "" } });

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user]);

  const onSubmit: SubmitHandler<LoginType> = async (data) => {
    await login(data);
    await refetchUser();
  };

  const loginContainerProps = {
    size: "xs",
    py: { base: 80, md: 100 },
  };

  if (userLoading)
    return (
      <Center h="100vh">
        <Loader />
      </Center>
    );

  return (
    <Container {...loginContainerProps}>
      <Stack gap="lg" align="center" justify="center">
        <div style={{ textAlign: "center" }}>
          <Title order={1} size="h2" fw={700} mb="xs">
            Welcome Back
          </Title>
          <Text c="dimmed" size="sm">
            Sign in to your account to continue
          </Text>
        </div>

        <Stack gap="md" style={{ width: "100%", maxWidth: 400 }}>
          <form onSubmit={handleSubmit(onSubmit)} style={{ width: "100%" }}>
            <Stack gap="md">
              <TextInput
                label="Email"
                placeholder="your@email.com"
                type="email"
                {...register("email", { required: "Email is required" })}
                error={errors.email?.message}
                radius="md"
                size="md"
              />

              <PasswordInput
                label="Password"
                placeholder="Enter your password"
                {...register("password", {
                  required: "Password is required",
                })}
                error={errors.password?.message}
                radius="md"
                size="md"
              />

              <Button type="submit" fullWidth size="md" radius="md" mt="md">
                Sign In
              </Button>
              <Center>
                <Text c="dimmed" size="sm">
                  Don't have an account?{" "}
                  <Anchor
                    onClick={() => {
                      goToTab("register");
                    }}
                  >
                    Sign up
                  </Anchor>
                </Text>
              </Center>
            </Stack>
          </form>
        </Stack>
      </Stack>
    </Container>
  );
}
