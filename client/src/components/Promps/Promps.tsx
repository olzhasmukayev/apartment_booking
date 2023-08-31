import { BiSolidDrink } from "react-icons/bi";
import { FaDog, FaMapMarkedAlt, FaShower } from "react-icons/fa";
import { FaMountainSun } from "react-icons/fa6";
import { GiSofa } from "react-icons/gi";
import { IoBarbellSharp, IoRestaurant } from "react-icons/io5";
import { MdFamilyRestroom, MdOutlineMoneyOffCsred } from "react-icons/md";
import { PiParkFill, PiStudentFill } from "react-icons/pi";
import Item from "./Item/Item";

interface PrompsProps {
  setSearch: React.Dispatch<React.SetStateAction<string>>;
}

const Promps: React.FC<PrompsProps> = ({ setSearch }) => {
  return (
    <div className="w-full py-4 flex gap-5 justify-between overflow-x-scroll z-0 rounded custom_scroll">
      <Item
        icon={<MdFamilyRestroom size={24} />}
        label="Семейные"
        text={"Поиск квартир, подходящих для семейного проживания."}
        setSearch={setSearch}
      />
      <Item
        icon={<FaDog size={24} />}
        label="С животными"
        text={"Поиск квартир, где разрешено проживание с домашними животными."}
        setSearch={setSearch}
      />
      <Item
        icon={<BiSolidDrink size={24} />}
        label="Для развлечений"
        text={
          "Поиск квартир в окрестностях с развлекательными заведениями и мероприятиями."
        }
        setSearch={setSearch}
      />
      <Item
        icon={<PiStudentFill size={24} />}
        label="Студентам"
        text={
          "Поиск квартир, подходящих для студентов. Возможно, рядом с университетами."
        }
        setSearch={setSearch}
      />
      <Item
        icon={<FaShower size={24} />}
        label="С душем"
        text={"Поиск квартир, которые оснащены душем."}
        setSearch={setSearch}
      />
      <Item
        icon={<MdOutlineMoneyOffCsred size={24} />}
        label="Без задатка"
        text={"Поиск квартир без необходимости вносить задаток при аренде."}
        setSearch={setSearch}
      />
      <Item
        icon={<FaMountainSun size={24} />}
        label="Рядом с горами"
        text={"Поиск квартир, расположенных рядом с горными районами."}
        setSearch={setSearch}
      />
      <Item
        icon={<FaMapMarkedAlt size={24} />}
        label="В центре"
        text={"Поиск квартир в центральных районах города."}
        setSearch={setSearch}
      />
      <Item
        icon={<PiParkFill size={24} />}
        label="Рядом с парком"
        text={"Поиск квартир, расположенных поблизости от парков."}
        setSearch={setSearch}
      />
      <Item
        icon={<IoRestaurant size={24} />}
        label="Рядом поесть"
        text={"Поиск квартир с хорошим выбором ресторанов и кафе поблизости."}
        setSearch={setSearch}
      />
      <Item
        icon={<GiSofa size={24} />}
        label="Меблирована"
        text={"Поиск меблированных квартир для аренды."}
        setSearch={setSearch}
      />
      <Item
        icon={<IoBarbellSharp size={24} />}
        label="Рядом зал"
        text={
          "Поиск квартир, расположенных недалеко от фитнес-залов или спортклубов."
        }
        setSearch={setSearch}
      />
    </div>
  );
};

export default Promps;
