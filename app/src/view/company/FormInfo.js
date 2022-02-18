import { useEffect } from 'react';
import Proptypes from 'prop-types';
import { Form, Input, Button, notification } from 'antd';
import { useCompanyDispatch, useCompanyState } from '../../hook/useCompany';
import Loading from '../../component/loading/Loading';

const FormInfo = (props) => {
    const { info, isUpdate } = props;
    const [form] = Form.useForm();
    const { dispatchCreateCompany, dispatchClearCreateCompany, dispatchUpdateCompany, dispatchClearUpdateCompany } = useCompanyDispatch();
    const { companyCreate, companyUpdate } = useCompanyState();

    useEffect(() => {
        dispatchClearCreateCompany();
        dispatchClearUpdateCompany();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        if (isUpdate) {
            form.setFieldsValue({
                name: info?.name,
                id_company: info?.id_company,
                address: info?.address,
            });
        } else {
            form.setFieldsValue({
                name: null,
                id_company: null,
                address: null,
            });
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [info, isUpdate]);

    useEffect(() => {
        if (companyCreate?.done || companyUpdate?.done) {
            if (companyCreate?.error || companyUpdate?.error) {
                notification.error({
                    message: isUpdate ? companyUpdate?.error : companyCreate?.error,
                    placement: "bottomRight",
                    duration: 2.5
                });
            } else {
                if (!isUpdate) {
                    form.setFieldsValue({
                        name: null,
                        id_company: null,
                        address: null,
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
    }, [companyCreate.done, companyUpdate.done])

    const onFinish = (e) => {
        if (isUpdate) {
            dispatchUpdateCompany(info?._id, e);
        } else {
            dispatchCreateCompany(e);
        }
    };

    return (
        <>
            <h4>{isUpdate ? "Update" : "Create"} company</h4>
            <div>
                <Loading show={companyCreate?.loading || companyUpdate?.loading}>
                    <Form form={form} colon={false} onFinish={onFinish}>
                        <Form.Item
                            name="id_company"
                            label="เลขผู้เสียภาษี"
                            rules={[{ required: true }]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            name="name"
                            label="ชื่อบริษัท"
                            rules={[{ required: true }]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            name="address"
                            label="ที่อยู่"
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