import { Flex } from "@sweic/scomponents";
import type { NextPage } from "next";
import Landing from "shared/components/Landing/Landing";
import Appbar from "../shared/components/Appbar/Appbar";
import Layout from "../shared/components/Layout/Layout";

const Home: NextPage = () => {
  return (
    <>
      <Layout title="sQnA">
        <Flex direction="column" style={{ width: "100%" }} align="center">
          <Appbar />
          <Landing />
        </Flex>
      </Layout>
    </>
  );
};

export default Home;
