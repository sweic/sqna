import { Anchor, Text } from "@mantine/core";
import { Flex } from "@sweic/scomponents";
import { useRouter } from "next/router";
import { useState } from "react";
import Login from "../shared/components/Auth/Login";
import Register from "../shared/components/Auth/Register";
import Layout from "../shared/components/Layout/Layout";
import Loading from "../shared/components/Loading/Loading";
import { useAuthStore } from "../shared/state/store";

function Auth() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  if (user) {
    router.push("/admin");
    return <Loading />;
  }
  return (
    <Layout title={mode === "login" ? "sQnA - Login" : "sQnA - Register"}>
      <Flex
        direction="column"
        style={{ height: "100%" }}
        justify="center"
        align="center"
        gap={16}
      >
        {mode === "login" ? <Login /> : <Register />}
        <div>
          {mode === "login" ? (
            <Text>
              No account? Register{" "}
              <Anchor onClick={() => setMode("register")}>here</Anchor>
            </Text>
          ) : (
            <Text>
              Have an account?{" "}
              <Anchor onClick={() => setMode("login")}>Login now!</Anchor>
            </Text>
          )}
        </div>
      </Flex>
    </Layout>
  );
}

export default Auth;
