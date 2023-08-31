interface ItemProps {
  icon: any;
  label: string;
  text: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
}

const Item: React.FC<ItemProps> = ({ icon, label, text, setSearch }) => {
  return (
    <button
      onClick={() => setSearch(text)}
      className="opacity-60 hover:opacity-100  flex flex-col justify-center items-center border-b border-black cursor-pointer hover:scale-105 transition-all"
    >
      <div>{icon}</div>
      <p className="text-[12px] font-medium">{label}</p>
    </button>
  );
};

export default Item;
