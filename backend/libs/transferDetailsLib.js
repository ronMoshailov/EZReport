const TransferDetails = require('../model/TransferDetails');


// Create new transfer document
const createTransferDocument = async (transferData, session) => {
  try {
    const [newTransfer] = await TransferDetails.create([transferData], { session });
    return newTransfer;
  } catch (error) {
    console.error('Error in createTransferDocument: Creating transfer failed');
    throw new Error(error.message);
  }
};

// Get the transfer document (Called by reportLib)
const getTransferDocument = async (documentId) => {
  const lastDocument = await TransferDetails.findById(documentId)
  return lastDocument;
}

const recieveUpdate = async (lastTransferDocument, workspace, employeeId, session) => {

  const date = new Date();
  date.setHours(date.getHours() + 2);

  lastTransferDocument.received_worker_id = employeeId;
  lastTransferDocument.received_date = date;
  lastTransferDocument.received_workspace = workspace;
  await lastTransferDocument.save({ session })
  return lastTransferDocument;
}

module.exports = { createTransferDocument, recieveUpdate, getTransferDocument };
