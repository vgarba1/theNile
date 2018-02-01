DROP DATABASE IF EXISTS thesis;

CREATE DATABASE thesis;

USE thesis;

CREATE TABLE`product_info` (
  `id` INTEGER NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(75) NOT NULL,
  `category` VARCHAR(50),
  `price` INTEGER NOT NULL,
  `description` VARCHAR(255),
  `quantity` INTEGER NOT NULL,
  PRIMARY KEY (`id`)
);

CREATE TABLE`product_quantity` (
  `id` INTEGER NOT NULL AUTO_INCREMENT,
  `quantity` INTEGER NOT NULL,
  PRIMARY KEY (`id`)
);

ALTER TABLE product_quantity
ADD FOREIGN KEY (id) REFERENCES product_info(id);


INSERT INTO product_info (`name`,`category`,`price`,`description`, `quantity`)
VALUES ('test','test',140,'test', 50);

INSERT INTO product_quantity
VALUES (1, 10);