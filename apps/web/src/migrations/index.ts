import * as migration_20261002_081008_initial from './20261002_081008_initial';

export const migrations = [
  {
    up: migration_20261002_081008_initial.up,
    down: migration_20261002_081008_initial.down,
    name: '20261002_081008_initial'
  },
];
