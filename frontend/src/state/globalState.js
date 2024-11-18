import { atom } from 'recoil';

const workspace = atom({
    key: 'workspace', // Unique ID for this atom
    default: '', // Default value
  });

export { workspace };
