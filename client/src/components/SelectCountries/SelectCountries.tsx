import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { citySlice } from "@/store/reducers/useCity";
import Select from "react-select";

interface Option {
  value: string;
  label: string;
}

const CountrySelect = () => {
  const { city } = useAppSelector((state) => state.cityReducer);
  const { setCity } = citySlice.actions;
  const dispatch = useAppDispatch();

  const handleChange = (selectedOption: any) => {
    dispatch(setCity(selectedOption.label));
  };

  const options: Option[] = [
    { value: "almaty", label: "Алматы" },
    { value: "nur-sultan", label: "Астана" },
    { value: "shymkent", label: "Шымкент" },
    { value: "karaganda", label: "Караганда" },
    { value: "aktobe", label: "Актобе" },
    { value: "taraz", label: "Тараз" },
    { value: "pavlodar", label: "Павлодар" },
    { value: "ust-kamenogorsk", label: "Усть-Каменогорск" },
    { value: "oral", label: "Орал" },
    { value: "atyrau", label: "Атырау" },
    { value: "kokshetau", label: "Кокшетау" },
    { value: "temirtau", label: "Темиртау" },
    { value: "taldykorgan", label: "Талдыкорган" },
    { value: "ekibastuz", label: "Экибастуз" },
    { value: "rudny", label: "Рудный" },
    { value: "kyzylorda", label: "Кызылорда" },
    { value: "kostanay", label: "Костанай" },
    { value: "petropavl", label: "Петропавловск" },
    { value: "aktau", label: "Актау" },
    { value: "turkestan", label: "Туркестан" },
    { value: "zhanaozen", label: "Жанаозен" },
  ];

  return (
    <div className="relative z-50">
      <Select
        className="basic-single"
        classNamePrefix="select"
        defaultValue={options[0]}
        value={options.find((option) => option.label === city)}
        onChange={handleChange}
        isClearable={true}
        isSearchable={true}
        name="color"
        options={options}
      />
    </div>
  );
};

export default CountrySelect;
