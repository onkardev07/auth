/* eslint-disable react/prop-types */

const Input = ({ icon: Icon, type, placeholder, value, onChange }) => {
  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        <Icon className="size-5"></Icon>
      </div>
      <input
        className=" bg-[#ebeced] pl-10 pr-3 py-2 bg-opacity-50 rounded-lg border-2 border-gray-400 text-black placeholder-gray-400 transition duration-200 w-full "
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      ></input>
    </div>
  );
};

export default Input;
