import { DateTime } from 'luxon';
import Hash from '@ioc:Adonis/Core/Hash';
import { column, beforeSave } from '@ioc:Adonis/Lucid/Orm';
import AppBaseModel from './AppBaseModel';
import { UserStatus } from 'App/Types/UserStatus';

export default class User extends AppBaseModel {
  @column({ isPrimary: true })
  public id: number;

  @column()
  public email: string;

  @column({ serializeAs: null })
  public password: string;

  @column()
  public firstName: string;

  @column()
  public lastName: string;

  @column()
  public rememberMeToken: string | null;

  @column()
  public status: UserStatus;

  @column({ serializeAs: null })
  public confirmationCode: string;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime;

  @beforeSave()
  public static async hashPassword(user: User) {
    if (user.$dirty.password) {
      user.password = await Hash.make(user.password);
    }
  }
}
