import * as SecureStore from "expo-secure-store";

async function getValueFor() {
  let result = await SecureStore.getItemAsync("access_token");

  if (result) {
    return true;
  } else {
    return false;
  }
}


const useCheckLoginStatus = () => {
  return getValueFor();
};

export default useCheckLoginStatus;
