import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Form, Input, Button, notification } from 'antd';
import { BankOutlined, NumberOutlined, EnvironmentOutlined, SaveOutlined } from '@ant-design/icons';
import { useCompanyDispatch, useCompanyState } from '../../hook/useCompany';
import Loading from '../../component/loading/Loading';

const FormInfo = ({ info, isUpdate, onSuccess }) => {
  const [form] = Form.useForm();
  const {
    dispatchCreateCompany,
    dispatchClearCreateCompany,
    dispatchUpdateCompany,
    dispatchClearUpdateCompany
  } = useCompanyDispatch();
  const { companyCreate, companyUpdate } = useCompanyState();

  useEffect(() => {
    dispatchClearCreateCompany();
    dispatchClearUpdateCompany();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (isUpdate && info) {
      form.setFieldsValue({
        name: info.name,
        id_company: info.id_company,
        address: info.address
      });
    } else {
      form.resetFields();
    }
  }, [info, isUpdate, form]);

  useEffect(() => {
    if (companyCreate?.done || companyUpdate?.done) {
      if (companyCreate?.error || companyUpdate?.error) {
        notification.error({
          message: 'เกิดข้อผิดพลาด',
          description: isUpdate ? companyUpdate?.error : companyCreate?.error,
          placement: 'bottomRight'
        });
      } else {
        if (!isUpdate) {
          form.resetFields();
        }
        notification.success({
          message: isUpdate ? 'อัปเดตข้อมูลบริษัทประกันสำเร็จ' : 'เพิ่มบริษัทประกันสำเร็จ',
          placement: 'bottomRight'
        });
        if (onSuccess) onSuccess();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [companyCreate?.done, companyUpdate?.done]);

  const onFinish = (values) => {
    if (isUpdate) {
      dispatchUpdateCompany(info?._id, values);
    } else {
      dispatchCreateCompany(values);
    }
  };

  const isLoading = companyCreate?.loading || companyUpdate?.loading;

  return (
    <Loading show={isLoading} tip="กำลังบันทึกข้อมูล...">
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        requiredMark="optional"
      >
        <Form.Item
          name="id_company"
          label="เลขประจำตัวผู้เสียภาษีอากร"
          rules={[{ required: true, message: 'กรุณากรอกเลขประจำตัวผู้เสียภาษี' }]}
        >
          <Input
            prefix={<NumberOutlined style={{ color: '#94A3B8' }} />}
            placeholder="เช่น 0107537001714"
            size="large"
          />
        </Form.Item>

        <Form.Item
          name="name"
          label="ชื่อบริษัทประกันภัย"
          rules={[{ required: true, message: 'กรุณากรอกชื่อบริษัทประกัน' }]}
        >
          <Input
            prefix={<BankOutlined style={{ color: '#94A3B8' }} />}
            placeholder="เช่น บมจ. วิริยะประกันภัย"
            size="large"
          />
        </Form.Item>

        <Form.Item
          name="address"
          label="ที่อยู่สำนักงานใหญ่ / สาขา"
          rules={[{ required: true, message: 'กรุณากรอกที่อยู่บริษัท' }]}
        >
          <Input.TextArea
            rows={4}
            placeholder="ระบุที่อยู่ของบริษัทประกันภัย..."
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
            {isUpdate ? 'บันทึกการแก้ไข' : 'เพิ่มบริษัท'}
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
