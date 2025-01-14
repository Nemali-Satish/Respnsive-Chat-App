import React, { useState } from "react";
import Background from "@/assets/login2.png";
import Victory from "@/assets/victory.svg";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { apiClient } from "@/lib/api-client";
import { LOGIN_ROUTE, SIGNUP_ROUTE } from "@/utils/constants";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "@/store";

const Auth = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const { setUserInfo } = useAppStore();

  const validateSignUp = () => {
    if (!email) {
      toast.error("Email is required");
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      toast.error("Invalid Email format");
      return false;
    }
    if (!password) {
      toast.error("Password is required");
      return false;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return false;
    }
    return true;
  };
  const validateLogin = () => {
    if (!email) {
      toast.error("Email is required");
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      toast.error("Invalid Email format");
      return false;
    }
    if (!password) {
      toast.error("Password is required");
      return false;
    }
    return true;
  };

  const handelLogin = async () => {
    try {
      if (validateLogin()) {
        const response = await apiClient.post(
          LOGIN_ROUTE,
          { email, password },
          { withCredentials: true }
        );
        if (response.data.user.id) {
          // console.log(response.data);
          setUserInfo(response.data.user);
          if (response.data.user.profileSetup) {
            navigate("/chat");
          }

          navigate("/profile");
          // console.log(response);
          toast.success("Lofin Successful");
        }
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };

  const handelSignUp = async () => {
    try {
      if (validateSignUp()) {
        const response = await apiClient.post(
          SIGNUP_ROUTE,
          { email, password },
          { withCredentials: true }
        );
        if (response.status === 201) {
          setUserInfo(response.data.user);

          navigate("/profile");
          toast.success("Sign Up Successful");
        }
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };

  return (
    <div className="h-[100vh] w-[100vw] flex items-center justify-center">
      <div className="h-[80vh]  bg-white border-white text-opacity-90 shadow-2xl w-[80vw] md:w-[90vw] lg:w-[70vw] xl:w-[60vw] rounded-3xl grid xl:grid-cols-2">
        <div className="flex flex-col items-center justify-center gap-10">
          <div className="flex flex-col items-center justify-center">
            <div className="flex items-center justify-center">
              <h1 className="text-5xl font-bold md:text-6xl">Welcome</h1>
              <img src={Victory} alt="victoryImg" className="h-[100px]" />
            </div>
            <p className="font-medium text-center">
              Fill in the details to get started with the Chat App
            </p>
          </div>
          <div className="flex items-center justify-center w-full">
            <Tabs className="w-3/4" defaultValue="login">
              <TabsList className="bg-transparent rounded-none w-full">
                <TabsTrigger
                  value="login"
                  className="data-[state=active]:bg-transparent text-black text-opacity-90 border-b-2 rounded-none w-full data-[state=active]:text-black data-[state=active]:font-semibold data-[state=active]:border-b-purple-500 p-3 transistion-all duration-300"
                >
                  Login
                </TabsTrigger>
                <TabsTrigger
                  value="signup"
                  className="data-[state=active]:bg-transparent text-black text-opacity-90 border-b-2 rounded-none w-full data-[state=active]:text-black data-[state=active]:font-semibold data-[state=active]:border-b-purple-500 p-3 transistion-all duration-300"
                >
                  Sign Up
                </TabsTrigger>
              </TabsList>
              <TabsContent value="login" className="flex flex-col gap-5 mt-10">
                <Input
                  placeholder="Email"
                  type="email"
                  className="rounded-full p-6"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Input
                  placeholder="Password"
                  type="password"
                  className="rounded-full p-6"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Button onClick={handelLogin} className="rounded-full p-6">
                  Login
                </Button>
              </TabsContent>
              <TabsContent value="signup" className="flex flex-col gap-5">
                <Input
                  placeholder="Email"
                  type="email"
                  className="rounded-full p-6"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Input
                  placeholder="Password"
                  type="password"
                  className="rounded-full p-6"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Input
                  placeholder="Confirm Password"
                  type="password"
                  className="rounded-full p-6"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <Button onClick={handelSignUp} className="rounded-full p-6">
                  Sign Up
                </Button>
              </TabsContent>
            </Tabs>
          </div>
        </div>
        <div className="hidden xl:flex justify-center items-center">
          <img src={Background} className="h-[700px] " alt="" />
        </div>
      </div>
    </div>
  );
};

export default Auth;
