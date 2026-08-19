import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Form, Input, Button, notification } from 'antd';
import { UserOutlined, IdcardOutlined, SaveOutlined } from '@ant-design/icons';
import { useCustomerDispatch, useCustomerState } from '../../hook/useCustomer';
import Loading from '../../component/loading/Loading';

const FormInfo = ({ info, isUpdate, onSuccess }) => {
  const [form] = Form.useForm();
  const {
    dispatchCreateCustomer,
    dispatchClearCreateCustomer,
    dispatchUpdateCustomer,
    dispatchClearUpdateCustomer
  } = useCustomerDispatch();
  const { customerCreate, customerUpdate } = useCustomerState();

  useEffect(() => {
    dispatchClearCreateCustomer();
    dispatchClearUpdateCustomer();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (isUpdate && info) {
      form.setFieldsValue({
        name: info.name,
        plate_number: info.plate_number
      });
    } else {
      form.resetFields();
    }
  }, [info, isUpdate, form]);

  useEffect(() => {
    if (customerCreate?.done || customerUpdate?.done) {
      if (customerCreate?.error || customerUpdate?.error) {
        notification.error({
          message: 'เกิดข้อผิดพลาด',
          description: isUpdate ? customerUpdate?.error : customerCreate?.error,
          placement: 'bottomRight'
        });
      } else {
        if (!isUpdate) {
          form.resetFields();
        }
        notification.success({
          message: isUpdate ? 'อัปเดตข้อมูลลูกค้าสำเร็จ' : 'เพิ่มข้อมูลลูกค้าสำเร็จ',
          placement: 'bottomRight'
        });
        if (onSuccess) onSuccess();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customerCreate?.done, customerUpdate?.done]);

  const onFinish = (values) => {
    if (isUpdate) {
      dispatchUpdateCustomer(info?._id, values);
    } else {
      dispatchCreateCustomer(values);
    }
  };

  const isLoading = customerCreate?.loading || customerUpdate?.loading;

  return (
    <Loading show={isLoading} tip="กำลังบันทึกข้อมูล...">
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        requiredMark="optional"
      >
        <Form.Item
          name="plate_number"
          label="เลขทะเบียนรถ"
          rules={[{ required: true, message: 'กรุณากรอกเลขทะเบียนรถ' }]}
        >
          <Input
            prefix={<IdcardOutlined style={{ color: '#94A3B8' }} />}
            placeholder="เช่น กข-1234 กทม."
            size="large"
          />
        </Form.Item>

        <Form.Item
          name="name"
          label="ชื่อ-นามสกุล / ที่อยู่ลูกค้า"
          rules={[{ required: true, message: 'กรุณากรอกชื่อหรือที่อยู่ลูกค้า' }]}
        >
          <Input.TextArea
            rows={4}
            placeholder="ระบุชื่อผู้เอาประกันและที่อยู่ติดต่อ..."
            size="large"
          />
        </Form.Item>

        <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
          <Button
            type="primary"
            htmlType="submit"
            icon={<SaveOutlined />}
            size="large"
            style={{ minWidth: '130px', borderRadius: '8px' }}
          >
            {isUpdate ? 'บันทึกการแก้ไข' : 'เพิ่มลูกค้า'}
          </Button>
        </div>
      </Form>
    </Loading>
  );
};

FormInfo.propTypes = {
  info: PropTypes.object,
  isUpdate: PropTypes.bool,
  onSuccess: PropTypes.func
};

FormInfo.defaultProps = {
  info: null,
  isUpdate: false,
  onSuccess: null
};

export default FormInfo;
