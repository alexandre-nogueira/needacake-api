import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import ContactType from 'App/Models/ContactType';
import { ContactTypeService } from 'App/Services/ContactTypeService';
import { RequestValidationService } from 'App/Util/RequestValidation';
// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class ContactTypesController {
  public async create({ request }: HttpContextContract) {
    const contactType = new ContactType();
    const contactTypeService = new ContactTypeService();

    contactType.description = await RequestValidationService.validateString(
      request,
      'description',
      []
    );

    return await contactTypeService.create(contactType);
  }

  public async edit({ request, params }: HttpContextContract) {
    const contactTypeService = new ContactTypeService();

    const description = await RequestValidationService.validateString(
      request,
      'description',
      []
    );

    return await contactTypeService.edit(params.id, description);
  }

  public async getSingle({ params }: HttpContextContract) {
    const contactTypeService = new ContactTypeService();
    return await contactTypeService.get(params.id);
  }

  public async getList() {
    const contactTypeService = new ContactTypeService();
    return await contactTypeService.getList();
  }

  public async delete({ params }: HttpContextContract) {
    const contactTypeService = new ContactTypeService();

    return await contactTypeService.delete(params.id);
  }
}
