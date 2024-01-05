import { RoleEntity } from '../entity/role.entity';

export function hasRole(roles: Partial<RoleEntity>[], roleCode: string) {
  const roleCodes = roles.map(item => item.code);
  return roleCodes.includes(roleCode);
}
