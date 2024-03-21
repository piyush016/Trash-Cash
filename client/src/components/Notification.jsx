import { useEffect } from "react";
import { notification } from "antd";
import { CheckCircleOutlined } from "@ant-design/icons";
import successSound from "../assets/notification-sound.mp3";
import socket from "../socket";

const Notification = () => {
  useEffect(() => {
    socket.on("notification", (data) => {
      openNotification(data);
      playSuccessSound();
    });

    return () => {
      socket.off("notification");
    };
  }, []);

  const openNotification = (message) => {
    notification.success({
      message: "Success",
      description: message,
      icon: <CheckCircleOutlined style={{ color: "#52c41a" }} />,
      duration: 5,
    });
  };

  const playSuccessSound = () => {
    const audio = new Audio(successSound);
    audio.play();
  };

  return null;
};

export default Notification;
