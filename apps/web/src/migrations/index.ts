import * as migration_20261005_073536_initial from './20261005_073536_initial';
import * as migration_20261021_102939_contact_form_answers from './20261021_102939_contact_form_answers';
import * as migration_20261021_120000_hero_video_v2 from './20261021_120000_hero_video_v2';
import * as migration_20261021_130000_tomorrow_photo from './20261021_130000_tomorrow_photo';

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
  {
    up: migration_20261021_120000_hero_video_v2.up,
    down: migration_20261021_120000_hero_video_v2.down,
    name: '20261021_120000_hero_video_v2',
  },
  {
    up: migration_20261021_130000_tomorrow_photo.up,
    down: migration_20261021_130000_tomorrow_photo.down,
    name: '20261021_130000_tomorrow_photo',
  },
];
