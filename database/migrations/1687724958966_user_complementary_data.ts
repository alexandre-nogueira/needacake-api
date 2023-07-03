import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class extends BaseSchema {
  protected tableName = 'users';

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('first_name', 120);
      table.string('last_name', 120);
      table.string('status', 20);
      table.string('confirmation_code');
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
