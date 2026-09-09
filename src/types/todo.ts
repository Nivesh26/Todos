export interface TodoItem {
  id: number;
  title: string;
  completed: boolean;
  removed: boolean;
}

export type FilterType = 'all' | 'ongoing' | 'completed' | 'removed';

export interface DialogState {
  isOpen: boolean;
  title: string;
  message: string;
  type: 'alert' | 'confirm';
  onConfirm?: () => void;
  onCancel?: () => void;
}
