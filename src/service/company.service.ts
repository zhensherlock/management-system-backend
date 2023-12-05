import { Provide } from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { CompanyEntity } from '../entity/company.entity';
import { Repository } from 'typeorm';
import { BaseService } from './base.service';
import ExcelJS from 'exceljs';

@Provide()
export class CompanyService extends BaseService<CompanyEntity> {
  @InjectEntityModel(CompanyEntity)
  entityModel: Repository<CompanyEntity>;

  constructor() {
    super();
  }

  async importList(url) {
    const workbookReader = new ExcelJS.stream.xlsx.WorkbookReader(url, {});
    for await (const worksheetReader of workbookReader) {
      for await (const row of worksheetReader) {
        if (row.number === 1) {
          continue;
        }
        const entity = {
          name: '',
          person: '',
          contact: '',
          address: '',
          enabled: true,
        };
        row.eachCell((cell, cellNumber) => {
          switch (cellNumber) {
            case 1:
              entity.name = cell.text;
              break;
            case 2:
              entity.person = cell.text;
              break;
            case 3:
              entity.contact = cell.text;
              break;
            case 4:
              entity.address = cell.text;
              break;
          }
        });
        if (await this.checkNameExisted(entity.name)) {
          continue;
        }
        await this.createObject(<CompanyEntity>entity);
      }
    }
  }
}
