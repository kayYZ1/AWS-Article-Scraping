import { ChangeEvent, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Input, Spin, Alert, Select, Empty } from "antd";
import axios from "axios"

import CardComponent from "./Card";
import NewspaperEmpty from "/newspaper-154444.svg"
import styles from "../styles/Components.module.css"

import { IArticle } from "../shared/interfaces";
import { dateOptions, siteOptions } from "../shared/selectOptions";
import { articleFilterByDate, fetchAdditionalWebsites, removeFilter } from "../shared/functions";
import { customDescription } from "../shared/custom";

const SearchComponent = () => {
  const [value, setValue] = useState("");
  const [websites, setWebsites] = useState<string[]>([])

  const [articles, setArticles] = useState<IArticle[] | null>(null) //main data state
  const [sortedArticles, setSortedArticles] = useState<IArticle[] | null>(null) //sorted data state
  const [selectedOption, setSelectedOption] = useState<string>();

  const [valueErr, setValueErr] = useState(false)

  const { refetch, isInitialLoading, isError, isRefetching } = useQuery(
    ["query", value],
    async () => {
      const { data } = await axios.post(import.meta.env.VITE_LAMBDA_API, { value, websites })
      if (!articles || articles.length === 0) {
        setArticles(data)
      } else {
        setArticles((prev: any) => [...prev, ...data])
        if (selectedOption) {
          setSortedArticles((prev: any) => [...prev, ...data])
        }
      }
      return data;
    }
  );

  const onClick = () => {
    if (value !== "") {
      if (articles) {
        const refetchWebsites: string[] = fetchAdditionalWebsites(websites)
        setWebsites(refetchWebsites)
        refetch();
      } else {
        refetch();
      }
    }
    else {
      setValueErr(true)
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target?.value);
  };

  const handleSelectDateChange = (option: string) => {
    setSelectedOption(option);
    if (option == "dateAsc" || option == "dateDesc") {
      const result: IArticle[] | any = articleFilterByDate(option, articles)
      setSortedArticles(result)
    }
  };

  const handleSelectSiteChange = (options: string[]) => {
    setWebsites(options)
  };

  const handleAllowClear = () => {
    if (websites.length === 0) {
      setSortedArticles(null)
      setArticles(null)
    } else {
      setSortedArticles(null)
    }
  }

  const handleDeselect = (option: string) => {
    const result: IArticle[] | any = removeFilter(option, articles)
    if (result.length === 0) {
      setArticles(null)
      setSortedArticles(null)
    } else {
      setArticles(result)
    }
  }

  return (
    <div className={styles.search}>
      <Input.Search
        placeholder="Search for articles"
        value={value}
        onChange={handleInputChange}
        onSearch={onClick}
        enterButton
        style={{ width: 300, marginTop: 10 }}
        loading={isRefetching ? true : false}
      />
      <Select
        mode="multiple"
        allowClear
        style={{ width: 300, marginTop: 10 }}
        placeholder="Website options"
        onChange={handleSelectSiteChange}
        onDeselect={handleDeselect}
        options={siteOptions}
      />
      {articles && articles.length > 1 ? (
        <>
          <Select
            style={{ width: 300, marginTop: 10 }}
            allowClear
            onChange={handleSelectDateChange}
            options={dateOptions}
            onClear={handleAllowClear}
            placeholder="Sorting options"
          />
        </>
      ) : ""}
      {isInitialLoading ? <Spin style={{ marginTop: 250 }} size="large" /> : ""}
      {isError ? (
        <Alert
          message="Error fetching data"
          type="error"
          banner
          closable
          style={{ marginTop: 10 }}
        />
      ) : (
        ""
      )}
      {articles && articles.length === 0 ?
        <Empty image={NewspaperEmpty} style={{ marginTop: 30 }} description={customDescription} /> : ""}
      {valueErr ?
        <Alert message="Please be more specific" type="info" banner closable
          onClose={() => setValueErr(false)} style={{ marginTop: 10 }} /> : ""}
      <div className={styles.articles}>
        {selectedOption ? (
          sortedArticles && sortedArticles.map((article: IArticle, index: number) => (
            <CardComponent {...article} key={index} />
          ))
        ) : (
          articles && articles.map((article: IArticle, index: number) => (
            <CardComponent {...article} key={index} />
          ))
        )}
      </div>
    </div>
  );
};

export default SearchComponent;
