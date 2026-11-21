import React, { useEffect, useRef, useState } from 'react';
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
  Divider,
  Alert
} from 'antd';
import { SaveOutlined, CalculatorOutlined, CopyOutlined } from '@ant-design/icons';
import { useInvoiceDispatch, useInvoiceState } from '../../hook/useInvoice';
import { useCompanyState } from '../../hook/useCompany';
import { useCustomerState } from '../../hook/useCustomer';
import { getInvoiceList } from '../../redux/invoice/api';
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
  is_company: [],
  start_date: null,
  end_date: null
};

const formatMoney = (val) =>
  Number(val || 0).toLocaleString('th-TH', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });

const FormInfo = ({ info, mode, isUpdate, nextInvoiceNo, onSuccess }) => {
  const [form] = Form.useForm();
  const { dispatchCreateInvoice, dispatchClearCreateInvoice } = useInvoiceDispatch();
  const { invoiceCreate } = useInvoiceState();
  const { companyList } = useCompanyState();
  const { customerList } = useCustomerState();

  const effectiveMode = mode || (isUpdate ? 'update' : 'create');

  const [netAmount, setNetAmount] = useState(0);
  const [actAmount, setActAmount] = useState(0);
  const [stampAmount, setStampAmount] = useState(0);
  const [isCompanyChecked, setIsCompanyChecked] = useState(false);
  const [latestPlateInvoice, setLatestPlateInvoice] = useState(null);
  const [loadingSuggestion, setLoadingSuggestion] = useState(false);
  const hasSubmittedRef = useRef(false);

  const resolveCompanyId = (record) => {
    if (record?.company_id) return record.company_id;
    const company = _.find(companyList.companyList, { name: record?.insurance_receiver });
    return company?.id_company || record?.insurance_receiver || null;
  };

  const applyInvoiceFromPrevious = (prevRecord, keepCurrentHeader = false) => {
    const startMoment = prevRecord?.end_date ? moment(prevRecord.end_date) : moment();
    const endMoment = startMoment.clone().add(1, 'year');
    const prevIsCompany = Boolean(prevRecord?.vat_at_paid > 0 || prevRecord?.is_company);
    const prevNet = Number(prevRecord?.amount) || 0;
    const prevAct = Number(prevRecord?.amount_act) || 0;
    const prevStamp = Number(prevRecord?.amount_stamp) || 0;

    const currentInvoiceNo = keepCurrentHeader
      ? form.getFieldValue('invoice_no') || nextInvoiceNo || ''
      : nextInvoiceNo || '';
    const currentIssueDate = keepCurrentHeader
      ? form.getFieldValue('issue_date') || moment()
      : moment();

    const nextValues = {
      ...defaultFields,
      invoice_no: currentInvoiceNo,
      issue_date: currentIssueDate,
      plate_no: prevRecord?.plate_no || form.getFieldValue('plate_no') || null,
      customer_name: prevRecord?.customer_name || form.getFieldValue('customer_name') || '',
      insurance_type: prevRecord?.insurance_type || 'รถยนต์',
      insurance_receiver: resolveCompanyId(prevRecord),
      insurance_amount: prevRecord?.insurance_amount || '',
      insurance_no: '',
      act_no: '',
      start_date: startMoment,
      end_date: endMoment,
      amount: prevNet,
      amount_act: prevAct,
      amount_stamp: prevStamp,
      is_company: prevIsCompany ? ['checked'] : []
    };

    form.setFieldsValue(nextValues);
    setNetAmount(prevNet);
    setActAmount(prevAct);
    setStampAmount(prevStamp);
    setIsCompanyChecked(prevIsCompany);
  };

  useEffect(() => {
    dispatchClearCreateInvoice();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setLatestPlateInvoice(null);

    if (effectiveMode === 'update' && info) {
      const prevIsCompany = Boolean(info?.vat_at_paid > 0 || info?.is_company);
      const initialVals = {
        ...defaultFields,
        ...info,
        is_company: prevIsCompany ? ['checked'] : [],
        issue_date: info?.issue_date ? moment(info.issue_date) : null,
        start_date: info?.start_date ? moment(info.start_date) : null,
        end_date: info?.end_date ? moment(info.end_date) : null,
        insurance_receiver: resolveCompanyId(info)
      };
      form.setFieldsValue(initialVals);
      setNetAmount(Number(info?.amount) || 0);
      setActAmount(Number(info?.amount_act) || 0);
      setStampAmount(Number(info?.amount_stamp) || 0);
      setIsCompanyChecked(prevIsCompany);
    } else if (effectiveMode === 'clone' && info) {
      applyInvoiceFromPrevious(info, false);
    } else {
      form.setFieldsValue({
        ...defaultFields,
        invoice_no: nextInvoiceNo || '',
        issue_date: moment()
      });
      setNetAmount(0);
      setActAmount(0);
      setStampAmount(0);
      setIsCompanyChecked(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [info, effectiveMode, nextInvoiceNo, form, companyList.companyList]);

  useEffect(() => {
    if (hasSubmittedRef.current && invoiceCreate?.done) {
      hasSubmittedRef.current = false;
      if (invoiceCreate?.error) {
        notification.error({
          message: 'เกิดข้อผิดพลาด',
          description: invoiceCreate?.error,
          placement: 'bottomRight'
        });
        dispatchClearCreateInvoice();
      } else {
        if (effectiveMode !== 'update') {
          form.setFieldsValue({
            ...defaultFields,
            invoice_no: nextInvoiceNo ? Number(nextInvoiceNo) + 1 : '',
            issue_date: moment()
          });
          setNetAmount(0);
          setActAmount(0);
          setStampAmount(0);
          setIsCompanyChecked(false);
          setLatestPlateInvoice(null);
        }
        notification.success({
          message:
            effectiveMode === 'update' ? 'อัปเดตใบวางบิลสำเร็จ' : 'สร้างใบวางบิลสำเร็จ',
          placement: 'bottomRight'
        });
        dispatchClearCreateInvoice();
        if (onSuccess) onSuccess();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [invoiceCreate?.done]);

  const onFinish = (values) => {
    hasSubmittedRef.current = true;
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

  const onPlateNumberChange = async (value) => {
    const customer = _.find(customerList.customerList, { plate_number: value });
    form.setFieldsValue({
      customer_name: customer?.name || ''
    });

    if (effectiveMode !== 'create' || !value) {
      setLatestPlateInvoice(null);
      return;
    }

    setLoadingSuggestion(true);
    try {
      const res = await getInvoiceList(
        `page=1&size=5&plate_number=${encodeURIComponent(value)}`
      );
      const list = res?.data?.data || [];
      const exactMatch = list.find((item) => item.plate_no === value) || null;
      setLatestPlateInvoice(exactMatch);
    } catch {
      setLatestPlateInvoice(null);
    } finally {
      setLoadingSuggestion(false);
    }
  };

  const handleStartDateChange = (date) => {
    if (date) {
      form.setFieldsValue({
        end_date: date.clone().add(1, 'year')
      });
    }
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

  const handleIsCompanyChange = (checkedValues) => {
    setIsCompanyChecked(checkedValues.length > 0);
  };

  // Match backend calculateInvoiceAmounts formula exactly
  const totalAmount1 = actAmount > 0 ? netAmount + actAmount + stampAmount : netAmount + stampAmount;
  const vat7 = (totalAmount1 * 7) / 100;
  const totalAmount2 = totalAmount1 + vat7;
  const vatAtPaid = isCompanyChecked ? totalAmount1 / 100 : 0;
  const totalAmount3 = isCompanyChecked ? totalAmount2 - vatAtPaid : totalAmount2;

  return (
    <Loading show={invoiceCreate?.loading} tip="กำลังบันทึกใบวางบิล...">
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        requiredMark="optional"
      >
        {effectiveMode === 'clone' && info && (
          <Alert
            type="info"
            showIcon
            style={{ marginBottom: '14px' }}
            message={`ดึงข้อมูลจากใบวางบิล #${info.invoice_no} และรันเลขบิลใหม่ให้อัตโนมัติแล้ว`}
            description="กรุณากรอกเลขกรมธรรม์/พ.ร.บ. ของปีใหม่ และตรวจสอบหรือแก้ไขข้อมูลทุกช่องได้ตามต้องการก่อนบันทึก"
          />
        )}

        <Row gutter={[16, 0]}>
          <Col xs={24} sm={12}>
            <Form.Item
              name="invoice_no"
              label="เลขที่ใบวางบิล"
              rules={[{ required: true, message: 'กรุณาระบุเลขที่ใบวางบิล' }]}
            >
              <Input placeholder="เช่น 784" />
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
                loading={loadingSuggestion}
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

          {effectiveMode === 'create' && latestPlateInvoice && (
            <Col xs={24} style={{ marginBottom: '14px' }}>
              <Alert
                type="info"
                showIcon
                message={
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '10px',
                      flexWrap: 'wrap'
                    }}
                  >
                    <span>
                      พบใบวางบิลล่าสุดของทะเบียนนี้: <strong>#{latestPlateInvoice.invoice_no}</strong> (
                      {latestPlateInvoice.insurance_receiver})
                    </span>
                    <Button
                      size="small"
                      type="primary"
                      icon={<CopyOutlined />}
                      onClick={() => {
                        applyInvoiceFromPrevious(latestPlateInvoice, true);
                        setLatestPlateInvoice(null);
                      }}
                    >
                      ดึงข้อมูลมาเติม
                    </Button>
                  </div>
                }
              />
            </Col>
          )}

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
              <DatePicker
                style={{ width: '100%' }}
                format="DD/MM/YYYY"
                onChange={handleStartDateChange}
              />
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
            <Form.Item name="is_company">
              <Checkbox.Group onChange={handleIsCompanyChange}>
                <Checkbox value="checked">
                  หักภาษี ณ ที่จ่าย 1% (กรณีลูกค้านิติบุคคล/บริษัท)
                </Checkbox>
              </Checkbox.Group>
            </Form.Item>
          </Col>
        </Row>

        {/* Real-time Summary Box (matches backend calculateInvoiceAmounts) */}
        <SummaryBox>
          <div className="summary-row">
            <span>เบี้ยประกันภัยสุทธิ:</span>
            <span>{formatMoney(netAmount)} บาท</span>
          </div>
          {actAmount > 0 && (
            <div className="summary-row">
              <span>เบี้ย พ.ร.บ.:</span>
              <span>{formatMoney(actAmount)} บาท</span>
            </div>
          )}
          <div className="summary-row">
            <span>อากรแสตมป์:</span>
            <span>{formatMoney(stampAmount)} บาท</span>
          </div>
          <div className="summary-row">
            <span>รวมก่อน VAT:</span>
            <span>{formatMoney(totalAmount1)} บาท</span>
          </div>
          <div className="summary-row">
            <span>ภาษีมูลค่าเพิ่ม (VAT 7%):</span>
            <span>{formatMoney(vat7)} บาท</span>
          </div>
          {isCompanyChecked && (
            <div className="summary-row">
              <span>หักภาษี ณ ที่จ่าย 1%:</span>
              <span>-{formatMoney(vatAtPaid)} บาท</span>
            </div>
          )}
          <div className="summary-row">
            <span>ยอดสุทธิที่ต้องชำระ:</span>
            <span>{formatMoney(totalAmount3)} บาท</span>
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
            {effectiveMode === 'update' ? 'บันทึกใบวางบิล' : 'สร้างใบวางบิล'}
          </Button>
        </div>
      </Form>
    </Loading>
  );
};

FormInfo.propTypes = {
  info: PropTypes.object,
  mode: PropTypes.oneOf(['create', 'update', 'clone']),
  isUpdate: PropTypes.bool,
  nextInvoiceNo: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  onSuccess: PropTypes.func
};

FormInfo.defaultProps = {
  info: null,
  mode: undefined,
  isUpdate: false,
  nextInvoiceNo: '',
  onSuccess: null
};

export default FormInfo;
