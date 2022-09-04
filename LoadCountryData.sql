USE TestSchema;

LOAD DATA LOCAL INFILE '/Users/kshitiz/AQI Visualizer/countryIndex.csv' INTO TABLE `Country` FIELDS TERMINATED BY ','
IGNORE 1 ROWS;