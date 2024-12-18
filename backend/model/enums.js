/**
 * STATUS - Represents the various states a report can have in the workflow.
 */
const STATUS = {
  OPEN: 'OPEN',         // The report is open and being worked on
  FINISHED: 'FINISHED', // The report is completed
  PENDING: 'PENDING',   // The report was sent and is waiting for acceptance
};
  
/**
 * STATIONS - Represents the different stations in the workflow.
 */
const STATIONS = {
  STORAGE: 'Storage',        // The station where items are stored or inventoried
  PRODUCTION: 'Production',  // The station where items are manufactured or assembled
  PACKING: 'Packing',        // The station where items are packed and prepared for shipment
};

module.exports = { STATUS, STATIONS };
