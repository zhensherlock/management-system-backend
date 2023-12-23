import { Inject, Provide } from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { EmployeeEntity } from '../entity/employee.entity';
import { Repository } from 'typeorm';
import { BaseService } from './base.service';
import ExcelJS from 'exceljs';
import { EmployeeSex, EmployeeStatus } from '../constant';
import { OrganizationService } from './organization.service';
import dayjs from 'dayjs';

@Provide()
export class EmployeeService extends BaseService<EmployeeEntity> {
  @InjectEntityModel(EmployeeEntity)
  entityModel: Repository<EmployeeEntity>;

  @Inject()
  organizationService: OrganizationService;

  constructor() {
    super();
  }

  async importEmployeeList(url) {
    const workbookReader = new ExcelJS.stream.xlsx.WorkbookReader(url, {});
    for await (const worksheetReader of workbookReader) {
      for await (const row of worksheetReader) {
        if (row.number < 4) {
          continue;
        }
        const entity = {
          name: null,
          sex: null,
          birthday: null,
          idCard: null,
          jobNumber: null,
          nation: null,
          nativePlace: null,
          address: null,
          certificateNumber: null,
          contact: null,
          status: EmployeeStatus.Normal,
          companyOrganizationId: null,
          schoolOrganizationId: null,
        };
        let companyName: string;
        let schoolName: string;
        row.eachCell((cell, cellNumber) => {
          switch (cellNumber) {
            case 1:
              entity.name = cell.text;
              break;
            case 2:
              entity.sex =
                cell.text === '男' ? EmployeeSex.Male : EmployeeSex.Female;
              break;
            case 3:
              entity.idCard = cell.text;
              break;
            case 4:
              entity.contact = cell.text;
              break;
            case 5:
              entity.certificateNumber = cell.text;
              break;
            case 6:
              companyName = cell.text;
              break;
            case 7:
              schoolName = cell.text;
              break;
            case 8:
              entity.jobNumber = cell.text;
              break;
            case 9:
              entity.nation = cell.text;
              break;
            case 10:
              entity.nativePlace = cell.text;
              break;
            case 11:
              entity.birthday = dayjs(cell.text).format('YYYY-MM-DD');
              break;
            case 12:
              entity.address = cell.text;
              break;
          }
        });
        const company = await this.organizationService.getOneObject({
          where: {
            name: companyName,
          },
        });
        entity.companyOrganizationId = company.id;
        if (schoolName) {
          const organization = await this.organizationService.getOneObject({
            where: {
              name: schoolName,
            },
          });
          entity.schoolOrganizationId = organization.id;
        }
        await this.createObject(entity as EmployeeEntity);
      }
    }
  }
}
