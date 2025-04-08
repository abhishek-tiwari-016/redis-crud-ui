import React, { useState } from "react";
import { Modal, Input, Button, Form } from "antd";
import { Document, Documents } from "./DocumentTable";

interface EditModalProps {
  visible: boolean;
  onClose: () => void;
  document: Documents;
  onSave: (updatedDoc: Documents) => void;
}

const EditModal: React.FC<EditModalProps> = ({ visible, onClose, document, onSave }) => {
  const [formData, setFormData] = useState<Document>(document.Properties);
  const [loading, setLoading] = useState(false);

  const handleChange = (field: keyof Document, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await fetch("/document/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ Id: document.Id, ...formData }),
      });

      onSave({ ...document, Properties: formData });
      onClose();
    } catch (error) {
      console.error("Error updating document:", error);
    }
    setLoading(false);
  };

  return (
    <Modal
      title="Edit Document"
      open={visible}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>
          Cancel
        </Button>,
        <Button key="save" type="primary" loading={loading} onClick={handleSave}>
          Save
        </Button>,
      ]}
    >
      <Form layout="vertical">
        {Object.keys(formData).map((key) => (
          <Form.Item key={key} label={key}>
            <Input
              value={formData[key as keyof Document]}
              onChange={(e) => handleChange(key as keyof Document, e.target.value)}
            />
          </Form.Item>
        ))}
      </Form>
    </Modal>
  );
};

export default EditModal;