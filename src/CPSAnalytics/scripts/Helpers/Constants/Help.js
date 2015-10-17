export const cpsBuilder = {
  cpsOverview: `Overview about all connected Cyber-Physical Sytems (CPS).
 Creation of a CPS requires a name and at least one connection. Currently supported protocol:
MQTT, CoAP, OPC UA`,
  entities: `Overview about all entities. An entity is an arbitrary part of a CPS that
should be observed. Entities should be identified throughout the whole processing of the CPS.
Examples for Entities are: Sensors, Actuators, Products, Persons`,
  attributes: `Overview about all attributes of an entity. New attributes can be created with new
 subscriptions.`
};

export const visBuilder = {
  query: `Create a query to view data of a CPS. Arbitrary attrbutes of a CPS can be used for
the generation of a visualization. It is possible to mix attributes from different CPS.`,
  time: `Choose the time frame for the visualization. A historic visualization shows all data
 available for a specific time frame. A realtime visualization shows what is processed by the CPS
right now.`,
  visualization: `Choose from different visualization types to customize the graphs.`,
  beaconPositioner: `Define the size of the area the beacons should be placed. You can create beacons
and Drag & Drop them to their destionation.`
};
