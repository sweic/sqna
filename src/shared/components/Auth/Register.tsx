import { Button, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { Flex } from "@sweic/scomponents";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";
import { At, Lock, User } from "tabler-icons-react";
import { trpc } from "../../../shared/utils/trpc";
import { useAuthStore } from "../../state/store";
import { AuthFormContainer } from "./Styles";

function Register() {
  const router = useRouter();
  const { loginUser } = useAuthStore((state) => state);
  const { mutate: registerUser, isLoading } =
    trpc.proxy.auth.register.useMutation({
      onError: (err) => {
        if (err.message === "username") {
          form.setFieldError("username", "Username is taken!");
        } else if (err.message === "email") {
          form.setFieldError("email", "Email is taken!");
        }
      },
      onSuccess: async ({ username }) => {
        const res = await signIn("credentials", {
          username: form.values.username,
          password: form.values.password,
          redirect: false,
        });
        if (res?.ok) {
          window.location.href = "/admin";
        }
        return;
      },
    });
  const form = useForm({
    initialValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validate: {
      username: (val) =>
        val.length > 5 ? null : "Username must have at least 6 characters.",
      email: (val) =>
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(val)
          ? null
          : "Invalid email",
      password: (val) =>
        val.length > 7 ? null : "Password must have at least 8 characters",
      confirmPassword: (val, formVal) =>
        val === formVal.password ? null : "Passwords do not match",
    },
  });

  const handleSubmit = async () => {
    registerUser({
      username: form.values.username,
      password: form.values.password,
      email: form.values.email,
    });
  };

  return (
    <AuthFormContainer>
      <Flex justify="center" align="center" style={{}}>
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Flex
            gap={16}
            direction="column"
            style={{ width: "320px" }}
            justify="center"
          >
            <TextInput
              icon={<User size={"16"} />}
              placeholder="Username"
              label="Username"
              {...form.getInputProps("username")}
            />
            <TextInput
              placeholder="Email Address"
              label="Email"
              icon={<At size={"16"} />}
              {...form.getInputProps("email")}
            />
            <TextInput
              placeholder="Password"
              label="Password"
              icon={<Lock size={"16"} />}
              type="password"
              {...form.getInputProps("password")}
            />
            <TextInput
              placeholder="Confirm Password"
              label="Confirm Password"
              icon={<Lock size={"16"} />}
              type="password"
              {...form.getInputProps("confirmPassword")}
            />
            <Button
              type="submit"
              loading={isLoading}
              style={{ marginTop: ".5em", marginBottom: ".5em" }}
            >
              Register
            </Button>
          </Flex>
        </form>
      </Flex>
    </AuthFormContainer>
  );
}

export default Register;
