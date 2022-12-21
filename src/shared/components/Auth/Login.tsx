import { Button, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { Flex } from "@sweic/scomponents";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";
import { useState } from "react";
import { Lock, User } from "tabler-icons-react";
import { useAuthStore } from "../../state/store";
import { AuthFormContainer } from "./Styles";

function Login() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { user, loginUser } = useAuthStore((state) => state);
  const form = useForm({
    initialValues: {
      username: "",
      password: "",
    },
    validate: {
      username: (val) =>
        val.length > 5 ? null : "Username must have at least 6 characters.",
      password: (val) =>
        val.length > 7 ? null : "Password must have at least 8 characters",
    },
  });
  const handleSubmit = async () => {
    const currentUser = form.values.username;
    const res = await signIn("credentials", {
      username: form.values.username,
      password: form.values.password,
      redirect: false,
    });
    if (res!.ok) {
      window.location.href = "/admin";
      return;
    }
    setIsLoading(false);
    form.setFieldError("username", "Username or password is invalid");
  };
  return (
    <AuthFormContainer>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Flex gap={16} direction="column" style={{ width: "280px" }}>
          <TextInput
            icon={<User size={"16"} />}
            placeholder="Username"
            label="Username"
            {...form.getInputProps("username")}
          />
          <TextInput
            placeholder="Password"
            label="Password"
            icon={<Lock size={"16"} />}
            type="password"
            {...form.getInputProps("password")}
          />
          <Button
            type="submit"
            loading={isLoading}
            onClick={async () => {
              setIsLoading(true);
              await handleSubmit();
            }}
            style={{ marginTop: ".5em" }}
          >
            Login
          </Button>
        </Flex>
      </form>
    </AuthFormContainer>
  );
}

export default Login;
