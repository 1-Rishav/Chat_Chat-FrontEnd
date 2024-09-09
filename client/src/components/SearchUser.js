import React, { useEffect, useState } from "react";
import { CgSearch } from "react-icons/cg";
import Loading from "./Loading";
import UserSearchCard from "./UserSearchCard";
import { toast } from "react-toastify";
import axios from "axios";
import { RiCloseCircleLine } from "react-icons/ri";


function SearchUser({onClose}) {
  const [searchUser, setSearchUser] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const handleSearchUser = async () => {
    try {
      const URL = `${process.env.REACT_APP_BACKEND_URL}/api/search-user`;
      setLoading(true);
      const response = await axios.post(URL, {
        search: search,
      });
      setLoading(false);
      setSearchUser(response.data.data);
    } catch (error) {
      toast.error(error.response?.data?.message);
    }
  };
  useEffect(() => {
    handleSearchUser();
  }, [search]);
  console.log("search", searchUser);
  return (
    <div className="fixed top-0 bottom-0 left-0 right-0 bg-slate-700 bg-opacity-40 p-2 z-10">
      <div className="w-full max-w-lg mx-auto mt-10">
        {/* input search user */}
        <div className="bg-white rounded h-16 flex overflow-hidden">
          <input
            type="text"
            placeholder="search user by name, email..."
            className="w-full outline-none py-1 h-full px-4"
            onChange={(e) => setSearch(e.target.value)}
            value={search}
          />
          <div className="h-16 w-16 flex justify-center items-center">
            <CgSearch size={25} />
          </div>
        </div>
        {/* Diplay search user */}
        <div>
          <div className="bg-white mt-2 w-full h-[calc(100vh-45vh)] p-4 rounded overflow-x-hidden overflow-y-auto scrollbar ">
            {/* No user found */}
            {searchUser.length === 0 && !loading && (
              <p className=" text-center text-slate-500">No user found</p>
            )}
            {loading && <Loading />}
            {searchUser.length !== 0 &&
              !loading &&
              searchUser.map((user, index) => {
                return <UserSearchCard key={user._id} user={user} onClose={onClose}/>;
              })}
          </div>
        </div>
      </div>
      <div className="absolute top-0 right-0 text-2xl p-2 lg:text-4xl hover:text-white" onClick={onClose}>
<button>
<RiCloseCircleLine size={25}/>
</button>
      </div>
    </div>
  );
}

export default SearchUser;
