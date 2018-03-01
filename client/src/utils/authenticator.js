import axios from 'axios';

const userKey = Object.keys(window.localStorage)
  .filter(it => it.startsWith('firebase:authUser'))[0];

const user = userKey ? JSON.parse(localStorage.getItem(userKey)) : undefined;

const userData = !!user && {
  username: user.email,
  displayname: user.displayName,
  profilePic: user.photoURL,
};


export default {
  onBeforeChange: async (dispatch, getState) => {
    const authUser = getState().firebaseUser;
    if (!!user && !authUser) {
      dispatch({
        type: 'RELOAD_USER_STATE_SUCCESS',
        payload: userData,
      });
    }
  },
  onAfterChange: (dispatch, getState) => {
    const page = getState().location;
    const homeAlready = (page.type === 'LOGIN');
    if (!user && !homeAlready) {
      dispatch({ type: 'LOGIN' });
    }
  },
};

