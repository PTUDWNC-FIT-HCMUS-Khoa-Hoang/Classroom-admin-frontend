import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import {
  Button,
  Input,
  Modal,
  Form,
  message,
  Row,
  Space,
  InputNumber,
} from 'antd';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import classroomApis from '../../../api/classrooms';
import parseErrorMessage from '../../../helpers/parseErrorMessage';

export default function ClassroomAdd({ onAddComplete }) {
  //#region redux hooks
  const auth = useSelector((state) => state.auth);
  //#endregion

  //#region useState (isModalOpen)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  //#endregion

  //#region handle functions (form submit)
  const handleClassroomAddFormSubmit = async (formValues) => {
    setIsLoading(true);

    const formattedGradings = formValues.gradings?.map((grading) => {
      return { ...grading, ratio: grading.ratio / 100 };
    });

    try {
      const axiosRes = await classroomApis.postOne(auth.token, {
        ...formValues,
        gradings: formattedGradings,
      });
      const newClassroom = axiosRes.data;
      if (typeof onAddComplete === 'function') {
        await onAddComplete(newClassroom);
      }
      message.success('Successfully added a classroom');
    } catch (error) {
      message.error(parseErrorMessage(error));
    }

    setIsLoading(false);
    setIsModalOpen(false);
  };
  const handleClassroomAddFormSubmitFailed = (formValues) => {};
  //#endregion

  return (
    <>
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={() => setIsModalOpen(true)}
      >
        Add a classroom
      </Button>
      <Modal
        title="Add Classroom"
        visible={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
      >
        <Form
          name="add-classroom-form"
          onFinish={handleClassroomAddFormSubmit}
          onFinishFailed={handleClassroomAddFormSubmitFailed}
          autoComplete="off"
          layout="vertical"
          style={{ width: '100%' }}
          initialValues={{
            gradings: [
              {
                title: 'Final exam',
                ratio: 100,
              },
            ],
          }}
        >
          {/* Title */}
          <Form.Item
            label="Title"
            name="title"
            rules={[
              { required: true, message: 'Please input your classroom title!' },
            ]}
          >
            <Input placeholder="Classroom title" />
          </Form.Item>

          {/* Gradings */}
          <Form.Item label="Gradings" required={true}>
            <Form.List
              name="gradings"
              rules={[
                {
                  validator(_, gradings) {
                    if (
                      !gradings ||
                      !Array.isArray(gradings) ||
                      gradings.length < 1
                    ) {
                      return Promise.reject();
                    } else {
                      const totalRatio =
                        gradings.length === 1
                          ? gradings[0].ratio
                          : gradings.reduce(
                              (prev, curr) =>
                                parseInt(prev?.ratio) + parseInt(curr?.ratio)
                            );
                      if (totalRatio !== 100) {
                        return Promise.reject();
                      }
                      return Promise.resolve();
                    }
                  },
                  message:
                    'Please provide at least 1 grading and the total ratio has to be 100 percent.',
                },
              ]}
            >
              {(fields, { add, remove }, { errors }) => (
                <>
                  {fields.map(({ key, name, fieldKey, ...restField }) => (
                    <Space
                      key={key}
                      style={{ display: 'flex', marginBottom: 8 }}
                      align="baseline"
                    >
                      <Form.Item
                        {...restField}
                        name={[name, 'title']}
                        fieldKey={[fieldKey, 'title']}
                        rules={[
                          { required: true, message: 'Missing grading title' },
                        ]}
                      >
                        <Input placeholder="Grading title" />
                      </Form.Item>
                      <Form.Item
                        {...restField}
                        name={[name, 'ratio']}
                        fieldKey={[fieldKey, 'ratio']}
                        rules={[
                          { required: true, message: 'Missing grade ratio' },
                        ]}
                      >
                        <InputNumber
                          min={0}
                          max={100}
                          placeholder="Grading ratio"
                        />
                      </Form.Item>
                      {fields.length > 1 ? (
                        <MinusCircleOutlined
                          className="dynamic-delete-button"
                          onClick={() => remove(name)}
                        />
                      ) : null}
                    </Space>
                  ))}
                  <Form.Item>
                    <Button
                      type="dashed"
                      onClick={() => add()}
                      block
                      icon={<PlusOutlined />}
                    >
                      Add grading
                    </Button>
                    <Form.ErrorList errors={errors} />
                  </Form.Item>
                </>
              )}
            </Form.List>
          </Form.Item>

          <Row justify="end">
            <Form.Item>
              <Button type="primary" htmlType="submit" loading={isLoading}>
                Add
              </Button>
            </Form.Item>
          </Row>
        </Form>
      </Modal>
    </>
  );
}
