import { useContext } from "react"
import { AuthContext } from "../../components/context/authContext"

  export default function Profile () {
    const context = useContext(AuthContext);
    if (!context) {
      return <div>Loading...</div>;
    }
    const { user } = context;
    return (
      <div className="">
        <h1 className="font-bold text-xl">Welcome {user.firstName} </h1>
      </div>
    )
  }
  