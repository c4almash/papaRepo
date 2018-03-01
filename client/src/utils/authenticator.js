import axios from 'axios';

const userKey = Object.keys(window.localStorage)
  .filter(it => it.startsWith('firebase:authUser'))[0];

const user = userKey ? JSON.parse(localStorage.getItem(userKey)) : undefined;

const userData = {
  username: user.email,
  displayname: user.displayName,
  profilePic: user.photoURL,
};


export default {
  onBeforeChange: async (dispatch, getState) => {
    const authUser = getState().firebaseUser;
    const currUser = getState().currentUser;
    if (!!user && !currUser) {
      console.log('in here')
      // let updatedUserFromDatabase = await axios.get(`/api/${username}/current`);
      const updatedUserFromDatabase = await axios.get(`/api/Papa@gmail.com/current`);
      dispatch({
        type: 'USER_RECIEVED',
        payload: updatedUserFromDatabase,
      });
    }
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

