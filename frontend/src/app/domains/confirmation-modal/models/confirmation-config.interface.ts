export interface IConfirmationConfig {
  title?: string;
  subtitle?: string;
  message: string;

  type?: 'danger' | 'warning' | 'info' | 'success';

  confirmText?: string;
  cancelText?: string;

  confirmIcon?: string;
  cancelIcon?: string;

  icon?: string;
}