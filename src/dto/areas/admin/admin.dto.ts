import { Rule, RuleType, OmitDto } from '@midwayjs/validate';

export class AdminDTO {
  @Rule(RuleType.string().max(36).required())
  id: string;

  @Rule(RuleType.string().max(100).required())
  name: string;

  @Rule(RuleType.string().max(100))
  realName: string;

  @Rule(RuleType.string().max(150))
  description: string;

  @Rule(RuleType.boolean())
  enabled: boolean;

  @Rule(RuleType.object())
  options: object;
}

export class CreateAdminDTO extends OmitDto(AdminDTO, ['id']) {
  @Rule(RuleType.string().max(100).required())
  password: string;
}

export class UpdateAdminDTO extends AdminDTO {
  @Rule(RuleType.string().max(100))
  old_password: string;

  @Rule(RuleType.string().max(100))
  new_password: string;

  @Rule(RuleType.string().max(100))
  sure_new_password: string;
}
