import { Card, Tooltip } from 'antd';

import { IArticle } from '../shared/interfaces';
import { cutDescription } from '../shared/functions';

import styles from "../styles/Components.module.css"

const CardComponent = ({ link, title, description, image, date }: IArticle) => {
  const cardDescription = cutDescription(description)
  return (
    <div>
      <a href={link} style={{ textDecoration: "none", color: "inherit" }} target="_blank">
        <Card
          style={{ width: 300, marginTop: 10, boxSizing: "content-box" }}
          cover={
            <img
              className={styles.cardImg}
              src={image}
              loading="lazy"
            />
          }
          actions={[
            <Tooltip title="MM/DD/YYYY">
              <span>{date}</span>
            </Tooltip>,
          ]}
          hoverable={true}
        >
          <Card.Meta
            title={title}
            description={cardDescription}
          />
        </Card>
      </a>
    </div>
  )
}

export default CardComponent