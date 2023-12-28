import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import User from 'App/Models/User';

import { UserService } from 'App/Services/UserService';
import { rules } from '@ioc:Adonis/Core/Validator';
import { RequestValidationService } from 'App/Util/RequestValidation';
import Contact from 'App/Models/Contact';

export default class UsersController {
  //Register new user
  public async register({ response, request, auth }: HttpContextContract) {
    const userService = new UserService();
    const user: User = new User();

    user.email = await RequestValidationService.validateString(
      request,
      'email',
      [rules.email(), rules.unique({ table: 'users', column: 'email' })]
    );

    user.firstName = await RequestValidationService.validateString(
      request,
      'firstName',
      [rules.minLength(2), rules.maxLength(120)]
    );

    user.lastName = await RequestValidationService.validateString(
      request,
      'lastName',
      [rules.minLength(2), rules.maxLength(120)]
    );

    user.password = await RequestValidationService.validateString(
      request,
      'password',
      [rules.minLength(5)]
    );

    const appLinkAdress = await RequestValidationService.validateString(
      request,
      'appLinkAdress',
      []
    );

    const registeredUserData = await userService.register(user);
    if (registeredUserData) {
      await userService.sendConfirmationEmail(
        registeredUserData.email,
        registeredUserData.confirmationCode,
        appLinkAdress
      );
      response.status(200);
      registeredUserData.confirmationCode = '';
      return registeredUserData;
    }
  }

  //Confirm user registration token
  public async confirmToken({ params, response }: HttpContextContract) {
    if (params.token) {
      const userService = new UserService();
      if (await userService.confirmUserCode(params.token)) {
        response.status(200);
        return { message: 'User confirmed' };
      }
    }
  }

  //Login
  public async login({ request, auth }: HttpContextContract) {
    const userService = new UserService();

    const email = await RequestValidationService.validateEmail(
      request,
      'email'
    );

    const password = await RequestValidationService.validateString(
      request,
      'password',
      [rules.minLength(5)]
    );

    const userData = await userService.login(email, password, auth);

    return {
      APIToken: userData.APIToken,
      id: userData.user.id,
      email: userData.user.email,
      firstName: userData.user.firstName,
      lastName: userData.user.lastName,
      status: userData.user.status,
    };
  }

  //Loggout
  public async loggout({ auth }: HttpContextContract) {
    return await auth.logout();
  }

  //Edit some user data
  public async edit({ auth, request }: HttpContextContract) {
    const userService = new UserService();

    const currentUser = await auth.authenticate();

    const firstName = await RequestValidationService.validateString(
      request,
      'first_name',
      [rules.minLength(2), rules.maxLength(120)]
    );

    const lastName = await RequestValidationService.validateString(
      request,
      'last_name',
      [rules.minLength(2), rules.maxLength(120)]
    );

    return await userService.edit(currentUser, firstName, lastName);
  }

  //Get user data
  public async getMyData({ auth }: HttpContextContract) {
    //return await auth.authenticate();
    const user = User.query()
      .where('id', (await auth.authenticate()).id)
      .preload('contacts');

    return user;
  }

  //Update user password
  public async updatePassword({ request, auth }: HttpContextContract) {
    const userService = new UserService();

    const user = await auth.authenticate();

    const newPassword = await RequestValidationService.validateString(
      request,
      'newPassword',
      [rules.minLength(5)]
    );

    const tokenData = await userService.updatePassword(user, auth, newPassword);
    return { user: tokenData.user, token: tokenData.token };
  }

  //Generates the reset code for Forgotten password
  public async forgotPassword({ request, response }: HttpContextContract) {
    const userService = new UserService();

    const email = await RequestValidationService.validateEmail(
      request,
      'email'
    );

    const appLinkAdress = await RequestValidationService.validateString(
      request,
      'appLinkAdress',
      []
    );

    const rptData = await userService.forgotPassword(email);
    if (rptData) {
      await userService.sendResetPasswordEmail(
        email,
        rptData.resetCode,
        appLinkAdress
      );
    }

    response.status(200);
    return {
      message:
        'Caso você tenha um usuário válido, um email de recuperação de senha foi enviado',
    };
  }

  //Reset password using the reset code
  public async resetPassword({ params, request, auth }: HttpContextContract) {
    const userService = new UserService();

    const newPassword = await RequestValidationService.validateString(
      request,
      'newPassword',
      [rules.minLength(5)]
    );

    const user = await userService.validateResetPasswordToken(params.resetCode);
    if (user) {
      const userUpdated = await userService.updatePassword(
        user,
        auth,
        newPassword
      );
      if (userUpdated) {
        await userService.destroyResetToken(params.resetCode);
        return userUpdated;
      }
    }
  }

  public async getUserFromRPT({ request }) {
    const userService = new UserService();

    const rpt = await RequestValidationService.validateString(
      request,
      'rpt',
      []
    );

    const user = await userService.validateResetPasswordToken(rpt);
    if (user) {
      return { email: user.email };
    }
  }

  //Recover inactivated user
  public async recoverUser({ request, response }: HttpContextContract) {
    const userService = new UserService();
    const email = await RequestValidationService.validateEmail(
      request,
      'email'
    );
    const appLinkAdress = await RequestValidationService.validateString(
      request,
      'appLinkAdress',
      []
    );

    const user = await userService.getInactiveUser(email);
    await userService.generateRecoverToken(user);

    await userService.sendRecoverUserEmail(
      email,
      user.rememberMeToken ?? '',
      appLinkAdress
    );

    response.status(200);
    return { message: `Recover email send to ${user.email}` };
  }

  //Confirm token to reactivate userr
  public async confirmRecoverToken({
    request,
    params,
    response,
  }: HttpContextContract) {
    const newPassword = await RequestValidationService.validateString(
      request,
      'newPassword',
      [rules.minLength(5)]
    );
    if (params.token) {
      const userService = new UserService();

      const user = await userService.validateRestoreUserToken(params.token);

      user.password = newPassword;
      await userService.reactivateUser(user);

      response.status(200);
      return { message: `User ${user.email} recovered` };
    }
  }

  //Set user as inactive
  public async delete({ response, auth }: HttpContextContract) {
    const user = await auth.authenticate();
    const userService = new UserService();
    await userService.inactivateUser(user);
    response.status(200);
    return { message: `User ${user.email} is now inactive` };
  }

  public async createContact({ auth, request }: HttpContextContract) {
    const user = await auth.authenticate();
    const userService = new UserService();
    const contact = new Contact();

    contact.data = await RequestValidationService.validateString(
      request,
      'data',
      []
    );

    contact.contactTypeId = await RequestValidationService.validateNumber(
      request,
      'contactTypeId',
      [rules.exists({ table: 'contact_types', column: 'id' })]
    );
    return await userService.saveContact(user, contact);
  }

  public async deleteContact({ auth, params }: HttpContextContract) {
    const user = await auth.authenticate();
    const userService = new UserService();

    return await userService.deleteContact(user, params.id);
  }
}
