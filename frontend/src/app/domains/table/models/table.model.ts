export interface ITableColumn<T> {
  field: string;
  header: string;
  type?: 'text' | 'badge' | 'date' | 'avatar'; 
  badgeClassField?: string;
  badgeIconField?: string;
  avatarInitialsField?: string; 
}

export interface ITableRowMenuConfig {
    edit?: { visible: boolean; label?: string; icon?: string };
    delete?: { visible: boolean; label?: string; icon?: string };
}