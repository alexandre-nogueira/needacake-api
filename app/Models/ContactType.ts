import { DateTime } from 'luxon';
import { column } from '@ioc:Adonis/Lucid/Orm';
import AppBaseModel from './AppBaseModel';

export default class ContactType extends AppBaseModel {
  @column({ isPrimary: true })
  public id: number;

  @column()
  public description: string;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime;
}
