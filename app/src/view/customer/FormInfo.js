import { useEffect } from 'react';
import Proptypes from 'prop-types';
import { Form, Input, Button, notification } from 'antd';
import { useCustomerDispatch, useCustomerState } from '../../hook/useCustomer';
import Loading from '../../component/loading/Loading';

const FormInfo = (props) => {
    const { info, isUpdate } = props;
    const [form] = Form.useForm();
    const { dispatchCreateCustomer, dispatchClearCreateCustomer, dispatchUpdateCustomer, dispatchClearUpdateCustomer } = useCustomerDispatch();
    const { customerCreate, customerUpdate } = useCustomerState();

    useEffect(() => {
        dispatchClearCreateCustomer();
        dispatchClearUpdateCustomer();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        if (isUpdate) {
            form.setFieldsValue({
                name: info?.name,
                plate_number: info?.plate_number,
            });
        } else {
            form.setFieldsValue({
                name: null,
                plate_number: null,
            });
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [info, isUpdate]);

    useEffect(() => {
        if (customerCreate?.done || customerUpdate?.done) {
            if (customerCreate?.error || customerUpdate?.error) {
                notification.error({
                    message: isUpdate ? customerUpdate?.error : customerCreate?.error,
                    placement: "bottomRight",
                    duration: 2.5
                });
            } else {
                if (!isUpdate) {
                    form.setFieldsValue({
                        name: null,
                        plate_number: null,
                    });
                }
                notification.success({
                    message: isUpdate ? "Update success" : "Create success",
                    placement: "bottomRight",
                    duration: 2.5
                });
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [customerCreate.done, customerUpdate.done])

    const onFinish = (e) => {
        if (isUpdate) {
            dispatchUpdateCustomer(info?._id, e);
        } else {
            dispatchCreateCustomer(e);
        }
    };

    return (
        <>
            <h4>{isUpdate ? "Update" : "Create"} customer</h4>
            <div>
                <Loading show={customerCreate?.loading || customerUpdate?.loading}>
                    <Form form={form} colon={false} onFinish={onFinish}>
                        <Form.Item
                            name="plate_number"
                            label="ทะเบียน"
                            rules={[{ required: true }]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            name="name"
                            label="ชื่อลูกค้า"
                            rules={[{ required: true }]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item style={{ float: "right" }}>
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