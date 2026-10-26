import { IMenuNode } from '../../domains/menu/models/menu.model';

export const MENU_MOCK: IMenuNode[] = [
  // {
  //   label: 'Administração',
  //   icon: 'fa-solid fa-layer-group',
  //   children: [
  //     { label: 'Visão Geral', route: '/dashboard', icon: 'fa-solid fa-chart-pie' },
  //     { label: 'Campanhas', route: '/campanhas', icon: 'fa-solid fa-bullhorn' },
  //     { label: 'Doações', route: '/doacoes', icon: 'fa-solid fa-hand-holding-heart' }
  //   ]
  // },
  {
    label: 'Configurações',
    icon: 'fa-solid fa-gear',
    children: [
      { label: 'Usuários', route: '/usuarios', icon: 'fa-solid fa-users' },
    ]
  }
];