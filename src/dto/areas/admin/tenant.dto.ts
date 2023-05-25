import { Rule, RuleType, OmitDto } from '@midwayjs/validate';

export class TenantDTO {
  @Rule(RuleType.string().max(36).required())
  id: string;

  @Rule(RuleType.string().max(100).required())
  name: string;

  @Rule(RuleType.string().max(150))
  description: string;

  @Rule(RuleType.string().max(150))
  address: string;

  @Rule(RuleType.string().max(150))
  country: string;

  @Rule(RuleType.string().max(150))
  province: string;

  @Rule(RuleType.string().max(150))
  city: string;

  @Rule(RuleType.number().min(-90).max(90))
  latitude: number;

  @Rule(RuleType.number().min(-180).max(180))
  longitude: number;

  @Rule(RuleType.boolean())
  enabled: boolean;

  @Rule(RuleType.object())
  options: object;
}

export class CreateTenantDTO extends OmitDto(TenantDTO, ['id']) {}

export class UpdateTenantDTO extends TenantDTO {}
