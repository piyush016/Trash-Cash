import { useState } from "react";
import { Modal, Input, Button, notification } from "antd";
import axios from "axios";

const SecurityModal = ({ visible, onSuccess, onCancel }) => {
  const [code, setCode] = useState(["", "", "", ""]);
  const inputRefs = [];

  const handleConfirm = async () => {
    try {
      const response = await axios.post(
        `${process.env.API_URL}/user/security-check`,
        {
          code: code.join(""),
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response.data.success) {
        onCancel();
        onSuccess();
      }
    } catch (error) {
      notification.error({
        message: "Verification Failed",
        description: "The security code you entered is incorrect.",
      });
      onCancel();
    }
  };

  const handleInputChange = (index, value) => {
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);
    if (index < inputRefs.length - 1 && value !== "") {
      inputRefs[index + 1].focus();
    }
  };

  return (
    <Modal
      title='Enter Secret Code'
      visible={visible}
      onCancel={onCancel}
      footer={[
        <Button key='cancel' onClick={onCancel} danger>
          Cancel
        </Button>,
        <Button key='confirm' onClick={handleConfirm}>
          Confirm
        </Button>,
      ]}
    >
      <div style={{ display: "flex", justifyContent: "center" }}>
        {code.map((value, index) => (
          <Input
            key={index}
            ref={(ref) => (inputRefs[index] = ref)}
            value={value}
            onChange={(e) => handleInputChange(index, e.target.value)}
            maxLength={1}
            style={{ width: "50px", margin: "0 5px" }}
          />
        ))}
      </div>
    </Modal>
  );
};

export default SecurityModal;
