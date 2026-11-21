import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Prompt:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&family=JetBrains+Mono:wght@400;500;600&display=swap');

  *, *::before, *::after {
    box-sizing: border-box;
  }

  body {
    margin: 0;
    padding: 0;
    font-family: 'Prompt', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
    background-color: ${({ theme }) => theme.canvas};
    color: ${({ theme }) => theme.textPrimary};
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    transition: background-color 0.2s cubic-bezier(0.4, 0, 0.2, 1), color 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    overflow-x: hidden;
  }

  h1, h2, h3, h4, h5, h6 {
    color: ${({ theme }) => theme.textPrimary};
    font-weight: 600;
    letter-spacing: -0.015em;
    margin-bottom: 0.5rem;
  }

  p {
    color: ${({ theme }) => theme.textSecondary};
    line-height: 1.6;
  }

  label {
    color: ${({ theme }) => theme.textPrimary};
  }

  a {
    color: ${({ theme }) => theme.brandPrimary};
    text-decoration: none;
    transition: opacity 0.2s ease;

    &:hover {
      opacity: 0.85;
    }
  }

  .tabular-nums {
    font-variant-numeric: tabular-nums;
  }

  /* =========================================================
     Enterprise Portal Button Styles
     ========================================================= */
  .ant-btn {
    border-radius: ${({ theme }) => theme.btnRadius} !important;
    font-weight: 500 !important;
    height: 36px !important;
    padding: 0 14px !important;
    display: inline-flex !important;
    align-items: center !important;
    justify-content: center !important;
    gap: 6px !important;
    font-size: 13.5px !important;
    letter-spacing: -0.01em !important;
    transition: all 0.16s cubic-bezier(0.4, 0, 0.2, 1) !important;
    border: 1px solid transparent !important;

    &.ant-btn-sm {
      height: 28px !important;
      padding: 0 10px !important;
      font-size: 12.5px !important;
    }

    > span {
      color: inherit !important;
    }
  }

  /* Primary Button (Apple style: solid high-contrast pill) */
  .ant-btn-primary {
    background-color: ${({ theme }) => theme.brandPrimary} !important;
    border-color: ${({ theme }) => theme.brandPrimary} !important;
    color: ${({ theme }) => theme.brandPrimaryText} !important;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12) !important;

    > span, .anticon {
      color: ${({ theme }) => theme.brandPrimaryText} !important;
    }

    &:hover, &:focus {
      background-color: ${({ theme }) => theme.brandHover} !important;
      border-color: ${({ theme }) => theme.brandHover} !important;
      color: ${({ theme }) => theme.brandPrimaryText} !important;
      transform: translateY(-1px);
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.16) !important;

      > span, .anticon {
        color: ${({ theme }) => theme.brandPrimaryText} !important;
      }
    }

    &:active {
      transform: translateY(0);
    }
  }

  /* Secondary / Default Button (AntD v4 renders plain .ant-btn without .ant-btn-default) */
  .ant-btn:not(.ant-btn-primary):not(.ant-btn-text):not(.ant-btn-link):not(.ant-btn-dashed):not(.ant-btn-dangerous),
  .ant-btn-default {
    background-color: ${({ theme }) => theme.surfaceSubtle} !important;
    border-color: ${({ theme }) => theme.border} !important;
    color: ${({ theme }) => theme.textPrimary} !important;
    box-shadow: ${({ theme }) => theme.shadowSm} !important;

    > span, .anticon {
      color: ${({ theme }) => theme.textPrimary} !important;
    }

    &:hover, &:focus {
      background-color: ${({ theme }) => theme.surfaceHover} !important;
      border-color: ${({ theme }) => theme.brandPrimary} !important;
      color: ${({ theme }) => theme.textPrimary} !important;

      > span, .anticon {
        color: ${({ theme }) => theme.textPrimary} !important;
      }
    }
  }

  /* Danger Button */
  .ant-btn-dangerous.ant-btn-primary {
    background-color: #EF4444 !important;
    border-color: #EF4444 !important;
    color: #FFFFFF !important;

    > span, .anticon {
      color: #FFFFFF !important;
    }

    &:hover, &:focus {
      background-color: #DC2626 !important;
      border-color: #DC2626 !important;
    }
  }

  .ant-btn-dangerous:not(.ant-btn-primary):not(.ant-btn-text):not(.ant-btn-link) {
    background-color: ${({ theme }) => (theme.mode === 'dark' ? 'rgba(239, 68, 68, 0.12)' : '#FEF2F2')} !important;
    border-color: ${({ theme }) => (theme.mode === 'dark' ? 'rgba(239, 68, 68, 0.3)' : '#FCA5A5')} !important;
    color: #EF4444 !important;

    > span, .anticon {
      color: #EF4444 !important;
    }

    &:hover, &:focus {
      background-color: #EF4444 !important;
      border-color: #EF4444 !important;
      color: #FFFFFF !important;

      > span, .anticon {
        color: #FFFFFF !important;
      }
    }
  }

  .ant-btn-text.ant-btn-dangerous {
    background-color: transparent !important;
    border-color: transparent !important;
    color: #EF4444 !important;

    > span, .anticon {
      color: #EF4444 !important;
    }

    &:hover, &:focus {
      background-color: ${({ theme }) => theme.statusDangerBg} !important;
      color: #EF4444 !important;
    }
  }

  /* Text Button */
  .ant-btn-text {
    background-color: transparent !important;
    color: ${({ theme }) => theme.textSecondary} !important;

    > span, .anticon {
      color: inherit !important;
    }

    &:hover, &:focus {
      background-color: ${({ theme }) => theme.surfaceHover} !important;
      color: ${({ theme }) => theme.textPrimary} !important;
    }
  }

  /* Dashed Button */
  .ant-btn-dashed {
    background-color: transparent !important;
    border: 1px dashed ${({ theme }) => theme.border} !important;
    color: ${({ theme }) => theme.textPrimary} !important;

    > span, .anticon {
      color: ${({ theme }) => theme.textPrimary} !important;
    }

    &:hover, &:focus {
      background-color: ${({ theme }) => theme.surfaceHover} !important;
      border-color: ${({ theme }) => (theme.mode === 'dark' ? '#52525B' : '#71717A')} !important;
      color: ${({ theme }) => theme.textPrimary} !important;

      > span, .anticon {
        color: ${({ theme }) => theme.textPrimary} !important;
      }
    }
  }

  /* =========================================================
     Card & Table Styling
     ========================================================= */
  .ant-card {
    background: ${({ theme }) => theme.surface} !important;
    border-radius: ${({ theme }) => theme.cardRadius} !important;
    border: 1px solid ${({ theme }) => theme.border} !important;
    box-shadow: ${({ theme }) => theme.shadowSm} !important;

    .ant-card-head {
      border-bottom: 1px solid ${({ theme }) => theme.border} !important;
      color: ${({ theme }) => theme.textPrimary} !important;
      font-weight: 600;
      font-size: 15px;
      padding: 0 20px;
    }

    .ant-card-body {
      padding: 20px;
    }

    .ant-statistic-title {
      color: ${({ theme }) => theme.textSecondary} !important;
      font-size: 13px;
      font-weight: 500;
      letter-spacing: 0.2px;
    }

    .ant-statistic-content {
      color: ${({ theme }) => theme.textPrimary} !important;
      font-weight: 700;
      font-size: 26px;
      letter-spacing: -0.02em;
    }
  }

  .ant-table {
    background: ${({ theme }) => theme.surface} !important;
    color: ${({ theme }) => theme.textPrimary} !important;
    border-radius: 0 0 ${({ theme }) => theme.cardRadius} ${({ theme }) => theme.cardRadius} !important;

    .ant-table-thead > tr > th {
      background: ${({ theme }) => theme.surfaceSubtle} !important;
      color: ${({ theme }) => theme.textSecondary} !important;
      border-bottom: 1px solid ${({ theme }) => theme.border} !important;
      font-weight: 600;
      font-size: 11.5px;
      text-transform: uppercase;
      letter-spacing: 0.4px;
      padding: 10px 14px;
    }

    .ant-table-tbody > tr > td {
      border-bottom: 1px solid ${({ theme }) => theme.borderSubtle} !important;
      color: ${({ theme }) => theme.textPrimary} !important;
      background: ${({ theme }) => theme.surface} !important;
      padding: 11px 14px;
      font-size: 13.5px;
      transition: background-color 0.15s ease;
    }

    .ant-table-tbody > tr:hover > td {
      background: ${({ theme }) => theme.surfaceHover} !important;
    }
  }

  /* Table Pagination */
  .ant-pagination {
    margin: 16px 20px !important;
  }

  .ant-pagination-item {
    background: ${({ theme }) => theme.surface} !important;
    border-color: ${({ theme }) => theme.border} !important;
    border-radius: 6px !important;

    a {
      color: ${({ theme }) => theme.textSecondary} !important;
      font-size: 13px;
    }

    &-active {
      border-color: ${({ theme }) => (theme.mode === 'dark' ? '#3F3F46' : '#18181B')} !important;
      background: ${({ theme }) => (theme.mode === 'dark' ? '#27272A' : '#18181B')} !important;

      a {
        color: #FFFFFF !important;
        font-weight: 600;
      }
    }
  }

  .ant-pagination-prev .ant-pagination-item-link,
  .ant-pagination-next .ant-pagination-item-link {
    background: ${({ theme }) => theme.surface} !important;
    border-color: ${({ theme }) => theme.border} !important;
    color: ${({ theme }) => theme.textSecondary} !important;
    border-radius: 6px !important;
  }

  /* =========================================================
     Form Controls (Inputs, Selects, Modals)
     ========================================================= */
  .ant-input,
  .ant-input-number,
  .ant-input-affix-wrapper,
  .ant-picker {
    background-color: ${({ theme }) => (theme.mode === 'dark' ? theme.surfaceSubtle : '#FFFFFF')} !important;
    border: 1px solid ${({ theme }) => theme.border} !important;
    color: ${({ theme }) => theme.textPrimary} !important;
    border-radius: ${({ theme }) => theme.inputRadius} !important;
    min-height: 36px;
    font-size: 13.5px;

    input {
      background-color: transparent !important;
      color: ${({ theme }) => theme.textPrimary} !important;
    }

    &::placeholder, input::placeholder {
      color: ${({ theme }) => theme.textMuted} !important;
    }

    &:focus, &:hover, &-focused {
      border-color: ${({ theme }) => theme.brandPrimary} !important;
      box-shadow: 0 0 0 3px ${({ theme }) => (theme.mode === 'dark' ? 'rgba(59, 130, 246, 0.2)' : 'rgba(37, 99, 235, 0.12)')} !important;
    }
  }

  /* Prevent double border on inner input inside .ant-input-affix-wrapper */
  .ant-input-affix-wrapper > input.ant-input {
    border: none !important;
    box-shadow: none !important;
    background: transparent !important;
    min-height: auto !important;
    padding: 0 !important;
    border-radius: 0 !important;

    &:focus, &:hover {
      border: none !important;
      box-shadow: none !important;
    }
  }

  .ant-input[disabled] {
    background-color: ${({ theme }) => (theme.mode === 'dark' ? '#202024' : '#F4F4F5')} !important;
    color: ${({ theme }) => theme.textMuted} !important;
    border-color: ${({ theme }) => theme.border} !important;
  }

  .ant-select:not(.ant-select-customize-input) .ant-select-selector {
    background-color: ${({ theme }) => (theme.mode === 'dark' ? '#18181B' : '#FFFFFF')} !important;
    border: 1px solid ${({ theme }) => theme.border} !important;
    color: ${({ theme }) => theme.textPrimary} !important;
    border-radius: ${({ theme }) => theme.inputRadius} !important;
    min-height: 40px;
    display: flex;
    align-items: center;
  }

  .ant-select-dropdown {
    background-color: ${({ theme }) => theme.surface} !important;
    border: 1px solid ${({ theme }) => theme.border} !important;
    box-shadow: ${({ theme }) => theme.shadowLg} !important;
    border-radius: 10px !important;
    padding: 6px !important;

    .ant-select-item {
      color: ${({ theme }) => theme.textPrimary} !important;
      border-radius: 6px;
      
      &-option-selected:not(.ant-select-item-option-disabled) {
        background-color: ${({ theme }) => theme.brandBg} !important;
        font-weight: 600;
      }

      &-option-active:not(.ant-select-item-option-disabled) {
        background-color: ${({ theme }) => theme.surfaceHover} !important;
      }
    }
  }

  .ant-form-item-label > label {
    color: ${({ theme }) => theme.textPrimary} !important;
    font-weight: 500;
    font-size: 13px;
    letter-spacing: -0.01em;
  }

  .ant-form-item-optional {
    color: ${({ theme }) => theme.textSecondary} !important;
    font-weight: 400;
  }

  .ant-form-item-explain,
  .ant-form-item-extra {
    color: ${({ theme }) => theme.textSecondary} !important;
    font-size: 12px;
  }

  .ant-picker-suffix {
    color: ${({ theme }) => theme.textSecondary} !important;
  }

  /* Drawer & Modal */
  .ant-drawer-content {
    background-color: ${({ theme }) => theme.surface} !important;
    color: ${({ theme }) => theme.textPrimary} !important;
  }

  .ant-drawer-header {
    background-color: ${({ theme }) => theme.surface} !important;
    border-bottom: 1px solid ${({ theme }) => theme.border} !important;
    padding: 18px 24px !important;

    .ant-drawer-title {
      color: ${({ theme }) => theme.textPrimary} !important;
      font-weight: 600;
      font-size: 16px;
    }
  }

  .ant-drawer-close {
    color: ${({ theme }) => theme.textSecondary} !important;

    &:hover {
      color: ${({ theme }) => theme.textPrimary} !important;
    }
  }

  .ant-modal-content {
    background-color: ${({ theme }) => theme.surface} !important;
    border-radius: 16px !important;
    border: 1px solid ${({ theme }) => theme.border} !important;
    box-shadow: ${({ theme }) => theme.shadowLg} !important;
    color: ${({ theme }) => theme.textPrimary} !important;
  }

  .ant-modal-header {
    background-color: ${({ theme }) => theme.surface} !important;
    border-bottom: 1px solid ${({ theme }) => theme.border} !important;
    border-radius: 16px 16px 0 0 !important;

    .ant-modal-title {
      color: ${({ theme }) => theme.textPrimary} !important;
      font-weight: 600;
    }
  }

  .ant-modal-confirm-title,
  .ant-modal-confirm-content {
    color: ${({ theme }) => theme.textPrimary} !important;
  }

  .ant-radio-button-wrapper {
    background: ${({ theme }) => theme.surface} !important;
    border-color: ${({ theme }) => theme.border} !important;
    color: ${({ theme }) => theme.textPrimary} !important;

    &-checked:not(.ant-radio-button-wrapper-disabled) {
      background: ${({ theme }) => theme.brandPrimary} !important;
      border-color: ${({ theme }) => theme.brandPrimary} !important;
      color: ${({ theme }) => theme.brandPrimaryText} !important;
    }
  }

  .ant-checkbox-inner {
    border-radius: 4px !important;
    background-color: ${({ theme }) => (theme.mode === 'dark' ? '#18181B' : '#FFFFFF')} !important;
    border-color: ${({ theme }) => theme.border} !important;
  }

  .ant-checkbox-checked .ant-checkbox-inner {
    background-color: ${({ theme }) => (theme.mode === 'dark' ? '#FAFAFA' : '#18181B')} !important;
    border-color: ${({ theme }) => (theme.mode === 'dark' ? '#FAFAFA' : '#18181B')} !important;

    &::after {
      border-color: ${({ theme }) => (theme.mode === 'dark' ? '#09090B' : '#FFFFFF')} !important;
    }
  }

  .ant-checkbox-wrapper {
    color: ${({ theme }) => theme.textPrimary} !important;
  }

  /* Custom Scrollbar */
  ::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }

  ::-webkit-scrollbar-track {
    background: transparent;
  }

  ::-webkit-scrollbar-thumb {
    background: ${({ theme }) => (theme.mode === 'dark' ? '#27272A' : '#D4D4D8')};
    border-radius: 9999px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: ${({ theme }) => (theme.mode === 'dark' ? '#3F3F46' : '#A1A1AA')};
  }
`;
