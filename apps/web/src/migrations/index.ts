import * as migration_20261005_073536_initial from './20261005_073536_initial';
import * as migration_20261021_102939_contact_form_answers from './20261021_102939_contact_form_answers';

export const migrations = [
  {
    up: migration_20261005_073536_initial.up,
    down: migration_20261005_073536_initial.down,
    name: '20261005_073536_initial',
  },
  {
    up: migration_20261021_102939_contact_form_answers.up,
    down: migration_20261021_102939_contact_form_answers.down,
    name: '20261021_102939_contact_form_answers',
  },
];
