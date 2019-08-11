/* SDL */

CREATE TABLE IF NOT EXISTS `users` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(250),
    `password` VARCHAR(250),
    `firstName` VARCHAR(250),
    `lastName` VARCHAR(250),
    `token` VARCHAR(250),
    `tokenexpiredate` INT
);

CREATE TABLE IF NOT EXISTS `balance` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `type` VARCHAR(250),
    `amount` FLOAT,
    `added` INT
);

INSERT INTO `users` (id, name, password, firstName, lastName, token)
VALUES ('1', 'admin', '21232f297a57a5a743894a0e4a801fc3', 'Admin', 'Admin', '');