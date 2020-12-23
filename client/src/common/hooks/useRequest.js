import { useContext } from "react";
import { UserContext } from "../../Routes";
import { request } from "../utilities";

//creating a custom made hook that authorises a user when called
const useRequest = () => {
  //using global context so user can be accessed
  const { user } = useContext(UserContext);

  return async (resourceType, options = {}) =>
    await request(resourceType, {
      ...options,
      headers: {
        ...options.headers,
        //gives current users id
        Authorization: user.id,
      },
    });
};

export default useRequest;
