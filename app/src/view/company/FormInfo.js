import { useEffect } from 'react';
import Proptypes from 'prop-types';
import { Form, Input, Button } from 'antd';
import { useCompanyDispatch } from '../../hook/useCompany';

const FormInfo = (props) => {
    const { info, isUpdate } = props;
    const [form] = Form.useForm();
    const { dispatchCreateCompany } = useCompanyDispatch();

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

    const onFinish = (e) => {
        if (isUpdate) {
            console.log("call update")
        } else {
            console.log("call create")
            dispatchCreateCompany(e);
        }
        console.log(info?._id)
        console.log(e)
    };

    return (
        <>
            <h4>Create company</h4>
            <div>
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