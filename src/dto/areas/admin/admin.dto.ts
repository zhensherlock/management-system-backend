import { Rule, RuleType, OmitDto, PickDto } from '@midwayjs/validate';

export class AdminDTO {
  @Rule(RuleType.string().max(36).required())
  id: string;

  @Rule(RuleType.string().max(100).required())
  name: string;

  @Rule(RuleType.string().email().max(100))
  email: string;

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
  @Rule(
    RuleType.string()
      .max(100)
      .required()
      .pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,10}$/)
  )
  password: string;
}

export class UpdateAdminDTO extends AdminDTO {
  @Rule(RuleType.string().max(100))
  old_password: string;

  @Rule(RuleType.string().max(100).not(RuleType.ref('old_password')))
  new_password: string;

  @Rule(RuleType.string().max(100).valid(RuleType.ref('new_password')))
  repeat_new_password: string;
}

export class UpdateAdminPasswordDTO extends PickDto(AdminDTO, ['id']) {
  @Rule(RuleType.string().max(100).required())
  old_password: string;

  @Rule(
    RuleType.string()
      .max(100)
      .required()
      .pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,10}$/)
      .not(RuleType.ref('old_password'))
  )
  new_password: string;

  @Rule(
    RuleType.string().max(100).required().valid(RuleType.ref('new_password'))
  )
  repeat_new_password: string;
}
