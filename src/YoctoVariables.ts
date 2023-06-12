import { Model } from 'sequelize';

export type YoctoVariable = {
  name: string,
  content: string,
};

// define Model
export class YoctoVariableModel extends Model {
  declare name: string;
  declare content: string;
}
