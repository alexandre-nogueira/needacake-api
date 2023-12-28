import { Exception } from '@adonisjs/core/build/standalone';
import ContactType from 'App/Models/ContactType';
import { ContactTypeAPIReturn } from 'App/Types/APIReturnFormats';
import { CrudUtilities } from 'App/Util/CrudUtilities';

export class ContactTypeService {
  public async create(contactType: ContactType) {
    const crudUtilities = new CrudUtilities();
    return crudUtilities.formatReturn(
      await contactType.save(),
      ContactTypeAPIReturn
    );
  }

  public async edit(id: number, description: string) {
    let changed = false;
    const crudUtilities = new CrudUtilities();

    const contactType = await ContactType.query().where('id', id).first();

    changed = crudUtilities.compareField(
      description,
      contactType,
      'description',
      changed
    );

    if (!changed)
      throw new Exception('No data changed', 400, 'E_NO_DATA_CHANGED');

    if (contactType) {
      return crudUtilities.formatReturn(
        await contactType.save(),
        ContactTypeAPIReturn
      );
    }
  }

  private async getRaw(id: number) {
    const contactType = await ContactType.query().where('id', id).first();
    if (!contactType) {
      throw new Exception(
        'Contact Type does not exist',
        400,
        'E_ENTITY_DOES_NOT_EXIST'
      );
    }
    return contactType;
  }

  public async get(id: number) {
    const crudUtilities = new CrudUtilities();
    const contactType = await this.getRaw(id);
    return crudUtilities.formatReturn(contactType, ContactTypeAPIReturn);
  }

  public async getList() {
    return await ContactType.query().select(ContactTypeAPIReturn);
  }

  public async delete(id: number) {
    const crudUtilities = new CrudUtilities();
    const contactType = await this.getRaw(id);
    await contactType.delete();
    return crudUtilities.formatReturn(contactType, ContactTypeAPIReturn);
  }
}
