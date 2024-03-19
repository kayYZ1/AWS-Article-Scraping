import SearchComponent from '../components/Search';

import styles from "../styles/Pages.module.css"

const HomePage = () => {
  return (
    <div className={styles.app}>
      <SearchComponent />
    </div>
  )
}

export default HomePage