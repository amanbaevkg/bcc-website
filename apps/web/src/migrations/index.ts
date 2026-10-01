import * as migration_20261001_124405_initial from './20261001_124405_initial';

export const migrations = [
  {
    up: migration_20261001_124405_initial.up,
    down: migration_20261001_124405_initial.down,
    name: '20261001_124405_initial',
  },
];
