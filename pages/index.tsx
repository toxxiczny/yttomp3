import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import type { NextPage } from "next";
import dynamic from "next/dynamic";
import { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useForm } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styled from "styled-components";
import Spinner from "react-bootstrap/Spinner";
import _ from "lodash";

export type Form = { yt: string; filename: string };

type Error = {
  response: {
    data: string;
  };
};

const Home: NextPage = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Form>();

  const [isLoading, setIsLoading] = useState(false);

  const debounceLoader = _.debounce(() => setIsLoading(true), 500);

  const cancelLoader = () => {
    setIsLoading(false);
    debounceLoader.cancel();
  };

  const download = async (data: Form) => {
    try {
      debounceLoader();
      const response = await axios.post("/api/yt", data);
      if (response) {
        cancelLoader();
        toast.success(response.data);
        reset();
      }
    } catch (error) {
      cancelLoader();
      toast.error((error as Error).response.data);
    }
  };

  return (
    <HomeContainer>
      <ToastContainer position="bottom-right" />
      <Header>yt to mp3 converter</Header>
      <Form>
        <Form.Control
          id="yt"
          placeholder="Link to video..."
          {...register("yt", { required: true })}
        />
        {errors.yt?.message && <Form.Text>{errors.yt?.message}</Form.Text>}
        <Form.Control
          id="filename"
          placeholder="Save as..."
          {...register("filename", { required: true })}
        />
        {errors.filename?.message && (
          <Form.Text>{errors.filename?.message}</Form.Text>
        )}
        <Button onClick={() => handleSubmit(download)()}>Download</Button>
        {isLoading && <Spinner animation="border" variant="light" />}
      </Form>
    </HomeContainer>
  );
};

const HomeContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  background: linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)),
    url("https://picsum.photos/1920/1080") center center no-repeat;
  background-size: cover;

  form {
    display: flex;
    justify-content: space-around;
    align-items: center;
    flex-direction: column;
    grid-gap: 30px;
    margin-bottom: 20px;

    input {
      width: 300px;
    }
  }
`;

const Header = styled.h1`
  letter-spacing: 2px;
  margin-bottom: 40px;
  color: white;
  font-weight: bold;
  text-shadow: 1px 1px 1px black;
`;

export default dynamic(() => Promise.resolve(Home), { ssr: false });
