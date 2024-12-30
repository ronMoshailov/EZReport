/**
 * STATUS - Represents the various states a report can have in the workflow.
 */
const STATUS = {
  OPEN: 'OPEN',           // The report is open and waiting being worked on
  IN_WORK: 'IN_WORK',     // The report is actively being worked on
  FINISHED: 'FINISHED',   // The report has completed the process at all stations
  PENDING: 'PENDING',     // The report was sent and is waiting for acceptance
};
  
/**
 * STATIONS - Represents the different stations in the workflow.
 */
const STATIONS = {
  STORAGE: 'Storage',         // The station where items are stored or inventoried
  PRODUCTION: 'Production',   // The station where items are manufactured or assembled
  PACKING: 'Packing',         // The station where items are packed and prepared for shipment
  FINISHED: 'Finished'        // 
};

module.exports = { STATUS, STATIONS };
