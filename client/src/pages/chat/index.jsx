import { useAppStore } from "@/store";
import React, { useEffect } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Chat = () => {
  const { userInfo } = useAppStore();
  const navigate = useNavigate();
  console.log(userInfo);

  useEffect(() => {
    if (!userInfo.profileSetup) {
      toast.error("Please complete your profile setup");
      navigate("/profile");
    }
  }, [userInfo, navigate]);
  return <div>Chat PAge</div>;
};

export default Chat;
