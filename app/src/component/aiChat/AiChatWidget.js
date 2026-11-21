import React, { useEffect, useRef, useState } from 'react';
import { Button, Drawer, Input, Spin, Tag, Tooltip, message as antMessage } from 'antd';
import {
  RobotOutlined,
  SendOutlined,
  PaperClipOutlined,
  DeleteOutlined,
  FilePdfOutlined,
  FileImageOutlined
} from '@ant-design/icons';
import { useResponsive } from '../../hook/useResponsive';
import { downloadInvoicePdf, executeAiAction, sendAiChat } from '../../utils/aiApi';
import ActionConfirmCard from './ActionConfirmCard';
import {
  AttachmentBadgeRow,
  AttachmentChip,
  ChatContainer,
  ComposerArea,
  ComposerRow,
  FloatingAiButton,
  MessageBubble,
  MessageRow,
  MessagesScrollArea,
  PendingFilesBar,
  QuickPromptBar,
  QuickPromptChip
} from './styled-component';

const { TextArea } = Input;

const INITIAL_MESSAGE = {
  id: 'welcome',
  role: 'assistant',
  content:
    'สวัสดีครับ ผมคือ AI Assistant ประจำระบบประกันภัย\nคุณสามารถถามข้อมูลลูกค้า บริษัท ใบวางบิล สั่งสร้าง/แก้ไขข้อมูล หรืออัปโหลดรูป/PDF กรมธรรม์เพื่อให้ผมช่วยสร้างใบวางบิลได้เลยครับ'
};

const QUICK_PROMPTS = [
  'สรุปภาพรวมข้อมูลในระบบ',
  'ดูใบวางบิลล่าสุด 5 ใบ',
  'สร้างใบวางบิลจากรูปกรมธรรม์นี้'
];

const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];

