import Airtable from "airtable";
import { Button, Col, Form, Input, Modal, Row, Select, message } from "antd";
import { useState } from "react";
import moment from "moment";

export const DeliveryModal = ({
  showDeliveryModal,
  handleClose,
  fileValue,
  callback,
}) => {
  const airtableUserBase = new Airtable({
    apiKey: process.env.NEXT_PUBLIC_AIRTABLE_API_KEY,
  }).base("apptK8T882icYTvY7");
  const fileTableList = airtableUserBase("File List");

  const [deliveryForm] = Form.useForm();

  const [selectValue, setselectValue] = useState("");

  const onFinish = async (values) => {
    let data = {
      "VISIT STATUS": values.status,
      "COMMENTS": values.summary,
      "isFormSubmitted": "YES",
      "DATE OF VISIT": moment(new Date()).format("YYYY-MM-DD"),
    };
    if (values.newAddress) {
      data["ADDRESS CHANGE"] = values.newAddress;
    }

    fileTableList.update(
      [
        {
          id: fileValue.id,
          fields: data,
        },
      ],
      async function (err) {
        if (err) {
          message.error(err.message)
          return;
        }
        await callback();
        handleClose();
      }
    );



  };

  const handleSelectChange = (e) => {
    setselectValue(e);
  };

  return (
    <Modal
      title="Update Visit Status"
      visible={showDeliveryModal}
      onCancel={handleClose}
      footer={null}
    >
      <Row className="mb-8" gutter={[4, 4]}>
        <Col xs={24}>
          <span className="text-xs">Name</span>
          <p className="text-sm">{fileValue["HOF Name"]}</p>
        </Col>
        <Col xs={12}>
          <span className="text-xs">File No</span>
          <p className="text-sm">{fileValue.file_number}</p>
        </Col>
        <Col xs={12}>
          <span className="text-xs">Contact</span>
          <p className="text-sm">{fileValue["HOF contact"]}</p>
        </Col>
      </Row>
      <Form
        name="deliveryStatus"
        form={deliveryForm}
        onFinish={onFinish}
        autoComplete="off"
      >
        <Form.Item
          label="Status"
          name="status"
          rules={[
            {
              required: true,
              message: "Please select status",
            },
          ]}
        >
          <Select onChange={handleSelectChange}>
            <Select.Option value="Completed">Completed</Select.Option>
            <Select.Option value="Not Available">Not Available</Select.Option>
            <Select.Option value="Address Change">Address Change</Select.Option>
          </Select>
        </Form.Item>

        {selectValue === "Address Change" ? (
          <Form.Item
            label="New Address"
            name="newAddress"
            rules={[
              {
                required: false,
                message: "Please enter reason for return!",
              },
            ]}
          >
            <Input.TextArea />
          </Form.Item>
        ) : null}

        <Form.Item
          label="Visit Summary"
          name="summary"
          extra="write comments for visit"
          rules={[
            {
              required: true,
              message: "Please enter summary!",
            },
          ]}
        >
          <Input.TextArea />
        </Form.Item>

        <Form.Item>
          <Button
            className="bg-blue-500 hover:bg-blue-600 active:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-300 border-none"
            type="primary"
            htmlType="submit"
          >
            Submit
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};
