const TransferDetails = require('../model/TransferDetails');

/**
 * Creates a transfer document.
 * @param {Object} transferData - Data for the transfer document.
 * @param {Object} session - The MongoDB session for transactions.
 * @returns {Object} - The newly created transfer document.
 * @throws {Error} - Throws an error if creation fails.
 */
const createTransferDocument = async (transferData, session) => {
  try {
    const [newTransfer] = await TransferDetails.create([transferData], { session }); // Use session for transactional writes
    return newTransfer; // Return the created document directly
  } catch (error) {
    console.error('Error creating transfer document:', error.message);
    throw new Error(error.message);
  }
};

module.exports = { createTransferDocument };
