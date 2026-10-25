export interface IRegisterUserRequest {
  name: string;
  email: string;
  password: string;
}

export interface IUserResponse {
  id: string;
  name: string;
  email: string;
}

export interface IProfileWorkspaceVM {
  name: string;
  type: string;
  typeColor: string;
}

export interface IProfileRoleVM {
  unitName: string;
  roleName: string;
  roleColor: string;
}