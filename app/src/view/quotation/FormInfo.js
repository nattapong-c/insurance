import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Form,
  Input,
  Button,
  notification,
  DatePicker,
  Select,
  Card,
  Row,
  Col
} from 'antd';
import {
  PlusOutlined,
  DeleteOutlined,
  SaveOutlined
} from '@ant-design/icons';
import { useQuotationDispatch, useQuotationState } from '../../hook/useQuotation';
import { useCompanyState } from '../../hook/useCompany';
import { useCustomerState } from '../../hook/useCustomer';
import Loading from '../../component/loading/Loading';
import moment from 'moment';
import _ from 'lodash';
import styled from 'styled-components';

const ItemCard = styled(Card)`
  margin-bottom: 16px;
  background: ${({ theme }) => (theme.mode === 'dark' ? '#1C1C20' : '#F8FAFC')} !important;
  border: 1px solid ${({ theme }) => theme.border} !important;
  border-radius: 10px !important;

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
    padding-bottom: 8px;
    border-bottom: 1px solid ${({ theme }) => theme.border};
    font-weight: 600;
    font-size: 14px;
    color: ${({ theme }) => theme.textPrimary} !important;

    span {
      color: ${({ theme }) => theme.textPrimary} !important;
    }
  }
`;

const FormInfo = ({ info, isUpdate, onSuccess }) => {
  const [form] = Form.useForm();
  const {
    dispatchClearCreateQuotation,
    dispatchCreateQuotation,
    dispatchUpdateQuotation
  } = useQuotationDispatch();
  const { quotationCreate, quotationUpdate } = useQuotationState();
  const { companyList } = useCompanyState();
  const { customerList } = useCustomerState();

  useEffect(() => {
    dispatchClearCreateQuotation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (isUpdate && info) {
      const customers = info?.customers?.map((c) => ({
        ...c,
        company_id: _.find(companyList.companyList, { name: c?.company_name })?._id,
        customer_id: _.find(customerList.customerList, { plate_number: c?.plate_number })?._id,
        end_date: c?.end_date ? moment(c.end_date) : null
      })) || [];

      form.setFieldsValue({
        ...info,
        customers,
        issue_date: info?.issue_date ? moment(info.issue_date) : null
      });
    } else {
      form.setFieldsValue({
        issue_date: moment(),
        customers: [{}]
      });
    }
  }, [info, isUpdate, form, companyList.companyList, customerList.customerList]);

  useEffect(() => {
    if (quotationCreate?.done || quotationUpdate?.done) {
      if (quotationCreate?.error || quotationUpdate?.error) {
        notification.error({
          message: 'เกิดข้อผิดพลาด',
          description: isUpdate ? quotationUpdate?.error : quotationCreate?.error,
          placement: 'bottomRight'
        });
      } else {
        if (!isUpdate) {
          form.resetFields();
        }
        notification.success({
          message: isUpdate ? 'อัปเดตใบเสนอราคาสำเร็จ' : 'สร้างใบเสนอราคาสำเร็จ',
          placement: 'bottomRight'
        });
        if (onSuccess) onSuccess();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quotationCreate?.done, quotationUpdate?.done]);

  const onFinish = (values) => {
    if (isUpdate) {
      dispatchUpdateQuotation(info?._id, values);
    } else {
      dispatchCreateQuotation(values);
    }
  };

  const isLoading = quotationCreate?.loading || quotationUpdate?.loading;

  return (
    <Loading show={isLoading} tip="กำลังบันทึกใบเสนอราคา...">
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        requiredMark="optional"
      >
        <Form.Item
          name="issue_date"
          label="วันที่ออกเอกสาร"
          rules={[{ required: true, message: 'กรุณาเลือกวันที่' }]}
        >
          <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" size="large" />
        </Form.Item>

        <h4 style={{ margin: '16px 0 12px 0' }}>รายการรถและข้อเสนอประกันภัย</h4>

        <Form.List name="customers">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }, index) => (
                <ItemCard key={key}>
                  <div className="card-header">
                    <span>รายการที่ {index + 1}</span>
                    {fields.length > 1 && (
                      <Button
                        type="text"
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => remove(name)}
                      >
                        ลบรายการ
                      </Button>
                    )}
                  </div>

                  <Row gutter={[12, 0]}>
                    <Col xs={24} sm={12}>
                      <Form.Item
                        {...restField}
                        name={[name, 'customer_id']}
                        label="ทะเบียนรถลูกค้า"
                        rules={[{ required: true, message: 'กรุณาเลือกทะเบียน' }]}
                      >
                        <Select
                          showSearch
                          placeholder="เลือกทะเบียนรถ"
                          filterOption={(input, option) =>
                            option.children.toLowerCase().includes(input.toLowerCase())
                          }
                        >
                          {customerList.customerList.map((c) => (
                            <Select.Option key={c._id} value={c._id}>
                              {c.plate_number}
                            </Select.Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </Col>

                    <Col xs={24} sm={12}>
                      <Form.Item
                        {...restField}
                        name={[name, 'company_id']}
                        label="บริษัทประกันภัย"
                        rules={[{ required: true, message: 'กรุณาเลือกบริษัทประกัน' }]}
                      >
                        <Select
                          showSearch
                          placeholder="เลือกบริษัทประกัน"
                          filterOption={(input, option) =>
                            option.children.toLowerCase().includes(input.toLowerCase())
                          }
                        >
                          {companyList.companyList.map((c) => (
                            <Select.Option key={c._id} value={c._id}>
                              {c.name}
                            </Select.Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </Col>

                    <Col xs={24} sm={12}>
                      <Form.Item
                        {...restField}
                        name={[name, 'insurance_amount']}
                        label="ทุนประกัน / ประเภทประกัน"
                        rules={[{ required: true, message: 'กรุณาระบุทุนประกัน' }]}
                      >
                        <Input placeholder="เช่น 500,000 / ชั้น 1" />
                      </Form.Item>
                    </Col>

                    <Col xs={24} sm={12}>
                      <Form.Item
                        {...restField}
                        name={[name, 'amount']}
                        label="เบี้ยประกันภัย (บาท)"
                        rules={[{ required: true, message: 'กรุณาระบุเบี้ยประกัน' }]}
                      >
                        <Input type="number" inputMode="decimal" placeholder="0.00" />
                      </Form.Item>
                    </Col>

                    <Col xs={24} sm={12}>
                      <Form.Item
                        {...restField}
                        name={[name, 'act_amount']}
                        label="เบี้ย พ.ร.บ. (ถ้ามี)"
                      >
                        <Input type="number" inputMode="decimal" placeholder="0.00" />
                      </Form.Item>
                    </Col>

                    <Col xs={24} sm={12}>
                      <Form.Item
                        {...restField}
                        name={[name, 'end_date']}
                        label="วันสิ้นสุดความคุ้มครอง"
                        rules={[{ required: true, message: 'กรุณาเลือกวันสิ้นสุด' }]}
                      >
                        <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
                      </Form.Item>
                    </Col>
                  </Row>
                </ItemCard>
              ))}

              <Form.Item>
                <Button
                  type="dashed"
                  onClick={() => add()}
                  block
                  icon={<PlusOutlined />}
                  style={{ height: '44px', borderRadius: '8px' }}
                >
                  เพิ่มรายการรถอีก
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>

        <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
          <Button
            type="primary"
            htmlType="submit"
            icon={<SaveOutlined />}
            size="large"
            style={{ minWidth: '150px', borderRadius: '8px' }}
          >
            {isUpdate ? 'บันทึกใบเสนอราคา' : 'สร้างใบเสนอราคา'}
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
