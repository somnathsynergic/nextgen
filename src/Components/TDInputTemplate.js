import React from "react";
import Select from 'react-dropdown-select';
import { Flex, Spin } from 'antd';
import { LoadingOutlined } from "@ant-design/icons";
function TDInputTemplate(props) {
  // const TDInputTemplate = React.memo((props) => {
  return (
    <>
      <label
        htmlFor={props.name}
        className="block mb-2 text-sm capitalize font-bold text-green-900 dark:text-gray-100"
      >
        {props.mode != 3
          ? props.label
          : (props.label || "") +
            " (" +
            props.formControlName?.length +
            "/5000)"}  
      </label>
      {props.mode == 1 && (
        <div className="relative">
        <input
          autoComplete="off"
          type={props.type}
          id={props.name}
          name={props.name}
          value={props.formControlName}
          multiple={props.multiple}
          min={props.min}
          accept={props.accept}
          max={props.max}
          setFieldValue={props.setFieldValue}
          onKeyDown={(e) => {
            if (props.type == "date") e.preventDefault();
          }}
          className="bg-white border-gray-400  text-gray-800 text-sm rounded-md  focus:border-green-900 active:border-green-600 focus:ring-green-600 focus:border-1 duration-500 block w-full p-1 dark:bg-bg-white dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
          placeholder={props.placeholder}
          onChange={props.handleChange}
          onFocus = {props.handleFocus}
          onBlur={props.handleBlur}
          disabled={props.disabled}
        />
        {props.loading &&
         <Spin className="absolute right-2 top-2 font-bold" indicator={<LoadingOutlined spin />} size="small" />}
        </div>
      )}
      {props.mode == 2 && (
        // <Select
        //   showSearch
        //   className="bg-gray-50 border text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full dark:bg-bg-white dark:border-gray-600 dark:placeholder-gray-400 "
        //   name={props.name}
        //   value={props.formControlName}
        //   placeholder={props.placeholder}
        //   onChange={(value,key) => {console.log(value,key);props.handleChange({ target: { name: props.name,value } })}}
        //   onBlur={() => props.handleBlur({ target: { name: props.name } })}
        //   optionFilterProp="label"
        //   size={"large"}
        //   options={props.data}
        // />
        // <Dropdown
        // className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg  focus:border-green-900 active:border-green-900 focus:ring-green-900 focus:border-1 duration-300 block w-full p-1.5 dark:bg-bg-white dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
        // filter
        // value={props.formControlName}
        // onChange={props.handleChange}
        // name={props.name}
        // placeholder={props.placeholder}
        // options={props?.data}
        // optionLabel="name"
        // onBlur={props.handleBlur}
        // />
        <select
          className="bg-white border-1 border-gray-400 text-gray-800 text-sm rounded-lg  focus:border-green-900 active:border-green-600 focus:ring-green-600 focus:border-1 duration-500 block w-full p-1 dark:bg-bg-white dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
          value={props.formControlName}
          onChange={props.handleChange}
          name={props.name}
          id={props.name}
          placeholder={props.placeholder}
          options={props?.data}
          onBlur={props.handleBlur}
          disabled={props.disabled}
        >
          <option selected>{props.placeholder}</option>
          {props?.data?.map((item, index) => (
            <option value={item?.code}>{item?.name}</option>
          ))}
        </select>
      )}
      {props.mode == 3 && (
        <textarea
          autoComplete="off"
          rows="4"
          className="bg-white border-1 border-gray-400 text-sm rounded-lg  focus:border-green-900 active:border-green-600 focus:ring-green-600 focus:border-1 duration-500 block w-full p-1.5 dark:bg-bg-white dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
          name={props.name}
          id={props.name}
          value={props.formControlName}
          placeholder={props.placeholder}
          onChange={props.handleChange}
          onBlur={props.handleBlur}
          disabled={props.disabled}
          maxLength={5000}
        />
      )}

      {props.mode == 4 && (
        <Select
          //  options={projectList}

          value={props.formControlName}
          onChange={props.handleChange}
          name={props.name}
          id={props.name}
          placeholder={props.placeholder}
          options={props?.data}
          onBlur={props.handleBlur}
          disabled={props.disabled}
          //  onChange={(values) => console.log(values)}
        />
      )}
    </>
  );
}


export default TDInputTemplate;
