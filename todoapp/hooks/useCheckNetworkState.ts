import * as Network from "expo-network";

const useCheckNetworkStatus = () => {
  const networkState = Network.useNetworkState();
  return networkState.isInternetReachable;
};

export default useCheckNetworkStatus;
