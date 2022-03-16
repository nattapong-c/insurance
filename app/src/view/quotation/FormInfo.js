import { useEffect } from "react";
import Proptypes from "prop-types";
import { Form, Input, Button, notification, DatePicker, Radio, Select, Checkbox } from "antd";
import { useQuotationDispatch, useQuotationState } from "../../hook/useQuotation";
import Loading from "../../component/loading/Loading";
import moment from "moment";

const fields = {
    issue_date: null
};

const FormInfo = (props) => {
    const { info, isUpdate } = props;
    const [form] = Form.useForm();
    const { dispatchClearCreateQuotation, dispatchCreateQuotation } = useQuotationDispatch();
    const { quotationCreate } = useQuotationState();

    const onFinish = (e) => {
        if (isUpdate) {
            let updateData = {
                ...e
            };
            //   dispatchCreateInvoice(updateData);
        } else {
            //   dispatchCreateInvoice(e);
        }
    };

    useEffect(() => {
        dispatchClearCreateQuotation();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (isUpdate) {
            form.setFieldsValue({
                ...fields,
                ...info,
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
