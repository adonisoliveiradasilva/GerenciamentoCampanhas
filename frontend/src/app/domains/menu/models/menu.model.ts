export interface IMenuNode {
  label: string;
  icon: string;
  route?: string;
  children?: IMenuNode[];
  requiredPermission?: string;
}