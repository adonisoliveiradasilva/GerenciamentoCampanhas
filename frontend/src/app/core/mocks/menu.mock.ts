import { IMenuNode } from '../../domains/menu/models/menu.model';

export const getAppMenu = (role: string): IMenuNode[] => {
  const menu: IMenuNode[] = [];

  // Exemplo de como ficará o menu compartilhado no futuro:
  // menu.push({
  //   label: 'Administração',
  //   icon: 'fa-solid fa-layer-group',
  //   children: [
  //     { label: 'Visão Geral', route: '/dashboard', icon: 'fa-solid fa-chart-pie' },
  //     { label: 'Campanhas', route: '/campanhas', icon: 'fa-solid fa-bullhorn' },
  //     { label: 'Doações', route: '/doacoes', icon: 'fa-solid fa-hand-holding-heart' }
  //   ]
  // });

  menu.push({
    label: 'Administração',
    icon: 'fa-solid fa-layer-group',
    children: [
      { label: 'Visão Geral', route: '/dashboard', icon: 'fa-solid fa-chart-pie' },
      { label: 'Campanhas', route: '/campanhas', icon: 'fa-solid fa-bullhorn' },
      { label: 'Itens', route: '/itens', icon: 'fa-solid fa-box-open' },
      { label: 'Doadores', route: '/doadores', icon: 'fa-solid fa-hand-holding-heart' }
    ]
  });

  if (role === 'Administrador') {
    menu.push({
      label: 'Configurações',
      icon: 'fa-solid fa-gear',
      children: [
        { label: 'Usuários', route: '/usuarios', icon: 'fa-solid fa-users' }
      ]
    });
  }

  return menu;
};