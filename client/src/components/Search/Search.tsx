import { AiOutlineSearch } from "react-icons/ai";

interface SearchProps {
  searchPosts: (query: string) => void;
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
}

const Search: React.FC<SearchProps> = ({ searchPosts, setSearch, search }) => {
  return (
    <div className="w-full flex justify-center items-center ">
      <div className="rounded-md w-full lg:w-1/2 outline-none border relative">
        <div className="opacity-50 absolute left-3 top-3">
          <AiOutlineSearch size={24} />
        </div>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          type="text"
          className="pl-12 pr-4 py-3 w-4/6 lg:w-5/6 outline-none"
          placeholder="Введите желаемую квартиру"
        />
        <button
          onClick={() => searchPosts(search)}
          className="px-1 py-2 w-2/6 lg:w-1/6 border-l text-md "
        >
          Найти
        </button>
      </div>
    </div>
  );
};

export default Search;
