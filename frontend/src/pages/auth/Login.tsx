import { useForm, type SubmitHandler } from "react-hook-form";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Group,
  TextInput,
  PasswordInput,
  Card,
  Container,
  Center,
  Loader,
} from "@mantine/core";
import { useAuth, type LoginType } from "../../hooks/auth";
import api from "../../middleware/api";
import { useQuery } from "@tanstack/react-query";

export default function Login() {
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
    mt: "md",
  };

  if (userLoading)
    return (
      <Center>
        <Loader />
      </Center>
    );

  return (
    <Container {...loginContainerProps}>
      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <form>
          <TextInput
            withAsterisk
            label="Email"
            placeholder="your@email.com"
            {...register("email", { required: true })}
            error={errors.email?.message}
          />
          {errors.email && <span>This field is required</span>}
          <PasswordInput
            label="Password"
            placeholder="Input placeholder"
            {...register("password", { required: true })}
            error={errors.password?.message}
          />
          {/* errors will return when field validation fails  */}
          {errors.password && <span>This field is required</span>}
          <Group justify="flex-end" mt="md">
            <Button
              onClick={() => {
                handleSubmit(onSubmit)();
              }}
            >
              Submit
            </Button>
          </Group>
        </form>
      </Card>
    </Container>
  );
}
