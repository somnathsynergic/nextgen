import { CloseCircleOutlined, FilterOutlined } from "@ant-design/icons";
import React, { useRef, useState } from "react";
import { OverlayPanel } from "primereact/overlaypanel";
import { motion } from "framer-motion";
import TDInputTemplate from "./TDInputTemplate";
import moment from "moment";
import VError from "./VError";
function CompositeSearch({ data, onSubmit, onReset,flag }) {
  const [visible, setVisible] = useState(false);
  const [set_one_val, setOne] = useState("");
  const [set_two_val, setTwo] = useState("");
  const [set_three_val, setThree] = useState("");
  const [set_four_val, setFour] = useState("");
  const [set_five_val, setFive] = useState("");
  const [set_six_val, setSix] = useState("");
  const [set_seven_val, setSeven] = useState("");
  const [set_eight_val, setEight] = useState("");
  const handleClickInside = (event) => {
    event.stopPropagation();
  };
  console.log(data);
  const op = useRef(null);
  return (
    <motion.button
      onClick={(e) => op.current.toggle(e)}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 1.5, type: "spring", stiffness: 100 }}
      className="text-green-900 hover:bg-[#C4F1BE] border-2 border-white hover:border-2 hover:border-white hover:duration-300 rounded-full w-auto min-w-52 mt-7 mb-4 flex justify-start items-center bg-white py-2 px-4 shadow-lg gap-4"
    >
      <FilterOutlined /> Advanced Search
     
      <OverlayPanel
        ref={op}
        className="flex justify-between gap-4 w-80 shadow-lg"
        onHide={() => setVisible(false)}
      >
        <p className="font-bold text-lg text-green-900">Search by </p>

        <div onClick={handleClickInside} className="gap-4 mt-5">
          <div className="flex justify-between gap-4 my-4">
            <div>
              <TDInputTemplate
                placeholder={''}
                type="text"
                label={data?.set_one_lbl}
                name={"set_one_val"}
                formControlName={set_one_val}
                handleChange={(val) => {
                  setOne(val.target.value);
                  console.log(val.target.value);
                }}
                mode={2}
                data={data?.set_one}
              />
            </div>
            <div>
              <TDInputTemplate
                placeholder={''}
                type="text"
                label={data?.set_two_lbl}
                name="set_two_val"
                formControlName={set_two_val}
                handleChange={(val) => {
                  setTwo(val.target.value);
                  console.log(val.target.value);
                }}
                mode={2}
                data={data?.set_two}
              />
            </div>
          </div>

          <div className={"flex justify-between gap-4"}>
            <div>
              <TDInputTemplate
                placeholder={`Select ${data?.set_three_lbl}`}
                type="text"
                label={data?.set_three_lbl}
                name={"set_three_val"}
                formControlName={set_three_val}
                handleChange={(val) => {
                  setThree(val.target.value);
                  console.log(val.target.value);
                }}
                mode={1}
                // data={data?.set_one}
              />
            </div>
            <div>
              <TDInputTemplate
                placeholder={''}
                type="text"
                label={data?.set_four_lbl}
                name={"set_four_val"}
                formControlName={set_four_val}
                handleChange={(val) => {
                  setFour(val.target.value);
                  console.log(val.target.value);
                }}
                mode={2}
                data={data?.set_four}
              />
            </div>
          </div>
          <div className=" w-full my-4">
              <TDInputTemplate
                placeholder={`Type ${data?.set_eight_lbl}`}
                type="text"
                label={data?.set_eight_lbl}
                name={"set_eight_val"}
                formControlName={set_eight_val}
                handleChange={(val) => {
                  setEight(val.target.value);
                  console.log(val.target.value);
                }}
                mode={1}
                // data={data?.set_one}
              />
          </div>
          <div className="flex justify-between gap-4 my-4">
            <div>
              <TDInputTemplate
                placeholder={`Select ${data?.set_five_lbl}`}
                type="date"
                label={data?.set_five_lbl}
                name={"set_five_val"}
                formControlName={set_five_val}
                handleChange={(val) => {
                  setFive(val.target.value);
                  console.log(val.target.value);
                }}
                min={moment(new Date(new Date().setFullYear(new Date().getFullYear() - 3))).format('yyyy-MM-DD')}
                max={moment(new Date()).format("yyyy-MM-DD")}
                mode={1}
                // data={data?.set_one}
              />
            </div>
            <div>
              <TDInputTemplate
                placeholder={`Select ${data?.set_six_lbl}`}
                type="date"
                label={data?.set_six_lbl}
                name={"set_six_val"}
                formControlName={set_six_val}
                handleChange={(val) => {
                  setSix(val.target.value);
                  console.log(val.target.value);
                }}
                mode={1}
                min={set_five_val}
                disabled={!set_five_val}
                data={[
                  { name: "General", code: "G" },
                  { name: "Project-Specific", code: "P" },
                ]}
              />
             {set_five_val && !set_six_val && <VError title={'Required'}/>}
            </div>

          </div>
         {flag==2 && <div className=" w-full my-4">
              <TDInputTemplate
                placeholder={`Select ${data?.set_seven_lbl}`}
                type="text"
                label={data?.set_seven_lbl}
                name={"set_seven_val"}
                formControlName={set_seven_val}
                handleChange={(val) => {
                  setSeven(val.target.value);
                  console.log(val.target.value);
                }}
                mode={1}
                // data={data?.set_one}
              />
          </div>
          
         }

        </div>

        <div className="flex gap-4 justify-between">
          <button
            type="submit"
            className=" disabled:bg-gray-400 disabled:dark:bg-gray-400 inline-flex items-center px-5 py-2.5 mt-4 sm:mt-6 text-sm border-2 border-green-900 font-medium text-center text-green-900 bg-white transition ease-in-out   rounded-full focus:ring-gray-600  dark:focus:ring-primary-900 dark:bg-[#22543d] dark:hover:bg-gray-600"
            onClick={() => {
              setOne("");
              setTwo("");
              setThree("");
              setFour("");
              setFive("");
              setSix("");
              setSeven("");
              setEight("");
              setVisible(false);
              onReset();
            }}
          >
            Reset
          </button>
          <button
            type="submit" 
            disabled={
              (!set_one_val || set_one_val == `Select ${data?.set_one_lbl}`) &&
              (!set_two_val || set_two_val == `Select ${data?.set_two_lbl}`) &&
              (!set_four_val ||  set_four_val == `Select ${data?.set_four_lbl}`) &&
              !set_three_val &&
              !set_eight_val && (flag==2 && !set_seven_val) && !set_six_val
            }
            className=" disabled:bg-gray-400 disabled:dark:bg-gray-400 inline-flex items-center px-5 py-2.5 mt-4 sm:mt-6 text-sm font-medium text-center text-white bg-green-900 transition ease-in-out   rounded-full focus:ring-gray-600  dark:focus:ring-primary-900 dark:bg-[#22543d] dark:hover:bg-gray-600"
            onClick={() => {
              console.log(set_one_val, set_two_val);
              setVisible(true);
              onSubmit({
                val_one: data?.set_one.filter((e) => e.code == set_one_val)[0]
                  ?.name,
                code_one: set_one_val,
                val_two: data?.set_two.filter((e) => e.code == set_two_val)[0]
                  ?.name,
                code_two: set_two_val,

                val_three: set_three_val,
                code_three: set_three_val,
                val_four: data?.set_four.filter(
                  (e) => e.code == set_four_val
                )[0]?.name,
                code_four: set_four_val,

                val_five: set_five_val,
                code_five: set_five_val,
                val_six: set_six_val,
                code_six: set_six_val,
                val_seven: set_seven_val,
                code_seven: set_seven_val,
                val_eight:set_eight_val,
                code_eight:set_eight_val
              });
            }}
          >
            Submit 
          </button>
        </div>
      </OverlayPanel>
    </motion.button>
  );
}

export default CompositeSearch;
