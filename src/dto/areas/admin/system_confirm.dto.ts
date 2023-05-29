import { OmitDto, Rule, RuleType } from '@midwayjs/validate';

export class SystemConfigDTO {
  @Rule(RuleType.string().max(36).required())
  id: string;

  @Rule(RuleType.string().max(100).required())
  name: string;

  @Rule(RuleType.string().max(150))
  description: string;

  @Rule(RuleType.object())
  options: object;
}

export class UpdateSystemConfigDTO extends OmitDto(SystemConfigDTO, ['id']) {}
