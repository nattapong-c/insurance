import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
  Form,
  Input,
  Button,
  notification,
  DatePicker,
  Radio,
  Select,
  Checkbox,
  Row,
  Col,
  Divider
} from 'antd';
import { SaveOutlined, CalculatorOutlined } from '@ant-design/icons';
import { useInvoiceDispatch, useInvoiceState } from '../../hook/useInvoice';
import { useCompanyState } from '../../hook/useCompany';
import { useCustomerState } from '../../hook/useCustomer';
import Loading from '../../component/loading/Loading';
import { SummaryBox } from '../../screen/invoice/styled-component';
import moment from 'moment';
import _ from 'lodash';

const defaultFields = {
  invoice_no: '',
  issue_date: null,
  insurance_type: 'รถยนต์',
  insurance_amount: '',
  insurance_receiver: null,
  insurance_no: '',
  act_no: '',
  plate_no: null,
  customer_name: '',
  amount: 0,
  amount_act: 0,
  amount_stamp: 0,
  is_company: false,
  start_date: null,
  end_date: null
};

const FormInfo = ({ info, isUpdate, onSuccess }) => {
  const [form] = Form.useForm();
  const { dispatchCreateInvoice, dispatchClearCreateInvoice } = useInvoiceDispatch();
  const { invoiceCreate } = useInvoiceState();
  const { companyList } = useCompanyState();
  const { customerList } = useCustomerState();

  const [netAmount, setNetAmount] = useState(0);
  const [actAmount, setActAmount] = useState(0);
  const [stampAmount, setStampAmount] = useState(0);

  useEffect(() => {
    dispatchClearCreateInvoice();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (isUpdate && info) {
      const company = _.find(companyList.companyList, { name: info?.insurance_receiver });
      const initialVals = {
        ...defaultFields,
        ...info,
        is_company: info?.vat_at_paid > 0 ? ['checked'] : [],
        issue_date: info?.issue_date ? moment(info.issue_date) : null,
        start_date: info?.start_date ? moment(info.start_date) : null,
        end_date: info?.end_date ? moment(info.end_date) : null,
        insurance_receiver: company?.id_company || info?.insurance_receiver
      };
      form.setFieldsValue(initialVals);
      setNetAmount(Number(info?.amount) || 0);
      setActAmount(Number(info?.amount_act) || 0);
      setStampAmount(Number(info?.amount_stamp) || 0);
    } else {
      form.setFieldsValue(defaultFields);
      setNetAmount(0);
      setActAmount(0);
      setStampAmount(0);
    }
  }, [info, isUpdate, form, companyList.companyList]);

  useEffect(() => {
    if (invoiceCreate?.done) {
      if (invoiceCreate?.error) {
        notification.error({
          message: 'เกิดข้อผิดพลาด',
          description: invoiceCreate?.error,
          placement: 'bottomRight'
        });
      } else {
        if (!isUpdate) {
          form.setFieldsValue(defaultFields);
          setNetAmount(0);
          setActAmount(0);
          setStampAmount(0);
        }
        notification.success({
          message: isUpdate ? 'อัปเดตใบวางบิลสำเร็จ' : 'สร้างใบวางบิลสำเร็จ',
          placement: 'bottomRight'
        });
        if (onSuccess) onSuccess();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [invoiceCreate?.done]);

  const onFinish = (values) => {
    const isCompanyVal = Array.isArray(values.is_company)
      ? values.is_company.length > 0
      : Boolean(values.is_company);

    const payload = {
      ...values,
      insurance_receiver_id: values.insurance_receiver,
      is_company: isCompanyVal,
      amount: Number(values.amount) || 0,
      amount_act: Number(values.amount_act) || 0,
      amount_stamp: Number(values.amount_stamp) || 0
    };
    dispatchCreateInvoice(payload);
  };

  const onPlateNumberChange = (value) => {
    const customer = _.find(customerList.customerList, { plate_number: value });
    form.setFieldsValue({
      customer_name: customer?.name || ''
    });
  };

  const handleAmountChange = (e) => {
    const val = parseFloat(e.target.value) || 0;
    setNetAmount(val);
    const calculatedStamp = Math.ceil(val * 0.004);
    if (!form.getFieldValue('amount_stamp') || form.getFieldValue('amount_stamp') === 0) {
      form.setFieldsValue({ amount_stamp: calculatedStamp });
      setStampAmount(calculatedStamp);
    }
  };

  const handleStampChange = (e) => {
    setStampAmount(parseFloat(e.target.value) || 0);
  };

  const handleActChange = (e) => {
    setActAmount(parseFloat(e.target.value) || 0);
  };

  // VAT 7% is calculated on Net Premium + Stamp Duty
  const vat = ((netAmount + stampAmount) * 0.07);
  const totalAmount = netAmount + stampAmount + vat + actAmount;

  return (
    <Loading show={invoiceCreate?.loading} tip="กำลังบันทึกใบวางบิล...">
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        requiredMark="optional"
      >
        <Row gutter={[16, 0]}>
          <Col xs={24} sm={12}>
            <Form.Item
              name="invoice_no"
              label="เลขที่ใบวางบิล"
              rules={[{ required: true, message: 'กรุณาระบุเลขที่ใบวางบิล' }]}
            >
              <Input placeholder="เช่น INV-2026-001" />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12}>
            <Form.Item
              name="issue_date"
              label="วันที่ออกเอกสาร"
              rules={[{ required: true, message: 'กรุณาเลือกวันที่' }]}
            >
              <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12}>
            <Form.Item
              name="plate_no"
              label="ทะเบียนรถลูกค้า"
              rules={[{ required: true, message: 'กรุณาเลือกทะเบียนรถ' }]}
            >
              <Select
                showSearch
                placeholder="เลือกทะเบียนรถ"
                onChange={onPlateNumberChange}
                filterOption={(input, option) =>
                  option.children.toLowerCase().includes(input.toLowerCase())
                }
              >
                {customerList.customerList.map((c) => (
                  <Select.Option key={c._id} value={c.plate_number}>
                    {c.plate_number}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          <Col xs={24} sm={12}>
            <Form.Item name="customer_name" label="ชื่อลูกค้า / ที่อยู่">
              <Input disabled placeholder="แสดงอัตโนมัติตามทะเบียนรถ" />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12}>
            <Form.Item
              name="insurance_type"
              label="ประเภทรถยนต์"
              rules={[{ required: true }]}
            >
              <Radio.Group style={{ width: '100%' }}>
                <Radio.Button value="รถยนต์" style={{ width: '50%', textAlign: 'center' }}>
                  รถยนต์
                </Radio.Button>
                <Radio.Button value="รถบรรทุก" style={{ width: '50%', textAlign: 'center' }}>
                  รถบรรทุก
                </Radio.Button>
              </Radio.Group>
            </Form.Item>
          </Col>

          <Col xs={24} sm={12}>
            <Form.Item
              name="insurance_receiver"
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
                  <Select.Option key={c._id} value={c.id_company}>
                    {c.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          <Col xs={24} sm={12}>
            <Form.Item
              name="insurance_amount"
              label="ทุนประกันภัย (บาท)"
              rules={[{ required: true, message: 'กรุณาระบุทุนประกัน' }]}
            >
              <Input placeholder="เช่น 500,000" />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12}>
            <Form.Item
              name="insurance_no"
              label="กรมธรรม์เลขที่"
              rules={[{ required: true, message: 'กรุณาระบุเลขกรมธรรม์' }]}
            >
              <Input placeholder="เช่น 12345-67890" />
            </Form.Item>
          </Col>

          <Col xs={24}>
            <Form.Item name="act_no" label="พ.ร.บ. เลขที่">
              <Input placeholder="ระบุเลขที่ พ.ร.บ. (ถ้ามี)" />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12}>
            <Form.Item
              name="start_date"
              label="วันที่เริ่มคุ้มครอง"
              rules={[{ required: true, message: 'กรุณาเลือกวันเริ่มคุ้มครอง' }]}
            >
              <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12}>
            <Form.Item
              name="end_date"
              label="วันที่หมดอายุ"
              rules={[{ required: true, message: 'กรุณาเลือกวันสิ้นสุด' }]}
            >
              <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
            </Form.Item>
          </Col>
        </Row>

        <Divider style={{ margin: '12px 0' }} />
        <h4 style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <CalculatorOutlined /> คำนวณเบี้ยประกันและภาษี
        </h4>

        <Row gutter={[16, 0]}>
          <Col xs={24} sm={8}>
            <Form.Item
              name="amount"
              label="เบี้ยประกันภัยสุทธิ"
              rules={[{ required: true, message: 'กรุณาระบุเบี้ยสุทธิ' }]}
            >
              <Input
                type="number"
                inputMode="decimal"
                placeholder="0.00"
                onChange={handleAmountChange}
              />
            </Form.Item>
          </Col>

          <Col xs={24} sm={8}>
            <Form.Item
              name="amount_stamp"
              label="อากรแสตมป์"
              rules={[{ required: true, message: 'กรุณาระบุอากร' }]}
            >
              <Input
                type="number"
                inputMode="decimal"
                placeholder="0.00"
                onChange={handleStampChange}
              />
            </Form.Item>
          </Col>

          <Col xs={24} sm={8}>
            <Form.Item name="amount_act" label="เบี้ยประกัน พ.ร.บ.">
              <Input
                type="number"
                inputMode="decimal"
                placeholder="0.00"
                onChange={handleActChange}
              />
            </Form.Item>
          </Col>

          <Col xs={24}>
            <Form.Item name="is_company" valuePropName="checked">
              <Checkbox.Group>
                <Checkbox value="checked">
                  หักภาษี ณ ที่จ่าย 1% (กรณีลูกค้านิติบุคคล/บริษัท)
                </Checkbox>
              </Checkbox.Group>
            </Form.Item>
          </Col>
        </Row>

        {/* Real-time Summary Box */}
        <SummaryBox>
          <div className="summary-row">
            <span>เบี้ยประกันภัยสุทธิ:</span>
            <span>{netAmount.toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} บาท</span>
          </div>
          <div className="summary-row">
            <span>อากรแสตมป์:</span>
            <span>{stampAmount.toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} บาท</span>
          </div>
          <div className="summary-row">
            <span>ภาษีมูลค่าเพิ่ม (VAT 7%):</span>
            <span>{vat.toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} บาท</span>
          </div>
          {actAmount > 0 && (
            <div className="summary-row">
              <span>เบี้ย พ.ร.บ.:</span>
              <span>{actAmount.toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} บาท</span>
            </div>
          )}
          <div className="summary-row">
            <span>ยอดรวมทั้งสิ้น (รวมภาษี):</span>
            <span>{totalAmount.toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} บาท</span>
          </div>
        </SummaryBox>

        <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
          <Button
            type="primary"
            htmlType="submit"
            icon={<SaveOutlined />}
            size="large"
            style={{ minWidth: '150px', borderRadius: '8px' }}
          >
            {isUpdate ? 'บันทึกใบวางบิล' : 'สร้างใบวางบิล'}
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
