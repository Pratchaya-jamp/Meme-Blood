import { defineStore } from 'pinia';

export const useVolumeStore = defineStore('volume', {
  state: () => ({
    masterVolume: 100,
    seVolume: 100,
  }),
  actions: {
    setMasterVolume(volume) {
      this.masterVolume = volume;
    },
    setSeVolume(volume) {
      this.seVolume = volume;
    },
  },
  getters: {
    getMasterVolume: (state) => state.masterVolume,
    getSeVolume: (state) => state.seVolume,
  },
});