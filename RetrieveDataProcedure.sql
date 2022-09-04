USE TestSchema;

DELIMITER $$ 
CREATE PROCEDURE `RetrieveAllData` (IN timestamplow DOUBLE, IN timestamphigh DOUBLE, IN code INT)
BEGIN

SELECT * FROM `AQI Table` WHERE `AQI Table`.timeStamp  >= timestamplow AND `AQI Table`.timeStamp < timestamphigh AND code = countryCode;

END$$
DELIMITER ;

DELIMITER $$ 
CREATE PROCEDURE `RetrieveMeanData` (IN timestamplow DOUBLE, IN timestamphigh DOUBLE, IN code INT)
BEGIN

SELECT Country,avg(AQI) FROM `AQI Table` WHERE `AQI Table`.timeStamp  >= timestamplow AND `AQI Table`.timeStamp < timestamphigh AND code = countryCode GROUP BY Country;

END$$
DELIMITER ;

DELIMITER $$ 
CREATE PROCEDURE `RetrieveCountries` ()
BEGIN

SELECT * From Country;

END$$
DELIMITER ;

