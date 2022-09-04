USE TestSchema;

LOAD DATA LOCAL INFILE '/Users/kshitiz/AQI Visualizer/modelData.csv' INTO TABLE `AQI Table` FIELDS TERMINATED BY ','
IGNORE 1 ROWS;