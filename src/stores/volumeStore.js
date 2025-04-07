import { defineStore } from 'pinia';

export const useVolumeStore = defineStore('volume', {
  state: () => ({
    masterVolume: 100,
    seVolume: 100,
  }),
  changes: {
    setMasterVolume(volume) {
      this.masterVolume = volume;
    },
    setSeVolume(volume) {
      this.seVolume = volume;
    },
  },
  updated: {
    getMasterVolume: (state) => state.masterVolume,
    getSeVolume: (state) => state.seVolume,
  },
});