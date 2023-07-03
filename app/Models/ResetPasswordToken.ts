import { DateTime } from 'luxon';
import { BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm';
import AppBaseModel from './AppBaseModel';
import User from './User';
import { TokenStatus } from 'App/Types/TokenStatus';

export default class ResetPasswordToken extends AppBaseModel {
  @column({ isPrimary: true })
  public id: number;

  @column()
  public userId: number;

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>;

  @column()
  public token: string;

  @column.dateTime()
  public expiresAt: DateTime;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime;

  @column()
  public status: TokenStatus;
}
