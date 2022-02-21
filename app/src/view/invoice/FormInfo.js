import { useEffect } from 'react';
import Proptypes from 'prop-types';
import { Form, Input, Button, notification, DatePicker, Radio, Select, Checkbox } from 'antd';
import { useInvoiceDispatch, useInvoiceState } from '../../hook/useInvoice';
import { useCompanyState } from '../../hook/useCompany';
import { useCustomerState } from '../../hook/useCustomer';
import Loading from '../../component/loading/Loading';
import moment from 'moment';
import _ from 'lodash';

const fields = {
    invoice_no: null,
    issue_date: null,
    insurance_type: null,
    insurance_amount: null,
    insurance_receiver: null,
    insurance_no: null,
    act_no: null,
    plate_no: null,
    customer_name: null,
    amount: 0,
    amount_act: 0,
    amount_stamp: 0,
    is_company: false,
    start_date: null,
    end_date: null
};

const FormInfo = (props) => {
    const { info, isUpdate } = props;
    const [form] = Form.useForm();
    const { dispatchCreateInvoice, dispatchClearCreateInvoice } = useInvoiceDispatch();
    const { invoiceCreate } = useInvoiceState();
    const { companyList } = useCompanyState();
    const { customerList } = useCustomerState();

    useEffect(() => {
        dispatchClearCreateInvoice();
        // dispatchClearUpdateCustomer();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        if (isUpdate) {
            form.setFieldsValue({
                ...fields,
                ...info,
                is_company: info?.vat_at_paid > 0 ? ["checked"] : [],
                issue_date: moment(info?.issue_date),
                start_date: moment(info?.start_date),
                end_date: moment(info?.end_date),
                insurance_receiver: _.find(companyList.companyList, { name: info?.insurance_receiver })?.id_company
            });
        } else {
            form.setFieldsValue(fields);
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [info, isUpdate]);

    useEffect(() => {
        if (invoiceCreate?.done) {
            if (invoiceCreate?.error) {
                notification.error({
                    message: isUpdate ? "" : invoiceCreate?.error,
                    placement: "bottomRight",
                    duration: 2.5
                });
            } else {
                if (!isUpdate) {
                    form.setFieldsValue(fields);
                }
                notification.success({
                    message: isUpdate ? "Update success" : "Create success",
                    placement: "bottomRight",
                    duration: 2.5
                });
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [invoiceCreate.done])

    const onFinish = (e) => {
        if (isUpdate) {
            let updateData = {
                ...e,
                insurance_receiver_id: e.insurance_receiver,
                is_company: e.is_company.length > 0
            };
            dispatchCreateInvoice(updateData);
        } else {
            dispatchCreateInvoice(e);
        }
    };

    const onPlateNumberChange = (e) => {
        let existValue = form.getFieldsValue();
        form.setFieldsValue({
            ...existValue,
            customer_name: _.find(customerList.customerList, { plate_number: e })?.name
        });
    };

    return (
        <>
            <h4>{isUpdate ? "Update" : "Create"} invoice</h4>
            <div>
                <Loading show={invoiceCreate?.loading}>
                    <Form form={form} colon={false} onFinish={onFinish}>
                        <Form.Item
                            name="invoice_no"
                            label="เลขที่"
                            rules={[{ required: true }]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            name="issue_date"
                            label="วันที่"
                            rules={[{ required: true }]}
                        >
                            <DatePicker />
                        </Form.Item>
                        <Form.Item
                            name="plate_no"
                            label="ทะเบียน"
                            rules={[{ required: true }]}
                        >
                            <Select onChange={onPlateNumberChange}>
                                {customerList.customerList.map(c => (
                                    <Select.Option key={c._id} value={c.plate_number}>{c.plate_number}</Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                        <Form.Item
                            name="customer_name"
                            label="ชื่อลูกค้า"
                        >
                            <Input disabled />
                        </Form.Item>
                        <Form.Item
                            name="insurance_type"
                            label="ประเภทประกันภัย"
                            rules={[{ required: true }]}
                        >
                            <Radio.Group>
                                <Radio.Button value="รถยนต์">รถยนต์</Radio.Button>
                                <Radio.Button value="รถบรรทุก">รถบรรทุก</Radio.Button>
                            </Radio.Group>
                        </Form.Item>
                        <Form.Item
                            name="insurance_amount"
                            label="ทุนประกัน"
                            rules={[{ required: true }]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            name="insurance_receiver"
                            label="ผู้รับประกัน"
                            rules={[{ required: true }]}
                        >
                            <Select>
                                {companyList.companyList.map(c => (
                                    <Select.Option key={c._id} value={c.id_company}>{c.name}</Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                        <Form.Item
                            name="insurance_no"
                            label="กรมธรรม์เลขที่"
                            rules={[{ required: true }]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            name="act_no"
                            label="พ.ร.บ เลขที่"
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            name="amount"
                            label="เบี้ยประกันภัย"
                            rules={[{ required: true }]}
                        >
                            <Input type="number" />
                        </Form.Item>
                        <Form.Item
                            name="amount_act"
                            label="เบี้ยประกันภัยบังคับตาม พ.ร.บ.ฯ"
                        >
                            <Input type="number" />
                        </Form.Item>
                        <Form.Item
                            name="amount_stamp"
                            label="อากรแสตมป์"
                            rules={[{ required: true }]}
                        >
                            <Input type="number" />
                        </Form.Item>
                        <Form.Item
                            name="start_date"
                            label="วันที่เริ่มคุ้มครอง"
                            rules={[{ required: true }]}
                        >
                            <DatePicker />
                        </Form.Item>
                        <Form.Item
                            name="end_date"
                            label="วันที่หมดอายุ"
                            rules={[{ required: true }]}
                        >
                            <DatePicker />
                        </Form.Item>
                        <Form.Item
                            name="is_company"
                            label=""
                        >
                            <Checkbox.Group>
                                <Checkbox value="checked" style={{ lineHeight: '32px' }}>
                                    หักภาษี ณ ที่จ่าย (บริษัท)
                                </Checkbox>
                            </Checkbox.Group>
                        </Form.Item>
                        <Form.Item style={{ float: "right", paddingBottom: "1.5rem" }}>
                            <Button type='primary' htmlType='submit' >{isUpdate ? "Update" : "Create"}</Button>
                        </Form.Item>
                    </Form>
                </Loading>
            </div>
        </>
    );

};

FormInfo.propTypes = {
    info: Proptypes.object,
    isUpdate: Proptypes.bool
};

FormInfo.defaultProps = {
    info: null,
    isUpdate: false
};

export default FormInfo;