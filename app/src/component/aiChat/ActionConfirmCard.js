import React from 'react';
import PropTypes from 'prop-types';
import { Alert, Button, Tag } from 'antd';
import {
  CheckOutlined,
  CloseOutlined,
  DownloadOutlined,
  CheckCircleFilled
} from '@ant-design/icons';
import {
  ConfirmCard,
  ConfirmCardHeader,
  ConfirmKeyValueGrid,
  FinanceSummaryBox,
  ConfirmActionsRow
} from './styled-component';

const formatMoney = (val) => {
  const num = Number(val || 0);
  return new Intl.NumberFormat('th-TH', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(num);
};

const ActionConfirmCard = ({
  action,
  status,
  loading,
  errorMessage,
  executedResult,
  onConfirm,
  onCancel,
  onDownloadPdf
}) => {
  const { type, mode, title, warnings, prerequisiteActions, payload, preview } = action;

  const renderDetails = () => {
    if (type === 'CREATE_CUSTOMER') {
      return (
        <ConfirmKeyValueGrid>
          <span className="label">ทะเบียนรถ:</span>
          <span className="value">{payload.plate_number}</span>
          <span className="label">ชื่อลูกค้า:</span>
          <span className="value">{payload.name}</span>
        </ConfirmKeyValueGrid>
      );
    }

    if (type === 'UPDATE_CUSTOMER') {
      return (
        <ConfirmKeyValueGrid>
          <span className="label">ทะเบียนรถ:</span>
          <span className="value">
            {preview?.before?.plate_number} → {payload.plate_number}
          </span>
          <span className="label">ชื่อลูกค้า:</span>
          <span className="value">
            {preview?.before?.name} → {payload.name}
          </span>
        </ConfirmKeyValueGrid>
      );
    }

    if (type === 'CREATE_COMPANY') {
      return (
        <ConfirmKeyValueGrid>
          <span className="label">รหัสผู้เสียภาษี:</span>
          <span className="value">{payload.id_company}</span>
          <span className="label">ชื่อบริษัท:</span>
          <span className="value">{payload.name}</span>
          <span className="label">ที่อยู่:</span>
          <span className="value">{payload.address}</span>
        </ConfirmKeyValueGrid>
      );
    }

    if (type === 'UPDATE_COMPANY') {
      return (
        <ConfirmKeyValueGrid>
          <span className="label">รหัสผู้เสียภาษี:</span>
          <span className="value">{payload.id_company}</span>
          <span className="label">ชื่อบริษัท:</span>
          <span className="value">{payload.name}</span>
          <span className="label">ที่อยู่:</span>
          <span className="value">{payload.address}</span>
        </ConfirmKeyValueGrid>
      );
    }

    if (type === 'UPSERT_INVOICE') {
      return (
        <>
          <ConfirmKeyValueGrid>
            <span className="label">เลขที่ใบวางบิล:</span>
            <span className="value">{payload.invoice_no}</span>
            <span className="label">ทะเบียนรถ:</span>
            <span className="value">{payload.plate_no}</span>
            <span className="label">ลูกค้า:</span>
            <span className="value">{preview?.customer_name}</span>
            <span className="label">บริษัทประกัน:</span>
            <span className="value">{preview?.company_name}</span>
            <span className="label">ประเภท / ทุน:</span>
            <span className="value">
              {payload.insurance_type} ({payload.insurance_amount})
            </span>
            <span className="label">เลขกรมธรรม์:</span>
            <span className="value">{payload.insurance_no}</span>
            {payload.act_no ? (
              <>
                <span className="label">เลข พ.ร.บ.:</span>
                <span className="value">{payload.act_no}</span>
              </>
            ) : null}
            <span className="label">คุ้มครอง:</span>
            <span className="value">
              {payload.start_date} ถึง {payload.end_date}
            </span>
            <span className="label">ผู้เอาประกัน:</span>
            <span className="value">
              {payload.is_company ? 'นิติบุคคล (หัก ณ ที่จ่าย 1%)' : 'บุคคลธรรมดา'}
            </span>
          </ConfirmKeyValueGrid>

          <FinanceSummaryBox>
            <div className="row">
              <span>เบี้ยประกันสุทธิ</span>
              <span>{formatMoney(payload.amount)} บาท</span>
            </div>
            {payload.amount_act ? (
              <div className="row">
                <span>เบี้ย พ.ร.บ.</span>
                <span>{formatMoney(payload.amount_act)} บาท</span>
              </div>
            ) : null}
            <div className="row">
              <span>อากรแสตมป์</span>
              <span>{formatMoney(payload.amount_stamp)} บาท</span>
            </div>
            <div className="row">
              <span>รวมก่อน VAT</span>
              <span>{formatMoney(preview?.total_amount_1)} บาท</span>
            </div>
            <div className="row">
              <span>VAT 7%</span>
              <span>{formatMoney(preview?.vat_7)} บาท</span>
            </div>
            {payload.is_company ? (
              <div className="row">
                <span>หัก ณ ที่จ่าย 1%</span>
                <span>-{formatMoney(preview?.vat_at_paid)} บาท</span>
              </div>
            ) : null}
            <div className="row total">
              <span>ยอดสุทธิที่ต้องชำระ</span>
              <span>{formatMoney(preview?.total_amount_3)} บาท</span>
            </div>
          </FinanceSummaryBox>
        </>
      );
    }

    if (type === 'UPSERT_QUOTATION') {
      const items = preview?.items || [];
      return (
        <>
          <ConfirmKeyValueGrid>
            <span className="label">วันที่ออก:</span>
            <span className="value">{payload.issue_date}</span>
            <span className="label">จำนวนรายการ:</span>
            <span className="value">{items.length} คัน</span>
          </ConfirmKeyValueGrid>
          <FinanceSummaryBox>
            {items.map((item, idx) => (
              <div className="row" key={idx}>
                <span>
                  {item.plate_number} ({item.company_name})
                </span>
                <span>{formatMoney(item.amount)} บาท</span>
              </div>
            ))}
          </FinanceSummaryBox>
        </>
      );
    }

    return null;
  };

  return (
    <ConfirmCard>
      <ConfirmCardHeader>
        <span>{title}</span>
        <Tag color={mode === 'create' ? 'blue' : 'orange'}>
          {mode === 'create' ? 'สร้างใหม่' : 'แก้ไข'}
        </Tag>
      </ConfirmCardHeader>

      {warnings && warnings.length > 0 && (
        <Alert
          type="warning"
          showIcon
          message={warnings.join(' • ')}
          style={{ fontSize: '12px', padding: '6px 10px' }}
        />
      )}

      {prerequisiteActions && prerequisiteActions.length > 0 && (
        <Alert
          type="info"
          showIcon
          message={`จะสร้างข้อมูลประกอบอัตโนมัติ: ${prerequisiteActions
            .map((p) => p.title)
            .join(', ')}`}
          style={{ fontSize: '12px', padding: '6px 10px' }}
        />
      )}

      {renderDetails()}

      {errorMessage && (
        <Alert
          type="error"
          showIcon
          message={errorMessage}
          style={{ fontSize: '12px', padding: '6px 10px' }}
        />
      )}

      {status === 'pending' && (
        <ConfirmActionsRow>
          <Button size="small" icon={<CloseOutlined />} onClick={onCancel} disabled={loading}>
            ยกเลิก
          </Button>
          <Button
            type="primary"
            size="small"
            icon={<CheckOutlined />}
            onClick={onConfirm}
            loading={loading}
          >
            ยืนยันและบันทึก
          </Button>
        </ConfirmActionsRow>
      )}

      {status === 'confirmed' && (
        <ConfirmActionsRow style={{ justifyContent: 'space-between' }}>
          <span style={{ color: '#10B981', fontSize: '13px', fontWeight: 600 }}>
            <CheckCircleFilled style={{ marginRight: 6 }} />
            บันทึกเรียบร้อยแล้ว
          </span>
          {executedResult?.downloadPdfUrl && payload.invoice_no && (
            <Button
              type="primary"
              size="small"
              icon={<DownloadOutlined />}
              onClick={() => onDownloadPdf(payload.invoice_no)}
            >
              ดาวน์โหลด PDF
            </Button>
          )}
        </ConfirmActionsRow>
      )}

      {status === 'cancelled' && (
        <div style={{ fontSize: '12px', color: '#A1A1AA', textAlign: 'right' }}>
          ยกเลิกคำสั่งนี้แล้ว
        </div>
      )}
    </ConfirmCard>
  );
};

ActionConfirmCard.propTypes = {
  action: PropTypes.object.isRequired,
  status: PropTypes.oneOf(['pending', 'confirmed', 'cancelled']).isRequired,
  loading: PropTypes.bool,
  errorMessage: PropTypes.string,
  executedResult: PropTypes.object,
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  onDownloadPdf: PropTypes.func.isRequired
};

export default ActionConfirmCard;
