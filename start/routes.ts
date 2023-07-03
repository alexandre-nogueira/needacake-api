/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from '@ioc:Adonis/Core/Route';

Route.get('/', async () => {
  return { hello: 'world' };
});

//User - no token
Route.group(() => {
  Route.post('register', 'UsersController.register');
  Route.post('login', 'UsersController.login');
  Route.get('confirm/:token', 'UsersController.confirmToken');
  Route.post('forgotPassword', 'UsersController.forgotPassword');
  Route.post('resetPassword/:resetCode', 'UsersController.resetPassword');
  Route.post('recover', 'UsersController.recoverUser');
  Route.post(
    'confirmRecoverToken/:token',
    'UsersController.confirmRecoverToken'
  );
  Route.post('getUserFromRPT', 'UsersController.getUserFromRPT');
}).prefix('user');

//User - token needded
Route.group(() => {
  Route.get('logout', 'UsersController.loggout');
  Route.get('myData', 'UsersController.getMyData');
  Route.post('updatePassword', 'UsersController.updatePassword');
  Route.delete('', 'UsersController.delete');
  Route.patch('', 'UsersController.edit');
})
  .prefix('user')
  .middleware('auth:api');
