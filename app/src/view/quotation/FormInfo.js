import { useEffect } from "react";
import Proptypes from "prop-types";
import { Form, Input, Button, notification, DatePicker, Radio, Select, Checkbox, Card } from "antd";
import { PlusOutlined, MinusCircleOutlined } from "@ant-design/icons";
import { useQuotationDispatch, useQuotationState } from "../../hook/useQuotation";
import { useCompanyState } from "../../hook/useCompany";
import { useCustomerState } from "../../hook/useCustomer";
import Loading from "../../component/loading/Loading";
import moment from "moment";
import _ from "lodash";

const fields = {
    issue_date: null
};

const FormInfo = (props) => {
    const { info, isUpdate } = props;
    const [form] = Form.useForm();
    const { dispatchClearCreateQuotation, dispatchCreateQuotation } = useQuotationDispatch();
    const { quotationCreate } = useQuotationState();
    const { companyList } = useCompanyState();
    const { customerList } = useCustomerState();

    const onFinish = (e) => {
        if (isUpdate) {
            let updateData = {
                ...e
            };
            //   dispatchCreateInvoice(updateData);
        } else {
            dispatchCreateQuotation(e);
        }
    };

    useEffect(() => {
        dispatchClearCreateQuotation();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (isUpdate) {
            let customers = info?.customers.map((c) => {
                return { 
                    ...c, 
                    company_id: _.find(companyList.companyList, { name: c?.company_name })?._id,
                    customer_id: _.find(customerList.customerList, { plate_number: c?.plate_number })?._id,
                    end_date: moment(c?.end_date)
                 };
            });

            form.setFieldsValue({
                ...fields,
                ...info,
                customers,
                issue_date: moment(info?.issue_date)
            });
        } else {
            form.setFieldsValue(fields);
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [info, isUpdate]);

    return (
        <>
            <h4>{isUpdate ? "Update" : "Create"} quotation</h4>
            <div>
                <Loading show={quotationCreate?.loading}>
                    <Form form={form} colon={false} onFinish={onFinish}>
                        <Form.Item name="issue_date" label="วันที่" rules={[{ required: true }]}>
                            <DatePicker />
                        </Form.Item>

                        <Form.List name="customers">
                            {(fields, { add, remove }) => (
                                <>
                                    {fields.map(({ key, name, ...restField }) => (
                                        <Card key={key} style={{ marginBottom: "10px" }}>
                                            <MinusCircleOutlined onClick={() => remove(name)} />
                                            <Form.Item {...restField} name={[name, "company_id"]} label="ผู้รับประกัน" rules={[{ required: true }]}>
                                                <Select>
                                                    {companyList.companyList.map((c) => (
                                                        <Select.Option key={c._id} value={c._id}>
                                                            {c.name}
                                                        </Select.Option>
                                                    ))}
                                                </Select>
                                            </Form.Item>
                                            <Form.Item {...restField} name={[name, "customer_id"]} label="ทะเบียน" rules={[{ required: true }]}>
                                                <Select>
                                                    {customerList.customerList.map((c) => (
                                                        <Select.Option key={c._id} value={c._id}>
                                                            {c.plate_number}
                                                        </Select.Option>
                                                    ))}
                                                </Select>
                                            </Form.Item>
                                            <Form.Item {...restField} name={[name, "insurance_amount"]} label="ทุนประกัน/ประเภทประกัน" rules={[{ required: true }]}>
                                                <Input />
                                            </Form.Item>
                                            <Form.Item {...restField} name={[name, "amount"]} label="เบี้ยประกันภัย" rules={[{ required: true }]}>
                                                <Input type="number" />
                                            </Form.Item>
                                            <Form.Item {...restField} name={[name, "act_amount"]} label="พ.ร.บ." rules={[{ required: false }]}>
                                                <Input type="number" />
                                            </Form.Item>
                                            <Form.Item {...restField} name={[name, "end_date"]} label="วันสิ้นสุด" rules={[{ required: true }]}>
                                                <DatePicker />
                                            </Form.Item>
                                        </Card>
                                    ))}

                                    <Form.Item>
                                        <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                                            Add Customer
                                        </Button>
                                    </Form.Item>
                                </>
                            )}
                        </Form.List>
                        <Form.Item style={{ float: "right", paddingBottom: "1.5rem" }}>
                            <Button type="primary" htmlType="submit">
                                {isUpdate ? "Update" : "Create"}
                            </Button>
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
