import * as migration_20261002_091345_initial from './20261002_091345_initial';

export const migrations = [
  {
    up: migration_20261002_091345_initial.up,
    down: migration_20261002_091345_initial.down,
    name: '20261002_091345_initial'
  },
];
