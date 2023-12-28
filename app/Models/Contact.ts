import { DateTime } from 'luxon';
import {
  BelongsTo,
  ManyToMany,
  belongsTo,
  column,
  manyToMany,
} from '@ioc:Adonis/Lucid/Orm';
import AppBaseModel from './AppBaseModel';
import ContactType from './ContactType';

export default class Contact extends AppBaseModel {
  @column({ isPrimary: true })
  public id: number;

  @column()
  public data: string;

  @column()
  public contactTypeId: number;

  @belongsTo(() => ContactType)
  public contactType: BelongsTo<typeof ContactType>;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime;
}
