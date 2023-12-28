import { rules } from '@ioc:Adonis/Core/Validator';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import { ContactService } from 'App/Services/ContactService';
import { RequestValidationService } from 'App/Util/RequestValidation';
// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class ContactsController {
  public async edit({ request, params }: HttpContextContract) {
    const contactService = new ContactService();

    const data = await RequestValidationService.validateString(
      request,
      'data',
      []
    );

    const contactTypeId = await RequestValidationService.validateNumber(
      request,
      'contactTypeId',
      [rules.exists({ table: 'contact_types', column: 'id' })]
    );

    return contactService.edit(params.id, data, contactTypeId);
  }
}
