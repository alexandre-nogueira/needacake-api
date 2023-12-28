import { Exception } from '@adonisjs/core/build/standalone';
import Contact from 'App/Models/Contact';
import { ContactAPIReturn } from 'App/Types/APIReturnFormats';
import { CrudUtilities } from 'App/Util/CrudUtilities';

export class ContactService {
  //Edit Contact
  public async edit(id: number, data: string, contactTypeId: number) {
    let changed = false;
    const crudUtilities = new CrudUtilities();

    const contact = await Contact.findOrFail(id);

    changed = crudUtilities.compareField(data, contact, 'data', changed);
    changed = crudUtilities.compareField(
      contactTypeId,
      contact,
      'contactTypeId',
      changed
    );

    if (!changed)
      throw new Exception('No data changed', 400, 'E_NO_DATA_CHANGED');

    return crudUtilities.formatReturn(
      (await contact.save()).serialize(),
      ContactAPIReturn,
      ['contactType']
    );
  }
}