const AiChatWidget = ({ open: controlledOpen, onOpenChange, hideFloatingButton = false }) => {
  const { isMobile } = useResponsive();
  const [internalOpen, setInternalOpen] = useState(false);
  const open = typeof controlledOpen === 'boolean' ? controlledOpen : internalOpen;
  const setOpen = (next) => {
    if (onOpenChange) onOpenChange(next);
    if (typeof controlledOpen !== 'boolean') setInternalOpen(next);
  };
  const [messages, setMessages] = useState([INITIAL_MESSAGE]);
  const [inputText, setInputText] = useState('');
  const [pendingFiles, setPendingFiles] = useState([]);
  const [sending, setSending] = useState(false);

  const fileInputRef = useRef(null);
  const scrollRef = useRef(null);

  useEffect(() => {
    const handleOpenEvent = (e) => {
      setOpen(true);
      if (e?.detail?.prompt) {
        setInputText(e.detail.prompt);
      }
    };
    window.addEventListener('open-ai-copilot', handleOpenEvent);
    return () => window.removeEventListener('open-ai-copilot', handleOpenEvent);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, sending, open]);

  const handleResetChat = () => {
    setMessages([INITIAL_MESSAGE]);
    setPendingFiles([]);
    setInputText('');
  };

  const addFiles = (fileList) => {
    const incoming = Array.from(fileList || []);
    const valid = [];
    for (const f of incoming) {
      if (!ACCEPTED_TYPES.includes(f.type)) {
        antMessage.warning(`ไม่รองรับไฟล์ ${f.name} (รองรับเฉพาะ JPG, PNG, WebP, PDF)`);
        continue;
      }
      if (f.size > 10 * 1024 * 1024) {
        antMessage.warning(`ไฟล์ ${f.name} มีขนาดเกิน 10MB`);
        continue;
      }
      valid.push(f);
    }
    setPendingFiles((prev) => [...prev, ...valid].slice(0, 3));
  };

  const handlePaste = (e) => {
    const items = e.clipboardData?.items;
    if (!items) return;
    const pastedFiles = [];
    for (const item of items) {
      if (item.kind === 'file') {
        const f = item.getAsFile();
        if (f) pastedFiles.push(f);
      }
    }
    if (pastedFiles.length > 0) {
      addFiles(pastedFiles);
    }
  };

  const handleSend = async (overrideText) => {
    const text = (typeof overrideText === 'string' ? overrideText : inputText).trim();
    if (!text && pendingFiles.length === 0) return;
    if (sending) return;

    const userContent = text || 'กรุณาอ่านเอกสารที่แนบมานี้และช่วยสร้างใบวางบิล';
    const userMsg = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: userContent,
      attachmentNames: pendingFiles.map((f) => ({ name: f.name, type: f.type }))
    };

    const nextMessages = [...messages, userMsg];
    setMessages(nextMessages);
    setInputText('');
    const filesToSend = [...pendingFiles];
    setPendingFiles([]);
    setSending(true);

    try {
      const historyPayload = nextMessages
        .filter((m) => m.id !== 'welcome')
        .map((m) => ({ role: m.role, content: m.content }));

      const res = await sendAiChat({
        messages: historyPayload,
        files: filesToSend
      });

      const assistantMsg = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        content: res.message,
        pendingAction: res.pendingAction || null,
        actionStatus: res.pendingAction ? 'pending' : null,
        actionLoading: false,
        actionError: null,
        executedResult: null
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      const errMsg =
        err?.response?.data?.error || err?.message || 'เกิดข้อผิดพลาดในการเชื่อมต่อ AI';
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          role: 'assistant',
          content: `ขออภัย: ${errMsg}`
        }
      ]);
    } finally {
      setSending(false);
    }
  };

  const updateMessageById = (msgId, updater) => {
    setMessages((prev) => prev.map((m) => (m.id === msgId ? updater(m) : m)));
  };

  const handleConfirmAction = async (msg) => {
    updateMessageById(msg.id, (m) => ({ ...m, actionLoading: true, actionError: null }));
    try {
      const result = await executeAiAction({
        type: msg.pendingAction.type,
        payload: msg.pendingAction.payload,
        prerequisiteActions: msg.pendingAction.prerequisiteActions
      });
      updateMessageById(msg.id, (m) => ({
        ...m,
        actionLoading: false,
        actionStatus: 'confirmed',
        executedResult: result
      }));
      antMessage.success(result.message || 'บันทึกข้อมูลสำเร็จ');
    } catch (err) {
      const errMsg =
        err?.response?.data?.error || err?.message || 'ไม่สามารถบันทึกข้อมูลได้';
      updateMessageById(msg.id, (m) => ({
        ...m,
        actionLoading: false,
        actionError: errMsg
      }));
    }
  };

  const handleCancelAction = (msgId) => {
    updateMessageById(msgId, (m) => ({ ...m, actionStatus: 'cancelled' }));
  };

  const handleDownloadPdf = async (invoiceNo) => {
    try {
      await downloadInvoicePdf(invoiceNo);
    } catch (err) {
      antMessage.error('ดาวน์โหลด PDF ไม่สำเร็จ');
    }
  };

  return (
    <>
      {!hideFloatingButton && (
        <FloatingAiButton type="button" onClick={() => setOpen(true)} aria-label="เปิดผู้ช่วย AI">
          <RobotOutlined style={{ fontSize: 18 }} />
          {!isMobile && <span>AI ผู้ช่วย</span>}
        </FloatingAiButton>
      )}

      <Drawer
        title={
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingRight: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <RobotOutlined style={{ fontSize: 18 }} />
              <span>AI Assistant</span>
            </div>
            <Tooltip title="เริ่มแชทใหม่">
              <Button size="small" icon={<DeleteOutlined />} onClick={handleResetChat}>
                ล้างแชท
              </Button>
            </Tooltip>
          </div>
        }
        placement="right"
        visible={open}
        onClose={() => setOpen(false)}
        width={isMobile ? '100%' : 460}
        bodyStyle={{ padding: 0, height: '100%', display: 'flex', flexDirection: 'column' }}
      >
        <ChatContainer>
          <MessagesScrollArea ref={scrollRef}>
            {messages.map((msg) => {
              const isUser = msg.role === 'user';
              return (
                <MessageRow key={msg.id} $isUser={isUser}>
                  {msg.attachmentNames && msg.attachmentNames.length > 0 && (
                    <AttachmentBadgeRow>
                      {msg.attachmentNames.map((att, idx) => (
                        <AttachmentChip key={idx}>
                          {att.type === 'application/pdf' ? <FilePdfOutlined /> : <FileImageOutlined />}
                          <span>{att.name}</span>
                        </AttachmentChip>
                      ))}
                    </AttachmentBadgeRow>
                  )}

                  <MessageBubble $isUser={isUser}>{msg.content}</MessageBubble>

                  {msg.pendingAction && (
                    <ActionConfirmCard
                      action={msg.pendingAction}
                      status={msg.actionStatus}
                      loading={msg.actionLoading}
                      errorMessage={msg.actionError}
                      executedResult={msg.executedResult}
                      onConfirm={() => handleConfirmAction(msg)}
                      onCancel={() => handleCancelAction(msg.id)}
                      onDownloadPdf={handleDownloadPdf}
                    />
                  )}
                </MessageRow>
              );
            })}

            {sending && (
              <MessageRow $isUser={false}>
                <MessageBubble $isUser={false}>
                  <Spin size="small" style={{ marginRight: 8 }} />
                  กำลังวิเคราะห์และค้นหาข้อมูล...
                </MessageBubble>
              </MessageRow>
            )}
          </MessagesScrollArea>

          <QuickPromptBar>
            {QUICK_PROMPTS.map((prompt) => (
              <QuickPromptChip
                key={prompt}
                type="button"
                onClick={() => {
                  if (prompt.includes('รูปกรมธรรม์')) {
                    fileInputRef.current?.click();
                    setInputText(prompt);
                  } else {
                    handleSend(prompt);
                  }
                }}
              >
                {prompt}
              </QuickPromptChip>
            ))}
          </QuickPromptBar>

          <ComposerArea>
            {pendingFiles.length > 0 && (
              <PendingFilesBar>
                {pendingFiles.map((file, idx) => (
                  <Tag
                    key={`${file.name}-${idx}`}
                    closable
                    onClose={() =>
                      setPendingFiles((prev) => prev.filter((_, i) => i !== idx))
                    }
                    icon={
                      file.type === 'application/pdf' ? <FilePdfOutlined /> : <FileImageOutlined />
                    }
                  >
                    {file.name}
                  </Tag>
                ))}
              </PendingFilesBar>
            )}

            <ComposerRow>
              <input
                ref={fileInputRef}
                type="file"
                accept=".jpg,.jpeg,.png,.webp,.pdf"
                multiple
                style={{ display: 'none' }}
                onChange={(e) => {
                  addFiles(e.target.files);
                  e.target.value = '';
                }}
              />
              <Tooltip title="แนบรูปหรือ PDF กรมธรรม์ (สูงสุด 3 ไฟล์)">
                <Button
                  icon={<PaperClipOutlined />}
                  onClick={() => fileInputRef.current?.click()}
                  disabled={sending}
                />
              </Tooltip>
              <TextArea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onPaste={handlePaste}
                onPressEnter={(e) => {
                  if (!e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder="พิมพ์คำถาม สั่งงาน หรือวางรูปกรมธรรม์..."
                autoSize={{ minRows: 1, maxRows: 4 }}
                disabled={sending}
              />
              <Button
                type="primary"
                icon={<SendOutlined />}
                onClick={() => handleSend()}
                loading={sending}
              />
            </ComposerRow>
          </ComposerArea>
        </ChatContainer>
      </Drawer>
    </>
  );
};

export default AiChatWidget;
