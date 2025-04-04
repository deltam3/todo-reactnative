import * as SecureStore from "expo-secure-store";

async function getValueFor() {
  let result = await SecureStore.getItemAsync("access_token");
  if (result) {
    return true;
  } else {
    return false;
  }
}

function useCheckLogin() {
  return getValueFor();
}

import { useState, useEffect } from "react";

const useCheckLoginStatus = () => {
  const [check, setCheck] = useState<any>(null);

  useEffect(() => {
    const checker = async () => {
      const data = await useCheckLogin();
      setCheck(data);
    };

    checker();
  }, []);

  return check;
};

export default useCheckLoginStatus;
