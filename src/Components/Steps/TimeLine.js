import { Timeline } from "antd";
import React, { useEffect, useState } from "react";
import TIME from "../../../src/Assets/Images/time.svg";

function TimeLine({ data }) {
  const [timeline, setTimeline] = useState([]);
  const [timeline2, setTimeline2] = useState([]);
  const [search, setSearch] = useState("");
  useEffect(() => {
    setTimeline(
      timeline2.filter(
        (e) =>
          e.label.toLowerCase().includes(search.toLowerCase()) ||
          e.children.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search]);
  useEffect(() => {
    console.log(data);
    setTimeline(data);
    setTimeline2(data);
  }, [data]);
  return (
    <div className="mx-auto px-10 my-3">
      <input
        type="text"
        id="simple-search"
        class="bg-white absoulte shadow-lg sticky border-white focus:ring-white active:ring-white top-0 z-10 rounded-full text-gray-800 text-sm  block w-full dark:bg-gray-800 mx-auto duration-300 dark:placeholder-gray-400 dark:text-white "
        placeholder="Search"
        value={search}
        onChange={(text) => setSearch(text.target.value)}
      />
      {data.length > 0 ? (
        <Timeline className="my-4 mx-auto" mode={"left"} items={timeline} />
      ) : (
        <div className="flex flex-col justify-center items-center">
          <img src={TIME} className="h-52 w-60" />
          <span className="text-green-900 font-bold">
            Your timeline will come once a log is added
          </span>
        </div>
      )}
    </div>
  );
}

export default TimeLine;
