import defaultSettings from '@/settings';

const {
  title, showSettings, fixedHeader,
  sidebarLogo, showFooter, copyrights,
  customLinkTitle, customLink,
} = defaultSettings;

const state = {
  title: title,
  showSettings: showSettings,
  fixedHeader: fixedHeader,
  sidebarLogo: sidebarLogo,
  showFooter: showFooter,
  copyrights: copyrights,
  customLink: customLink,
  customLinkTitle: customLinkTitle,
};

const mutations = {
  CHANGE_SETTING: (state, {key, value}) => {
    // eslint-disable-next-line no-prototype-builtins
    if (state.hasOwnProperty(key)) {
      state[key] = value;
    }
  },
};

const actions = {
  changeSetting({commit}, data) {
    commit('CHANGE_SETTING', data);
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};

