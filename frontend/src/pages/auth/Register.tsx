import { useForm, type SubmitHandler } from "react-hook-form";
import {
  Button,
  TextInput,
  PasswordInput,
  Container,
  Center,
  Stack,
  Title,
  Text,
} from "@mantine/core";
import api from "../../middleware/api";

interface RegisterFormProps {
  goToTab: (tab: "login" | "register") => void;
}

type RegisterForm = {
  email: string;
  password: string;
  password_confirmation: string;
  name: string;
};

const Register = ({ goToTab }: RegisterFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<RegisterForm>({
    defaultValues: {
      email: "",
      password: "",
      password_confirmation: "",
      name: "",
    },
  });


  const password = watch("password");

  const onSubmit: SubmitHandler<RegisterForm> = async (data) => {
    try {
      await api.post("/api/register", data);
    } catch (error) {
      console.error(error);
    }
  };

  const registerContainerProps = {
    size: "xs",
    py: { base: 80, md: 100 },
  };

  return (
    <Container {...registerContainerProps}>
      <Stack gap="lg" align="center" justify="center">
        <div style={{ textAlign: "center" }}>
          <Title order={1} size="h2" fw={700} mb="xs">
            Create Account
          </Title>
          <Text c="dimmed" size="sm">
            Join us today to get started
          </Text>
        </div>

        <Stack gap="md" style={{ width: "100%", maxWidth: 400 }}>
          <form onSubmit={handleSubmit(onSubmit)} style={{ width: "100%" }}>
            <Stack gap="md">
              <TextInput
                label="Full Name"
                placeholder="John Doe"
                type="text"
                {...register("name", { required: "Name is required" })}
                error={errors.name?.message}
                radius="md"
                size="md"
              />

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
                placeholder="Create a strong password"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 8,
                    message: "Password must be at least 8 characters",
                  },
                })}
                error={errors.password?.message}
                radius="md"
                size="md"
              />

              <PasswordInput
                label="Confirm Password"
                placeholder="Confirm your password"
                {...register("password_confirmation", {
                  required: "Please confirm your password",
                  validate: (value) =>
                    value === password || "Passwords do not match",
                })}
                error={errors.password_confirmation?.message}
                radius="md"
                size="md"
              />

              <Button type="submit" fullWidth size="md" radius="md" mt="md">
                Sign Up
              </Button>
              <Center>
                <Text c="dimmed" size="sm">
                  Already have an account?{" "}
                  <Button
                    variant="subtle"
                    size="xs"
                    type="button"
                    onClick={() => {
                      goToTab("login");
                    }}
                  >
                    Sign In
                  </Button>
                </Text>
              </Center>
            </Stack>
          </form>
        </Stack>
      </Stack>
    </Container>
  );
};

export default Register;
